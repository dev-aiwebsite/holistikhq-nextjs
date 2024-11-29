"use client"

import { CircleCheck, Plus } from "lucide-react";
import { DatePickerWithPresets } from "../ui/datepicker";
import { Button } from "../ui/button";
import UserList from "../UserList";
import { FormEvent, useEffect, useRef, useState } from "react";
import { CompleteTaskWithRelations } from "@lib/types";
import { Task } from "@prisma/client";
import { createId } from "@paralleldrive/cuid2";
import { useAppStateContext } from "@app/context/AppStatusContext";
import { _updateTask } from "@lib/server_actions/database_crud";

type SubtaskSectionType = {
    taskId?: string;
    task?: CompleteTaskWithRelations;
    subtasks?: Task[];
    onNewSubtaskUpdate?: (newSubTaskList:Task[]) => void;
}
export const SubtaskSection = ({onNewSubtaskUpdate, task}: SubtaskSectionType) => {
    const [newSubtasksList, setNewSubtasksList] = useState<Task[]>([])
    const [showNewSubtaskForm, setShowNewSubtaskForm] = useState(false)
    const newSubtaskInputRef = useRef<HTMLInputElement | null>(null);
    const { appState } = useAppStateContext()
    const currentUserId = appState.currentUser.id


    useEffect(() => {
        if (showNewSubtaskForm && newSubtaskInputRef.current) {
            newSubtaskInputRef.current.focus();
        }
    }, [showNewSubtaskForm]);


    function handleAddNewToList() {

        const newId = createId()
        const newData: Task = {
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

    function handleUpdateSubtask(id: string, field: keyof Task, value: any) {
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
                                    handleUpdateSubtask(subtask.id, "name", e.target.value)
                                }
                            />

                            <div className="ml-auto flex flex-row flex-nowrap gap-2 items-center">
                                <UserList
                                    variant="icon"
                                    value={subtask.assigneeId || undefined}
                                    onChange={(value) =>
                                        handleUpdateSubtask(subtask.id, "assigneeId", value)
                                    }
                                />
                                <DatePickerWithPresets
                                    variant="icon"
                                    className=""
                                    value={subtask.dueDate || undefined}
                                    onSelect={(value) =>
                                        handleUpdateSubtask(subtask.id, "dueDate", value)
                                    }
                                />
                            </div>
                        </div>
                    </form>
                ))}

            {task && <SubtaskList task={task} />}

        </div>
    </>)
}

const SubtaskList = ({ task }: { task: CompleteTaskWithRelations }) => {
    if (!task) return
    const { appState } = useAppStateContext()
    const taskId = task.id
    const [subtasks, setSubtask] = useState(task.subtasks)
    console.log(subtasks, 'subtasks')
    if(!subtasks) return
    const boardId = task.status.boardId
    if (!boardId && !taskId) return
    const board = appState.currentUser.boards.find(b => b.id == boardId)
    const boardStatuses = board?.BoardStatus


    if (!boardStatuses?.length) return
    const boardStatusComplete = boardStatuses.find(b => b.isComplete) || boardStatuses.find(b => b.name.toLowerCase() == 'complete')
    if(!boardStatusComplete){
        console.error("Can't render subtask: no complete status")
        return 
    }
    // Function to run your update task
    const updateTask = (taskId: string,field:string,value:any) => {
        console.log(`Updating task with ID: ${taskId}${field}:${value}...`);
        // You can replace this with your actual update logic
    };
    
    function handleNameOnBlur(taskId: string,field:string,event:React.FocusEvent<HTMLInputElement, Element>){
        console.log(event)
        console.log(`updating task id:${taskId}`)
        const value = event.target.value
        if(!value) return
        console.log(`updating task id:${taskId} ${field}:${value}`)
    }

    function markAsComplete(taskId:string){
        if(!taskId) return
        _updateTask(taskId, {statusId:boardStatusComplete!.id,isCompleted:true})
        .then(res => console.log(res))
        .catch(err => {
            console.error(err)
        })
    }

    function markAsInComplete(taskId:string){
        if(!taskId) return
        _updateTask(taskId, {statusId:boardStatuses![0].id,isCompleted:false})
        .then(res => console.log(res))
        .catch(err => {
            console.error(err)
        })
    }

    return <>
        {subtasks.map((subtask) => (

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
                        <UserList variant="icon" onChange={(v)=>updateTask(subtask.id,'assigneeId',v)} value={subtask.assigneeId} />
                        <DatePickerWithPresets onSelect={(v)=>updateTask(subtask.id,'dueDate',v)} variant="icon" className="" value={subtask.dueDate || undefined} />
                    </div>
                </div>
            </form>
        )
        )}
    </>
}