"use client"
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MoveRight } from "lucide-react";
import { Badge } from "@app/components/dndComponents/ui/badge";
import { Button } from "@app/components/dndComponents/ui/button";
import { Card, CardHeader, CardContent } from "@app/components/dndComponents/ui/card";
import { cva } from "class-variance-authority";
import { cn } from "@lib/utils";
import ProfileAvatar from "../ui/ProfileAvatar";
import { useAppStateContext } from "@app/context/AppStatusContext";
import { TypeTask } from "@lib/types";
import { useMemo } from "react";

interface TaskCardProps {
  task: TypeTask;
  isOverlay?: boolean;
  className?: string;
  onClick?: () => void;
  isDragDisable?:boolean;
}

export type TaskType = "Task";

export interface TaskDragData {
  type: TaskType;
  task: TypeTask;
}

export function TaskCard({isDragDisable, task, isOverlay, className, onClick }: TaskCardProps) {
  const {appState, clinics} = useAppStateContext()

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: isDragDisable,
    attributes: {
      roleDescription: "Task",
    },
    
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-1 opacity-30",
        overlay: "taskCard dragging",
      },
    },
  });

  function handleHeaderClick(){
    console.log('clicked')
  }

  function handleCardOnClick(){
    if(onClick){
      onClick()
      

    }
  }

  const appUsers = appState.users
  const taskAssignee = appUsers.find(u => u.id == task.assigneeId)
  const taskAuthor = appUsers.find(u => u.id == task.createdBy)
  const taskAssigneeName = `${taskAssignee?.firstName} ${taskAssignee?.lastName}`
  const taskAuthorName = `${taskAuthor?.firstName} ${taskAuthor?.lastName}`
  const taskClinicName = clinics.find(c => c.id == task.clinicId)?.name || ""

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`sidedrawer-trigger ${variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })} ${className}`}
      {...attributes}
      {...listeners}
      onClick={handleCardOnClick} // This handles the click event for the entire card
    >
      <CardHeader className="px-3 py-3 space-between flex flex-row border-b-2 border-secondary relative">
        <Button
          variant="ghost"
          className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-pointer" // Changed to cursor-pointer for better UX
          onClick={handleHeaderClick}
        >
        </Button>
        <span className="font-semibold truncate">{task.name}</span>
        <div className="flex flex-col flex-nowrap text-xs text-stone-500 text-right ml-auto">
          <span>10/08/2024</span>
          <span>09:05 AM</span>
        </div>
      </CardHeader>
      <CardContent className={cn("pointer-events-none text-neutral-500 px-3 pt-3 pb-6 text-left whitespace-pre-wrap text-sm line-clamp-3 truncate max-h-[4.5rem] mb-2")}>
        <div dangerouslySetInnerHTML={{ __html: `${task.description}` }}>

        </div>
      </CardContent>
      <div className="p-3 flex flex-row gap-1">
        <div className="flex flex-row flex-nowrap gap-1 items-center">
        <div className="text-gray-400">
          <ProfileAvatar name={taskAuthorName}/>
        </div>
        <MoveRight size={16} strokeWidth={1} />
        <ProfileAvatar name={taskAssigneeName}/>
        </div>
        {taskClinicName && <Badge variant="outline" className="ml-auto bg-orange-200 opacity-80">{taskClinicName}</Badge>}
      </div>
    </Card>
  );
}
