"use client"
import {createContext, Dispatch, SetStateAction, useContext, useState } from "react";
import {Board, BoardStatus, Clinic, Conversation, Message, Task, User} from "prisma/prisma-client"
import { BoardAddType, ClinicAddType, CompleteTaskWithRelations, ConversationCompleteType, TaskAddTypeComplete, TypeBoardComplete, TypeClinicComplete, TypeClinicWithUsers, TypeCurrentUserComplete, TypeTask, TypeTaskWithSubtasks, UserAddType } from "@lib/types";
import { _addCLinic, _addNotification, _addTask, _addUser, _updateTask } from "@lib/server_actions/database_crud";
import { createId } from "@paralleldrive/cuid2";
import { ADD_BOARD } from "@lib/server_actions/appCrud";
import { error } from "console";
import { useRouter } from "next/navigation";
import { NotificationAddType } from "@lib/server_actions/query";
import { automationChecking } from "@lib/helperFunctions";

export type AppStateDataType = {
    users:User[];
    currentUser: TypeCurrentUserComplete;
    boards?: Board[];
    boardStatuses?:BoardStatus[];
    tasks?: Task[];
    clinics?: TypeClinicComplete[]
};

type KanbanDataPropsType = {
    boards?:Board[];
    tasks?:TypeTask[];
    boardStatuses?:BoardStatus[];
    clinics?:TypeClinicComplete[];
}

 type TypeAppStateContext = {
    appState:AppStateDataType;
    setappState:Dispatch<SetStateAction<AppStateDataType>>;
    tasks:TypeTask[] | null;
    boards: TypeBoardComplete[];
    boardStatuses:BoardStatus[] | null;
    clinics:TypeClinicComplete[];
    addUser:(data:UserAddType) => void;
    addClinic:(data:ClinicAddType) => void;
    updateTask: (newTask:TypeTask) => void;
    addTask: (taskData:TaskAddTypeComplete) => void;
    addBoard: (data:BoardAddType, onSuccess?:(res:Awaited<ReturnType<typeof ADD_BOARD>>)=>void) => void;
    setKanbanData: (data:KanbanDataPropsType)=>void;
    setTasks:Dispatch<SetStateAction<TypeTask[] | null>>
    updateBoard:(boardId:string,data:Partial<TypeBoardComplete>)=>void;
}

export const AppStateContext = createContext<TypeAppStateContext | null>(null);

type AppStateContextProviderType = {
    children: React.ReactNode;
    data: AppStateDataType;
}


export default function AppStateContextProvider({children, data}:AppStateContextProviderType) {
    console.log(data)
    const router = useRouter()
    const AppState:AppStateDataType = {
        users:data.users,
        currentUser: data.currentUser,
    }
    
    const [appState,setappState] = useState(AppState);
    const [boards, setBoards] = useState<TypeBoardComplete[]>(data.currentUser.boards);
    const [tasks, setTasks] = useState<TypeTask[] | null>(null)
    const [boardStatuses,setBoardStatuses] = useState<BoardStatus[] | null>(null)
    const [clinics, setClinics] = useState<TypeClinicComplete[] | undefined>(data.clinics)

    function sendNotification(newData:NotificationAddType){
      
           newData.createdBy = appState.currentUser.id
        console.log(newData, '_addNotification')
        _addNotification(newData)
        .then(res => {
            console.log(res, '_addNotification')
        })
        .catch(err => {
            console.log(err, '_addNotification')
        })
    }

    const updateTask = async (newTaskData: TypeTask) => {
        const taskId = newTaskData.id;
        const currentUserId = appState.currentUser.id
        const boardId = newTaskData.status.boardId
        const boardData = boards.find(b => b.id == boardId)
        if (!taskId) return;
        if(!boardData) {
            console.log('updateTask, cant find board')
            return 
        }
        
    
        try {
            // Attempt to update the task in the backend

            const automationCheckResult = automationChecking(newTaskData,boardData)
            console.log(automationCheckResult, 'automationCheckResult')

            
            const res = await _updateTask(taskId, automationCheckResult.taskData);
    
            // If the response indicates failure, revert the appState
            if (res.success && res.task){
                const updatedTask = res.task
                setTasks(prevdata => {
                    if(!prevdata) return prevdata
                    return [updatedTask,...prevdata.filter(t => t.id !== taskId)]
                })

                const toNotify:string[] = []
                const boardId = newTaskData.status.boardId
               
                if(currentUserId != newTaskData.createdBy){
                    toNotify.push(newTaskData.createdBy)
                }

                if(newTaskData.assigneeId){
                    if(currentUserId != newTaskData.assigneeId){
                        toNotify.push(newTaskData.assigneeId)
                    }
                } else if(newTaskData.clinicId && clinics) {
                    
                    const clinic = clinics.find(c => c.id == newTaskData.clinicId)
                    clinic && clinic.users.forEach(i => toNotify.push(i.id))
                }


                let notifContent = `${newTaskData.name}`
                if(newTaskData.parentId){
                    notifContent = `Subtask: ${newTaskData.name}`
                }

                const cleanedtoNotify = Array.from(new Set(toNotify.filter((item) => item.trim() !== "")));
                sendNotification({
                    title: "A task is updated",
                    content: notifContent,
                    createdBy: currentUserId,
                    dataId: taskId,
                    type: "task",
                    appRoute: `/board/${boardId}?t=${taskId}`,
                    sentTo: cleanedtoNotify
                })


            } else {
                console.error('Update failed, reverting state...');
                console.log(res.message)
            }

            return res; // Return the successful response
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };
    

    const addTask = async (data:TaskAddTypeComplete) => {
        const res = await _addTask(data)
        const updatedTask = res.task

        try {
            if(res.success && updatedTask){
                setTasks(prevdata => {
                    if(!prevdata) return [updatedTask]
                    return [updatedTask, ...prevdata]
                })

                alert("Task added successfully!");
            } else {
                alert("Adding task failed, something went wrong")
                console.log(res)
            }

        } catch (error) {
            alert("Adding task failed, something went wrong")
            console.error(error)
        }
    }
    const addUser = async (data:UserAddType) => {
        const res = await _addUser(data)
        const newUser = res.user

        try {
            if(res.success && newUser){
                setappState((prevdata) => {
                    if (!prevdata) return;
              
                    return {
                      ...prevdata, // Copy previous state
                      users: [...(prevdata.users || []), newUser], // Add newUser to the users array
                    };
                  });

                  alert("User added successfully!");
            } else {
                alert("Adding user failed, something went wrong")
                console.log(res)
            }

        } catch (error) {
            alert("Adding user failed, something went wrong")
            console.error(error)
        }
    }
    const addClinic = async (data:ClinicAddType) => {
        const res = await _addCLinic(data)
        const newClinic = res.clinic

        try {
            if(res.success && newClinic){
                setClinics((prevdata) => {
                    if (!prevdata) return [newClinic];
                    return [...prevdata, newClinic]
                  });

                  alert("Clinic added successfully!");
            } else {
                alert("Adding Clinic failed, something went wrong")
                console.log(res)
            }

        } catch (error) {
            alert("Adding Clinic failed, something went wrong")
            console.error(error)
        }
    }

    const addBoard = async  (data:BoardAddType,  onSuccess?:(res:Awaited<ReturnType<typeof ADD_BOARD>>)=>void ) => {

        const res = await ADD_BOARD(data)
        try {
            if(res.success){

                if (!res.board) return;
                setappState((prevState) => {
                    
                    const updatedState = {
                        ...prevState,
                        currentUser: {
                            ...prevState.currentUser,
                            
                            boards: [...prevState.currentUser.boards, res.board!],
                        },
                    };
                    return updatedState;
                });

                if(onSuccess){
                    onSuccess(res)
                }
                router.push(`/board/${res.board.id}`)

            } else {
                console.error(res.message, 'appstate addBoard')

            }

        }
        catch(error) {
            console.error(error, 'appstate addBoard')
        }

        return res

        
    }

    function updateBoard(boardId:string,newData:Partial<TypeBoardComplete>){
        if(!boardId) return
        
        setBoards(prevdata => {
            const index = prevdata.findIndex((board) => board.id === boardId);
            if (index === -1) return prevdata; // No update needed

            const newBoards = [...prevdata];

            console.log(newBoards, 'newBoards')
            newBoards[index] = { ...prevdata[index], ...newData };
          return newBoards
        })
      }

    function updateBoardStatus(boardStatusData:BoardStatus){
        setBoardStatuses(prevdata => {
        if(!prevdata) return [boardStatusData]
        return [...prevdata.filter(t => t.id != boardStatusData.id), boardStatusData]      
        })
    }

    function setKanbanData({boards,tasks,boardStatuses,clinics}:KanbanDataPropsType){
        if(boards){
          setBoards(boards)
        }
        if(tasks){
          setTasks(tasks)
        }
        if(boardStatuses){
          setBoardStatuses(boardStatuses)
        }
        if(clinics){
            setClinics(clinics)
        }

    }



    const action = {
        subtasks: {
            update: ""
        }
    }
      
    return (
        <AppStateContext.Provider value={{addClinic, addUser, setKanbanData, boards,tasks, boardStatuses, appState, setappState, updateTask, addTask, setTasks, addBoard, updateBoard, clinics }}>
            {children}
        </AppStateContext.Provider>
    );
}

export function useAppStateContext() {
    const context = useContext(AppStateContext);
    if (!context) {
      throw new Error("useAppStateContext must be used within a AppStateContextProvider");
    }
    return context;
}




  