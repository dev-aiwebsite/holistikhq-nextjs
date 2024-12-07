"use client"
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
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
import { useAppStateContext } from "@app/context/AppStatusContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { ListFilter, Plus, Rows3, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { BoardIcon, WorkflowIcon } from "public/svgs/svgs";
import { Toggle } from "../ui/toggle";
import DialogAutomations from "../dialogs/DialogAutomations";
import { CompleteTaskWithRelations } from "@lib/types";
import { DialogAddTask } from "../dialogs/DialogAddTask";
import { DialogTaskTemplate } from "../dialogs/DialogTaskTemplate";
import FormUpdateTask from "../forms/FormUpdateTask";
import { useDrawerContext } from "@app/context/DrawerContext";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import UserList from "../UserList";
import { SelectScrollable } from "../ui/select";
import { appAccess, mainBoards } from "@lib/const";

export function KanbanBoard({ className, boardId }: { className?: string, boardId: string }) {
  const Router = useRouter()

  const { appState, setappState, tasks, setTasks, updateTask, boards, setKanbanData } = useAppStateContext()
  const { isOpen, openDrawer, getOnCloseHandlers, addOnCloseHandler, closeDrawer } = useDrawerContext()
  const boardData = useMemo(() => boards.find((board) => board.id === boardId), [boards, boardId]);
  const [columns, setColumns] = useState<Column[]>(boardData?.BoardStatus || []);
  const [filters, setFilters] = useState({
    search: "",
    assigneeId: "",
    statusId: "na",
    assignedToMe: "",
  })
  const searchParams = useSearchParams()
  const showTaskId = searchParams.get('t')
  const columnsId = columns.map(c => c.id)
  const completeStatus = boardData?.BoardStatus?.find(s => s.isComplete)
  console.log(boards, 'boards')
  const userClinics = appState.currentUser.clinics.map(c => c.id)
  const hasBoardControl = useMemo(() => {
    
    let hasControl = true

    if(mainBoards.filter(b => b.id == boardId).length){
      if (!appAccess.mainboards.specialactions.some(role => appState.currentUser.roles.includes(role))) {
        hasControl = false
      }
    }
   
    return hasControl

  }, [appState.currentUser])
  
  const queryFilters:Record<string,Record<string,any>[]> = {AND: [
    { statusId: { in: columnsId } }, // Must match a statusId in the list
  ]}

  if(!hasBoardControl){
    queryFilters.AND.push({
      OR: [
        { createdBy: appState.currentUser.id },  // OR conditions
        { assigneeId: appState.currentUser.id },
        { clinicId: { in: userClinics } },
        { collaborator: { some: { userId: appState.currentUser.id } } },
      ],
    })
  }

  useEffect(() => {
    _getTasks(
      queryFilters
    )
      .then(res => {
        console.log(res, '_getTask')
        if (res.success && res.tasks) {
          setKanbanData({ tasks: res.tasks })
        }
      })
  }, [boardId, appState.currentUser])


  useEffect(() => {
    if (!showTaskId) return
    if (!tasks) return
    let task = tasks.find(t => t.id == showTaskId)

    const headerItem = <button type="button" className="btn small btn-outlined text-grey-500">Mark as Complete</button>
    openDrawer(<FormUpdateTask onSubmit={() => closeDrawer()} key={showTaskId} task={task} taskId={showTaskId} />, headerItem)

  }, [showTaskId, tasks])

  const pickedUpTaskColumn = useRef<string | null>(null);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [currentTask, setCurrentTask] = useState<CompleteTaskWithRelations | null>(null);
  const [activeTask, setActiveTask] = useState<CompleteTaskWithRelations | null>(null);

 

  const isDragDisable = useMemo(() => {
    let isDisabled = false

    if(mainBoards.some(b => b.id == boardId)){
      isDisabled = !appAccess.mainboards.dnd.some(role => appState.currentUser.roles.includes(role))
     
    }
   
    return isDisabled

  }, [appState.currentUser])

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: coordinateGetter
    })
  );

  if (!tasks) return <></>



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

  function handleOnSearch(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    console.log(value, 'handle on search')

    updateFilters('search', value)
  }

  function updateFilters(k: keyof typeof filters, v: string) {
    setFilters(prevdata => {
      let newData: Record<string, any> = {}
      newData[k] = v
      return { ...prevdata, ...newData }
    })
  }

  let boardStatusOptions = [
    { text: 'N/A', value: 'na' },
  ]

  if (boardData && boardData.BoardStatus) {
    const statuses = boardData.BoardStatus

    boardStatusOptions = [...boardStatusOptions, ...statuses.map(status => {
      return {
        text: status.name,
        value: status.id
      }
    })]
  }

  return (
    <>
      <div className="h-36">
        <div className="py-4">
          <div className="flex flex-row items-center gap-2">
            <span className="capitalize text-2xl font-bold">{boardData.name}</span>
            <DialogAddTask boardId={boardId} triggerContent={
              {
                button: <Button variant="ghost" className="p-2 hover:text-app-orange-500">
                  <Plus size={20} strokeWidth={3} />
                </Button>
              }} />
          </div>
        </div>
        <div className="flex flex-row text-sm gap-4">
          <div className="flex flex-nowrap flex-row items-center relative max-w-56">
            <Search className="absolute left-2" size={16} strokeWidth={1} />
            <Input onChange={handleOnSearch} value={filters.search} className="pl-8" type="search" placeholder="Search" />
          </div>
          <Popover>
            <PopoverTrigger>
              <Button variant="ghost" className="btn-w-icon p-2 hover:text-app-orange-500">
                <ListFilter size={16} />
                <span>Filters</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-fit !shadlow-xl !rounded-xl">
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="text-sm table">
                <div className="flex flex-row items-center gap-2 tr">
                  <span className="td w-20">Assignee</span>
                  <div className="td !w-48">
                    <UserList onChange={(v) => updateFilters('assigneeId', v)} className="!w-full" />

                  </div>
                </div>
                <div className="flex flex-row items-center gap-2 tr">
                  <span className="td">Status</span>
                  <div className="td">
                    <SelectScrollable className="font-medium text-gray-700"
                      placeholder="Filter status"
                      options={boardStatusOptions}
                      onChange={(v) => updateFilters('statusId', v)}
                      value={filters.statusId}
                    />
                  </div>

                </div>
              </CardContent>
            </PopoverContent>
          </Popover>

          {hasBoardControl && <ToggleGroup type="single" className="" defaultValue="boardview">
            <ToggleGroupItem value="listview" className="btn-w-icon">
              <Rows3 size={16} strokeWidth={1} />
              <span>List</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="boardview" className="btn-w-icon">
              <BoardIcon strokeWidth={.5} />
              <span>Board</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="workflowview" className="btn-w-icon">
              <WorkflowIcon />
              <span>Workflow</span>
            </ToggleGroupItem>
          </ToggleGroup>}

          <Toggle
            variant={"outline"}
            onPressedChange={(isPressed) => {
              // Update the filters.assignee state based on the toggle state
              setFilters((prev) => ({
                ...prev,
                assignedToMe: isPressed ? appState.currentUser.id : "" // Set to current user ID if pressed, otherwise null
              }));
              console.log(isPressed, 'assigned to me is pressed');
            }}
          >
            <span>Assigned to Me</span>
          </Toggle>

          {hasBoardControl && <>
            <DialogAutomations boardId={boardId} />
            <DialogTaskTemplate boardId={boardId} />
          </>}
        </div>
      </div>
      <div className="bg-app-brown-200 flex-1">
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
                  // Determine if the task should be filtered based on assignee-related filters
                  const filterAssignee = filters.assigneeId
                    ? task.assigneeId !== filters.assigneeId
                    : false;

                  const assignedToMe = !filters.assigneeId && filters.assignedToMe
                    ? task.assigneeId !== filters.assignedToMe
                    : false;

                  // Check if every word in the search key matches the task string
                  const stringTask = JSON.stringify(task).toLowerCase();
                  const searchKey = filters.search.toLowerCase();
                  const searchWords = searchKey.split(" ");
                  const isMatch = searchWords.every((word) => stringTask.includes(word));

                  // Determine if the task should be filtered based on status
                  const filterStatus = filters.statusId !== 'na'
                    ? filters.statusId !== task.statusId
                    : false;

                  // Main conditions to include/exclude the task
                  if (task.parentId) return false; // Exclude subtasks
                  if (task.statusId !== col.id) return false; // Exclude tasks not in the current column
                  if (filterStatus) return false; // Exclude tasks that don't match the status filter
                  if (filterAssignee) return false; // Exclude tasks that don't match the assignee filter
                  if (assignedToMe) return false; // Exclude tasks not assigned to me when "assignedToMe" is set
                  if (!isMatch) return false; // Exclude tasks that don't match the search criteria

                  return true; // Include task if all conditions pass
                });

                return (
                  <BoardColumn
                    isDragDisable={isDragDisable}
                    key={col.id}
                    column={col}
                    tasks={filteredTasks}
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
    if (data?.type === "Column") {
      setActiveColumn(data.column);
      return;
    }

    if (data?.type === "Task") {
      setCurrentTask({ ...data.task });
      setActiveTask(data.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {


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

    if (isActiveATask && activeTask && currentTask) {


      let isNewStatus = activeTask.statusId !== currentTask.statusId

      if (!isNewStatus) {
        console.log('nothing to update, same status')
        return
      }

      if (completeStatus) {
        if (activeTask.statusId == completeStatus.id) {
          activeTask.isCompleted = true
        } else {
          activeTask.isCompleted = false
        }
      }

      console.log(activeTask)
      updateTask(activeTask)

    }


    if (activeId === overId) return;




    if (isActiveATask) {



    } else if (isActiveAColumn) {
      setColumns((columns) => {
        const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

        const overColumnIndex = columns.findIndex((col) => col.id === overId);

        return arrayMove(columns, activeColumnIndex, overColumnIndex);
      });

    }



    setActiveColumn(null);
    setActiveTask(null);

  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    console.log(active, 'ondragover active', '\n')
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

    setTasks((prevdata) => {
      // a Task over another Task
      console.log(prevdata, 'set tasks')
      if (!prevdata) return prevdata

      if (isActiveATask && activeTask) {
        const newTasks = [...prevdata]
        const activeStatusId = activeTask.statusId
        const taskIndex = newTasks.findIndex(t => t.id == activeTask.id)

        if (isOverATask) {
          const overStatusId = overData.task.statusId

          // Reorder tasks within the same status if they have the same status ID
          // tasks = arrayMove(tasks, activeTaskIndex, overTaskIndex);

          if (overStatusId && activeStatusId !== overStatusId) {
            activeTask.statusId = overStatusId;
            activeTask.updatedAt = new Date();
            activeTask.updatedById = appState.currentUser.id

          }


        } else if (isOverAColumn) {

          if (activeTask && activeStatusId !== overId) {
            activeTask.statusId = overId as string;
            activeTask.updatedAt = new Date();
            activeTask.updatedById = appState.currentUser.id

          }
        }

        return newTasks

      } else if (isActiveAColumn) {


      }


    })


  }

}