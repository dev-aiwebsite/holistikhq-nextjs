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
import { createId } from "@paralleldrive/cuid2";
import { BoardStatus } from "prisma/prisma-client";
import MarkAsCompleteBtn from "../task/MarkAsCompleteBtn";

type MyTodoBoardProps = {className?: string }


export function MyTodoBoard({ className }:MyTodoBoardProps ) {
  const boardType = "mytodo"
  const Router = useRouter()

  const { appState, setappState, tasks, setTasks, updateTask, boards, myTodoBoard, setKanbanData } = useAppStateContext()
  const { isOpen, openDrawer, getOnCloseHandlers, addOnCloseHandler, closeDrawer } = useDrawerContext()

  const boardData = useMemo(() => {
      return myTodoBoard[0]
  }, [boards, myTodoBoard]);

  const boardId = useMemo(()=>{
    return boardData.id
  },[boards, myTodoBoard])
  
  const tempColId = useMemo(()=> (createId()),[boardId])

  const statusArrangeMent = boardData?.statusArrangement
  const orderedBoardStatuses = statusArrangeMent && boardData?.BoardStatus?.toSorted((a,b)=>{ 
    
    return statusArrangeMent?.indexOf(a.id) - statusArrangeMent?.indexOf(b.id)
  })
  
  const boardStatuses = orderedBoardStatuses || []
  
  const [columns, setColumns] = useState<Column[]>(boardStatuses);
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
  const userClinics = appState.currentUser.clinics.map(c => c.id)
 
  const queryFilters:Record<string,Record<string,any>[]> = {OR: [
    { statusId: { in: columnsId } },
    { assigneeId: appState.currentUser.id },
  ]}  

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
    if(!task) return

    const headerItem = <MarkAsCompleteBtn task={task} />
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
            <DialogAddTask tasktype="mytodo" boardId={boardId} triggerContent={
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

          {/* <ToggleGroup type="single" className="" defaultValue="boardview">
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
          </ToggleGroup> */}

          {/* <Toggle
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
          </Toggle> */}

          <DialogAutomations boardId={boardId} />
          <DialogTaskTemplate boardId={boardId} />
          
        </div>
      </div>
      <div className="bg-app-brown-200 flex-1">
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <BoardContainer className={className}>
            <SortableContext items={columnsId}>
              {columns.map((col,index) => {
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
                  
                
                  if(task.type == "task"){
                    if(index == 0){
                      if (task.todoStatusId && task.todoStatusId !== col.id) return false; // Exclude tasks not in the current column

                    } else {
                      if (task.todoStatusId !== col.id) return false; // Exclude tasks not in the current column
                    }

                  } else {
                    if (task.statusId !== col.id) return false; // Exclude tasks not in the current column
                  }
                
                  
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
          
          {createPortal(
              <DragOverlay>
                {activeColumn && (
                  <BoardColumn
                    isOverlay
                    column={activeColumn}
                    tasks={tasks.filter(
                      (task) => {
                        if(task.type == "mytodo"){
                          task.statusId === activeColumn.id
                        } else {
                          task.todoStatusId === activeColumn.id
                        }
                      }
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


      let isNewStatus = activeTask.type == "mytodo" ? activeTask.statusId !== currentTask.statusId : activeTask.todoStatusId !== currentTask.todoStatusId

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
            
      // const updatedTaskData:CompleteTaskWithRelations = activeTask.type == "mytodo" ? activeTask : {...currentTask, todoStatusId: activeTask.todoStatusId }
      
      // console.log(updatedTaskData, 'updatedTaskData')
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

    if (activeId === overId){
      console.log('same active and over id')
      return;
    } 

    if (!hasDraggableData(active) || !hasDraggableData(over)) {
      console.log('nodraggableData')
      return;
    }

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

        console.log(isOverATask, 'isovertask')
        console.log(isOverAColumn, 'isOverAColumn')
        if (isOverATask) {
          
          let overStatusId = overData.task.type == "mytodo" ? overData.task.statusId : overData.task.todoStatusId
          
          if (overStatusId && activeStatusId !== overStatusId) {
            if(activeTask.type == "mytodo"){
              activeTask.statusId = overStatusId;
            } else {
              activeTask.todoStatusId = overStatusId;
            }
            activeTask.updatedAt = new Date();
            activeTask.updatedById = appState.currentUser.id
          }


        } else if (isOverAColumn) {

          if (activeTask && activeStatusId !== overId) {
            if(activeTask.type == "mytodo"){
              activeTask.statusId = overId as string;

            } else {
              activeTask.todoStatusId = overId as string;
            }

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