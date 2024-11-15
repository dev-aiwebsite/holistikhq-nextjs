"use client"
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useDndContext, type UniqueIdentifier } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useMemo } from "react";
import { cva } from "class-variance-authority";
import { GripVertical } from "lucide-react";
import { Button } from "@app/components/dndComponents/ui/button";
import { Card, CardHeader, CardContent } from "@app/components/dndComponents/ui/card";
import { ScrollArea, ScrollBar } from "@app/components/dndComponents/ui/scroll-area";
import { TaskCard } from "@app/components/dndComponents/TaskCard";
import { cn } from "@lib/utils";
import { BoardStatus, Task } from "@prisma/client";
import { useDrawerContext } from "@app/context/DrawerContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FormUpdateTask from "../forms/FormUpdateTask";
import { TypeBoardWithStatus } from "@lib/types";



export type Column = BoardStatus

export type ColumnType = "Column";

export interface ColumnDragData {
  type: ColumnType;
  column: Column;
}

interface BoardColumnProps {
  column: Column;
  tasks: Task[];
  isOverlay?: boolean;
}

export function BoardColumn({ column, tasks, isOverlay }: BoardColumnProps) {
  const {isOpen, openDrawer, getOnCloseHandlers, addOnCloseHandler} = useDrawerContext()
  const router = useRouter()
  const searchParams = useSearchParams();
  const pathname = usePathname()
  const selectedTaskId = searchParams.get('t')
  
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.name}`,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva(
    "w-[300px] bg-transparent max-w-full flex flex-col flex-shrink-0 snap-center",
    {
      variants: {
        dragging: {
          default: "border-2 border-transparent",
          over: "ring-1 opacity-30",
          overlay: "ring-1 ring-primary",
        },
      },
    }
  );

  function removeParameterTask(){
    router.push(`${pathname}`);
  }

  const taskCardClickHandler = (taskId:string)=>{
    const headerItem = <button type="button" className="btn small btn-outlined text-grey-500">Mark as Complete</button>
    openDrawer(<FormUpdateTask  key={taskId}  taskId={taskId}/>, headerItem)
    router.push(`${pathname}?t=${taskId}`);
    addOnCloseHandler(removeParameterTask)
  }

  useEffect(()=> {
    const task = tasks.find(task => task.id == selectedTaskId)
    if(task){
      taskCardClickHandler(task.id)
    }
  },[])




  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`${variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })} border-0` }
    >
      <CardHeader className="p-0 flex flex-row space-between items-center"
      {...attributes}
      {...listeners}
  
      >
        <span className="text-app-blue-500 text-xl"> {column.name}</span>
          
          <Button
          variant={"ghost"}
          className={cn("p-1 text-primary/50 ml-auto h-auto cursor-grab relative !pointer-events-auto")}
        >
        </Button>
        
      </CardHeader>
      <div className="overflow-auto h-[1px] flex-1 bg-app-brown-300 rounded-[2.5rem] border-[.5rem] border-app-brown-300">
        <CardContent className="flex flex-grow flex-col gap-2 p-0">
          <SortableContext  items={tasksIds}>
            {tasks.map((task) => (
              
              <TaskCard key={task.id} task={task} onClick={() => taskCardClickHandler(task.id)} className="taskCard"/>
              
            ))}
          </SortableContext>
        </CardContent>
      </div>
    </Card>
  );
}

export function BoardContainer({className, children }: {className?:string, children: React.ReactNode }) {
  const dndContext = useDndContext();

  const variations = cva("px-2 md:px-0 flex lg:justify-center pb-4", {
    variants: {
      dragging: {
        default: "snap-x snap-mandatory",
        active: "snap-none",
      },
    },
  });

  return (
    <ScrollArea
      className={variations({
        dragging: dndContext.active ? "active" : "default",
      })}
    >
      <div className={cn("max-h-[800px] flex gap-4 flex-row justify-center", className)}>
        {children}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}