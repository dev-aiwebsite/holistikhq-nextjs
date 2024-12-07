"use client"

import { CircleCheck, Plus } from "lucide-react";
import { DatePickerWithPresets } from "../ui/datepicker";
import { Button } from "../ui/button";
import UserList from "../UserList";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { CompleteTaskWithRelations, TaskAddType, TaskAddTypeComplete, TypeBoardComplete, TypeTask } from "@lib/types";
import { BoardStatus, Task } from "@prisma/client";
import { createId } from "@paralleldrive/cuid2";
import { useAppStateContext } from "@app/context/AppStatusContext";
import { _updateTask } from "@lib/server_actions/database_crud";
import { ValueOf } from "next/dist/shared/lib/constants";

type SubtaskSectionType = {
    taskId: string;
    subtasks?: Task[];
    onNewSubtaskUpdate?: (newSubTaskList:Task[]) => void;
}
export const SubtaskSection = ({onNewSubtaskUpdate, taskId}: SubtaskSectionType) => {
    const [newSubtasksList, setNewSubtasksList] = useState<TypeTask[]>([])
    const [showNewSubtaskForm, setShowNewSubtaskForm] = useState(false)
    const newSubtaskInputRef = useRef<HTMLInputElement | null>(null);
    const { appState, tasks, updateTask, boards } = useAppStateContext()
    
    const currentUserId = appState.currentUser.id
    
    
    const task = useMemo(()=>{
      return  tasks?.find(i => i.id == taskId)
    },[tasks, taskId])

    const subtasks = useMemo(() => {
        return tasks?.filter(t => t.parentId === taskId);
      }, [tasks, taskId]);

    
    
    useEffect(() => {
        if (showNewSubtaskForm && newSubtaskInputRef.current) {
            newSubtaskInputRef.current.focus();
        }
    }, [showNewSubtaskForm]);

    console.log(subtasks, 'subtasks here')
    let boardId:string | null,
    board:TypeBoardComplete | undefined,
    boardStatuses:BoardStatus[] | undefined,
    boardStatusComplete:BoardStatus | undefined

    if(task && subtasks?.length){
        boardId = subtasks[0].status.boardId
        if (!boardId) return
         board = boards.find(b => b.id == boardId)
         boardStatuses = board?.BoardStatus

         if(boardStatuses){
             boardStatusComplete = boardStatuses.find(b => b.isComplete) || boardStatuses.find(b => b.name.toLowerCase() == 'complete')
         }
        if(!boardStatusComplete){
            console.error("Can't render subtask: no complete status")
            return 
        }
    }

    function handleAddNewToList() {

        const newId = createId()
        const newData: Partial<TaskAddTypeComplete> = {
            id: newId,
            name: "",
            description: "",
            statusId: "",
            dueDate: null,
            clinicId: "",
            createdBy: currentUserId,
            createdAt: new Date(),
            taskLink: "",
            isCompleted: null,
            priority: "",
            updatedAt: new Date(),
            assigneeId: null,
            updatedById: currentUserId,
            parentId: "",
        };


        setNewSubtasksList(prevdata => [...prevdata, newData])
        console.log(newData, 'new subtasks added')
    }

    function handleUpdateNewSubtask(id: string, field: keyof Task, value: any) {
        setNewSubtasksList((prevData) => {
          const updatedList = prevData.map((subtask) =>
            subtask.id === id ? { ...subtask, [field]: value } : subtask
          );
      
          if (onNewSubtaskUpdate) {
            onNewSubtaskUpdate(updatedList);
          }
      
          return updatedList;
        });
      }
      

      const handleUpdateSubtask = <T extends keyof TypeTask>(subtaskId: string, field: T, value: TypeTask[T]) => {
        console.log(`Updating task with ID: ${taskId}${field}:${value}...`);
        // You can replace this with your actual update logic
        if(!subtaskId || !subtasks) return
        const subtaskData = subtasks.find(st => st.id == subtaskId)
        const taskData:TypeTask = {...subtaskData}
        taskData[field] = value
        console.log(taskData, 'updated data')
        updateTask(taskData)
    };
    
    function handleNameOnBlur(taskId: string,field:string,event:React.FocusEvent<HTMLInputElement, Element>){
        console.log(event)
        console.log(`updating task id:${taskId}`)
        const value = event.target.value
        if(!value) return
        console.log(`updating task id:${taskId} ${field}:${value}`)
    }

    function markAsComplete(subtaskId:string){
        if(!subtaskId || !subtasks) return
        const subtaskData = subtasks.find(st => st.id == subtaskId)
        const taskData:TypeTask = {
            ...subtaskData,
            statusId:boardStatusComplete!.id,
            isCompleted:true
        }
        updateTask(taskData)
        console.log(taskData, 'updated data')
    
    }

    function markAsInComplete(subtaskId:string){
        
        // _updateTask(taskId, {statusId:boardStatuses![0].id,isCompleted:false})
        if(!subtaskId || !subtasks) return
        const subtaskData = subtasks.find(st => st.id == subtaskId)
        const taskData:TypeTask = {
            ...subtaskData,
            statusId:boardStatuses![0].id,
            isCompleted:false
        }
        updateTask(taskData)
        console.log(taskData, 'updated data')
    }

    return (<>

        <div className="text-sm font-semibold flex flex-row items-center gap-1">
            <span>Subtasks</span>
            <Button onClick={handleAddNewToList} variant="ghost" size="icon" className="w-6 h-6" type="button">
                <Plus size={16} strokeWidth={2} />
            </Button>
        </div>
        <div className="w-full text-sm divide-y divide-solid flex flex-col border-y border-gray-200">
            {newSubtasksList.length > 0 &&
                newSubtasksList.map((subtask) => (
                    <form action="" key={subtask.id}>
                        <div className="group focus-within:bg-app-brown-200 hover:bg-app-brown-200 w-full flex flex-row flex-nowrap items-center gap-2 p-2">
                            <CircleCheck
                                size="18"
                                strokeWidth="2"
                                className="hover:cursor-pointer text-gray-400 hover:text-green-600"
                            />

                            <input
                                className="text-gray-600 text-sm w-72 p-1 bg-transparent focus:bg-white ring-0 border-none outline-none"
                                type="text"
                                placeholder="Task name"
                                name="name"
                                value={subtask.name} // Controlled input
                                onChange={(e) =>
                                    handleUpdateNewSubtask(subtask.id, "name", e.target.value)
                                }
                            />

                            <div className="ml-auto flex flex-row flex-nowrap gap-2 items-center">
                                <UserList
                                    variant="icon"
                                    value={subtask.assigneeId || undefined}
                                    onChange={(value) =>
                                        handleUpdateNewSubtask(subtask.id, "assigneeId", value)
                                    }
                                />
                                <DatePickerWithPresets
                                    variant="icon"
                                    className=""
                                    value={subtask.dueDate || undefined}
                                    onSelect={(value) =>
                                        handleUpdateNewSubtask(subtask.id, "dueDate", value)
                                    }
                                />
                            </div>
                        </div>
                    </form>
                ))}

            {(subtasks && subtasks?.length > 0) &&  subtasks.map((subtask) => (
            <form action="" key={subtask.id} >
                <div className="group focus-within:bg-app-brown-200 hover:bg-app-brown-200 w-full flex flex-row flex-nowrap items-center gap-2 p-2">
                    {subtask.status.isComplete ?
                        <CircleCheck onClick={()=>markAsInComplete(subtask.id)} size="18" strokeWidth="2" className="hover:cursor-pointer text-green-600 hover:text-green-500" />
                        : <CircleCheck onClick={()=>markAsComplete(subtask.id)} size="18" strokeWidth="2" className="hover:cursor-pointer text-gray-400 hover:text-green-600" />
                    }
                    <input
                        className="text-gray-600 text-sm w-72 p-1 bg-transparent focus:bg-white ring-0 border-none outline-none"
                        type="text" placeholder="Task name" name="name" defaultValue={subtask.name} onBlur={(e)=>handleNameOnBlur(subtask.id,'name',e)}/>
                    <div className="ml-auto flex flex-row flex-nowrap gap-2 items-center">
                        <UserList variant="icon" onChange={(v)=>handleUpdateSubtask(subtask.id,'assigneeId', v)} value={subtask.assigneeId || undefined} />
                        <DatePickerWithPresets onSelect={(v)=>handleUpdateSubtask(subtask.id,'dueDate', v || null)} variant="icon" className="" value={subtask.dueDate || undefined} />
                    </div>
                </div>
            </form>
        )
        )}

        </div>
    </>)
}
