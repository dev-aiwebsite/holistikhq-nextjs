"use client"
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";


import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  useSensor,
  useSensors,
  KeyboardSensor,
  Announcements,
  UniqueIdentifier,
  TouchSensor,
  MouseSensor,
  PointerSensor,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";

import { Column, BoardContainer, BoardColumn } from "./BoardColumn";
import { coordinateGetter } from "./multipleKeyboard";
import { TaskCard } from "./TaskCard";
import { hasDraggableData } from "./utils";
import { _getBoards, _getTasks, _updateTask } from "@lib/server_actions/database_crud";
import { Task } from "@prisma/client";
import { useAppStateContext } from "@app/context/AppStatusContext";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ListFilter, Plus, Rows3, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { BoardIcon, WorkflowIcon } from "public/svgs/svgs";
import { Toggle } from "../ui/toggle";
import DialogAutomations from "../dialogs/DialogAutomations";
import { CompleteTaskWithRelations } from "@lib/types";

export function KanbanBoard({ className, boardId }: { className?: string, boardId: string }) {
  const Router = useRouter()

  const { appState, setappState } = useAppStateContext()
  const boardData = appState.currentUser.boards.find(board => board.id == boardId)
  const [columns, setColumns] = useState<Column[]>(boardData?.BoardStatus || []);
  const [filters,setFilters] = useState({assignee:""})
  const columnsId = columns.map(c => c.id)

  let tasks = appState.tasks

  useEffect(() => {
    let columnsId = columns.map(c => c.id)
    _getTasks({
      statusId: {
        in: columnsId
      }
    })
    .then(res => {
      if (res.success) {
        console.log(res, 'kanbanboard getTasks')
        setappState((prevState) => {
          const newState = { ...prevState }
          newState.tasks = res.tasks
          return newState
        })
      }
    })

  }, [])
  console.log(tasks, 'task from kanbanboard')

  const pickedUpTaskColumn = useRef<string | null>(null);


  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [activeTask, setActiveTask] = useState<CompleteTaskWithRelations | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: coordinateGetter
    })
  );

  function getDraggingTaskData(taskId: UniqueIdentifier, columnId: string) {
    const tasksInColumn = tasks?.filter((task) => task.statusId === columnId);
    const taskPosition = tasksInColumn?.findIndex((task) => task.id === taskId);
    const column = columns.find((col) => col.id === columnId);

    return {
      tasksInColumn,
      taskPosition,
      column,
    };
  }

  const announcements: Announcements = {
    onDragStart({ active }) {
      if (!hasDraggableData(active)) return;
      if (active.data.current?.type === "Column") {
        const startColumnIdx = columnsId.findIndex((id) => id === active.id);
        const startColumn = columns[startColumnIdx];
        return `Picked up Column ${startColumn?.name} at position: ${startColumnIdx + 1
          } of ${columnsId.length}`;
      } else if (active.data.current?.type === "Task") {
        pickedUpTaskColumn.current = active.data.current.task.statusId;
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          active.id,
          pickedUpTaskColumn.current
        );

        const message = `Picked up Task ${active.data.current.task.description
          } at position: ${taskPosition && taskPosition + 1} of ${tasksInColumn?.length
          } in column ${column?.name}`;

        return message
      }
    },
    onDragOver({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) return;

      if (
        active.data.current?.type === "Column" &&
        over.data.current?.type === "Column"
      ) {
        const overColumnIdx = columnsId.findIndex((id) => id === over.id);
        return `Column ${active.data.current.column.name} was moved over ${over.data.current.column.name
          } at position ${overColumnIdx + 1} of ${columnsId.length}`;
      } else if (
        active.data.current?.type === "Task" &&
        over.data.current?.type === "Task"
      ) {
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          over.data.current.task.statusId
        );
        const newTaskPosition = taskPosition && taskPosition + 1
        const newTaskInColumnLength = tasksInColumn?.length

        if (over.data.current.task.statusId !== pickedUpTaskColumn.current) {



          return `Task ${active.data.current.task.description
            } was moved over column ${column?.name} in position ${newTaskPosition} of ${newTaskInColumnLength}`;
        }
        return `Task was moved over position ${newTaskPosition} of ${newTaskInColumnLength} in column ${column?.name}`;
      }
    },
    onDragEnd({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) {
        pickedUpTaskColumn.current = null;
        return;
      }
      if (
        active.data.current?.type === "Column" &&
        over.data.current?.type === "Column"
      ) {
        const overColumnPosition = columnsId.findIndex((id) => id === over.id);

        return `Column ${active.data.current.column.name
          } was dropped into position ${overColumnPosition + 1} of ${columnsId.length
          }`;
      } else if (
        active.data.current?.type === "Task" &&
        over.data.current?.type === "Task"
      ) {
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          over.data.current.task.statusId
        );
        if (over.data.current.task.statusId !== pickedUpTaskColumn.current) {
          return `Task was dropped into column ${column?.name} in position ${taskPosition + 1
            } of ${tasksInColumn.length}`;
        }
        return `Task was dropped into position ${taskPosition + 1} of ${tasksInColumn.length
          } in column ${column?.name}`;
      }
      pickedUpTaskColumn.current = null;
    },
    onDragCancel({ active }) {
      pickedUpTaskColumn.current = null;
      if (!hasDraggableData(active)) return;

      const message = `Dragging ${active.data.current?.type} cancelled.`;
      console.log(message)
      return message
    },
  };

  if (!boardData) {
    Router.push('/dashboard')
    return
  }

  return (
    <>
      <div className="h-36">
            <div className="py-4">
                <div className="flex flex-row items-center gap-2">
                    <span className="capitalize text-2xl font-bold">{boardData.name}</span>
                    <Button variant="ghost" className="p-2 hover:text-app-orange-500">
                        <Plus size={20} strokeWidth={3} />
                    </Button>
                </div>
            </div>
            <div className="flex flex-row text-sm gap-4">
                <div className="flex flex-nowrap flex-row items-center relative max-w-56">
                    <Search className="absolute left-2" size={16} strokeWidth={1} />
                    <Input className="pl-8" type="search" placeholder="Search" />
                </div>
                <Popover>
                    <PopoverTrigger>
                        <Button variant="ghost" className="btn-w-icon p-2 hover:text-app-orange-500">
                            <ListFilter size={16}/>
                            <span>Filters</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      Add filters
                    </PopoverContent>
                </Popover>

                <ToggleGroup type="single" className="" defaultValue="boardview">
                    <ToggleGroupItem value="listview" className="btn-w-icon">
                        <Rows3 size={16} strokeWidth={1}/>
                        <span>List</span>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="boardview" className="btn-w-icon">
                        <BoardIcon strokeWidth={.5}/>
                        <span>Board</span>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="workflowview" className="btn-w-icon">
                        <WorkflowIcon />
                        <span>Workflow</span>
                    </ToggleGroupItem>
                </ToggleGroup>

                <Toggle
                  variant={"outline"}
                  onPressedChange={(isPressed) => {
                    // Update the filters.assignee state based on the toggle state
                    setFilters((prev) => ({
                      ...prev,
                      assignee: isPressed ? appState.currentUser.id : "" // Set to current user ID if pressed, otherwise null
                    }));
                    console.log(isPressed, 'assigned to me is pressed');
                  }}
                >
                  <span>Assigned to Me</span>
                </Toggle>

                <DialogAutomations boardId={boardId} />
            </div>
        </div>
    <div className="bg-app-brown-200">
    <DndContext
      accessibility={{
        announcements,
      }}
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
<BoardContainer className={className}>
  <SortableContext items={columnsId}>
    {columns.map((col) => {
      // Filter tasks for the current column considering the assignee filter
      const filteredTasks = tasks.filter((task) => {
        const isAssignedToMe = filters.assignee ? task.assigneeId === filters.assignee : true; // Check if the task is assigned to the current user
        return !task.parentId && task.statusId === col.id && isAssignedToMe; // Include the assignee filter
      });

      return (
        <BoardColumn
          key={col.id}
          column={col}
          tasks={filteredTasks} // Pass the filtered tasks to the BoardColumn
        />
      );
    })}
  </SortableContext>
</BoardContainer>



      {"document" in window &&
        createPortal(
          <DragOverlay>
            {activeColumn && (
              <BoardColumn
                isOverlay
                column={activeColumn}
                tasks={tasks.filter(
                  (task) => task.statusId === activeColumn.id
                )}
              />
            )}
            {activeTask && <TaskCard task={activeTask} isOverlay />}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
    </div>
  
    </>
  );

  function onDragStart(event: DragStartEvent) {

    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;
    console.log(data, 'data ondragstart')
    if (data?.type === "Column") {
      setActiveColumn(data.column);
      return;
    }

    if (data?.type === "Task") {
      setActiveTask(data.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active)) return;

    const activeData = active.data.current;
    const overData = over.data.current;
    const isActiveAColumn = activeData?.type === 'Column'
    const isActiveATask = activeData?.type === "Task";
    const isOverATask = overData?.type === "Task";
    const isOverAColumn = overData?.type === "Column";

    console.log(activeData ,'dragend activeData')

    if (isActiveATask) {
      const updatedTask = activeData.task
      _updateTask(updatedTask.id,updatedTask)
        .then(res => {
          console.log(res, 'updateTask')
        })
        .catch(error => {
          console.log(error)
        })
    }

    console.log(activeId,'activeId')
    console.log(overId,'overId')
    
    if (activeId === overId) return;

  

    
    if(isActiveATask){

      

    } else if (isActiveAColumn){
      setColumns((columns) => {
        const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
  
        const overColumnIndex = columns.findIndex((col) => col.id === overId);
  
        return arrayMove(columns, activeColumnIndex, overColumnIndex);
      });

    }

  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    console.log(active, 'ondragover active')
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const isActiveAColumn = activeData?.type === 'Column'
    const isActiveATask = activeData?.type === "Task";
    const isOverATask = overData?.type === "Task";
    const isOverAColumn = overData?.type === "Column";


    setappState((prevState) => {
      const newState = { ...prevState };
      const board = newState.currentUser.boards?.find(b => b.id === boardId);
      if (!board || !tasks) return prevState;
      
      // Im dropping a Task over another Task
      if (isActiveATask) {
        const activeStatusId = activeData?.task.statusId;
        const boardStatus = board.BoardStatus;
        if (!boardStatus) return prevState;

        const activeStatusIndex = boardStatus.findIndex(status => status.id === activeStatusId)
        const activeStatus = boardStatus[activeStatusIndex];
        const activeTaskIndex = tasks.findIndex(task => task.id === activeId);

        console.log(activeTaskIndex, 'activeTaskIndex')
        if (activeStatusIndex === -1 || activeTaskIndex === -1) return prevState;

        const activeTask = tasks[activeTaskIndex]

        if (isOverATask) {
          const overStatusIndex = boardStatus.findIndex(status => status.id == overData.task.statusId);
          const overStatus = boardStatus[overStatusIndex];
          const overTaskIndex = tasks.findIndex(task => task.id === overId);

          // Reorder tasks within the same status if they have the same status ID
          tasks = arrayMove(tasks, activeTaskIndex, overTaskIndex);
          

        } else if (isOverAColumn) {
          const targetStatus = boardStatus.find(status => status.id === overData.column.id);
          if (activeTask && targetStatus) {
            activeTask.statusId = targetStatus.id;
          }
        }



      } else if (isActiveAColumn) {


      }

      return newState;
    });




  }

}