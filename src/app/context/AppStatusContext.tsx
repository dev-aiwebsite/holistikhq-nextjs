"use client"
import {createContext, Dispatch, SetStateAction, useContext, useState } from "react";
import {Board, BoardStatus, Clinic, Conversation, Message, Task, User} from "prisma/prisma-client"
import { BoardAddType, CompleteTaskWithRelations, ConversationCompleteType, TypeBoardComplete, TypeClinicComplete, TypeCurrentUserComplete } from "@lib/types";
import { _addNotification, _addTask, _updateTask } from "@lib/server_actions/database_crud";
import { createId } from "@paralleldrive/cuid2";
import { ADD_BOARD } from "@lib/server_actions/appCrud";
import { error } from "console";
import { useRouter } from "next/navigation";
import { NotificationAddType } from "@lib/server_actions/query";

export type AppStateDataType = {
    users:User[];
    currentUser: TypeCurrentUserComplete;
    boards?: Board[];
    boardStatuses?:BoardStatus[];
    tasks?: Task[];
    clinics?: TypeClinicComplete[]
};

type KanbanDataPropsType = {boards?:Board[],tasks?:Task[],boardStatuses?:BoardStatus[]}

 type TypeAppStateContext = {
    appState:AppStateDataType;
    setappState:Dispatch<SetStateAction<AppStateDataType>>;
    tasks:Task[] | null;
    boards: TypeBoardComplete[];
    boardStatuses:BoardStatus[] | null;
    updateTask: (newTask:CompleteTaskWithRelations) => void;
    addTask: (taskData:CompleteTaskWithRelations) => void;
    addBoard: (data:BoardAddType, onSuccess?:(res:Awaited<ReturnType<typeof ADD_BOARD>>)=>void) => Promise<Awaited<ReturnType<typeof ADD_BOARD>>>;
    setKanbanData: (data:KanbanDataPropsType)=>void;
    setTasks:Dispatch<SetStateAction<Task[] | null>>
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
        tasks: data?.tasks ? data.tasks : [],
        clinics: data.clinics || []
    }
    
    const [appState,setappState] = useState(AppState);
    const [boards, setBoards] = useState<TypeBoardComplete[]>(data.currentUser.boards);
    const [tasks, setTasks] = useState<Task[] | null>(null)
    const [boardStatuses,setBoardStatuses] = useState<BoardStatus[] | null>(null)


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

    const updateTask = async (newTaskData: CompleteTaskWithRelations) => {
        const taskId = newTaskData.id;
        const currentUserId = appState.currentUser.id
        if (!taskId) return;
    
        try {
            // Attempt to update the task in the backend
            const res = await _updateTask(taskId, newTaskData);
    
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
                } else {
                    newTaskData.clinic.users.forEach(i => toNotify.push(i.id))
                }
                
                const cleanedtoNotify = Array.from(new Set(toNotify.filter((item) => item.trim() !== "")));
                sendNotification({
                    title: "A task is updated",
                    content: `${newTaskData.name}`,
                    createdBy: currentUserId,
                    dataId: taskId,
                    type: "task",
                    appRoute: `/board/${boardId}?t=${taskId}`,
                    sentTo: cleanedtoNotify
                })


            } else {
                console.error('Update failed, reverting state...');
            }

            return res; // Return the successful response
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };
    

    const addTask = async (data:CompleteTaskWithRelations) => {
        const res = await _addTask(data)
        const updatedTask = res.task

        try {
            if(res.success && updatedTask){
                setTasks(prevdata => {
                    if(!prevdata) return [updatedTask]
                    return [updatedTask, ...prevdata]
                })

            } else {
                alert("Adding task failed, something went wrong")
            }

        } catch (error) {
            alert("Adding task failed, something went wrong")
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

    function updateBoard(board:Board){
        if(!board) return
        setBoards(prevdata => {
          if(!prevdata) return [board]
          return {...prevdata, ...board}
        })
      }

    function updateBoardStatus(boardStatusData:BoardStatus){
        setBoardStatuses(prevdata => {
        if(!prevdata) return [boardStatusData]
        return [...prevdata.filter(t => t.id != boardStatusData.id), boardStatusData]      
        })
    }

    function setKanbanData({boards,tasks,boardStatuses}:KanbanDataPropsType){
        if(boards){
          setBoards(boards)
        }
        if(tasks){
          setTasks(tasks)
        }
        if(boardStatuses){
          setBoardStatuses(boardStatuses)
        }
    }
      
    return (
        <AppStateContext.Provider value={{setKanbanData, boards,tasks, boardStatuses, appState, setappState, updateTask, addTask, setTasks, addBoard }}>
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




  