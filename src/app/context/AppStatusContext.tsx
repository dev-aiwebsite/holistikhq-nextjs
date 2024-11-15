"use client"
import {createContext, Dispatch, SetStateAction, useContext, useState } from "react";
import {Task, User} from "prisma/prisma-client"
import { CompleteTaskWithRelations, TypeBoardWithStatus } from "@lib/types";
import { _addTask, _updateTask } from "@lib/server_actions/database_crud";
import { createId } from "@paralleldrive/cuid2";

export type AppStateDataType = {
    users:User[];
    currentUser: User & {
        boards: TypeBoardWithStatus[];
    };
    tasks?: CompleteTaskWithRelations[]

};


 type TypeAppStateContext = {
    appState:AppStateDataType;
    setappState:Dispatch<SetStateAction<AppStateDataType>>;
    updateTask: (newTask:CompleteTaskWithRelations) => void;
    addTask: (taskData:CompleteTaskWithRelations) => void;
}


export const AppStateContext = createContext<TypeAppStateContext | null>(null);

type AppStateContextProviderType = {
    children: React.ReactNode
    data: AppStateDataType
}


export default function AppStateContextProvider({children, data}:AppStateContextProviderType) {
    const AppState:AppStateDataType = {
        users:data.users,
        currentUser: data.currentUser,
        tasks: data?.tasks ? data.tasks : []
    }

    const [appState,setappState] = useState(AppState);

    const updateTask = async (newTaskData: CompleteTaskWithRelations) => {
        const taskId = newTaskData.id;
        if (!taskId) return;
    
        // Store the previous state for reverting if necessary
        const previousTask = appState.tasks.find(task => task.id === taskId);
    
        // Optimistically update the state
        setappState((prevState) => ({
            ...prevState,
            tasks: prevState?.tasks?.map((task) =>
                task.id === taskId ? { ...task, ...newTaskData } : task
            ),
        }));
    
        try {
            // Attempt to update the task in the backend
            const res = await _updateTask(taskId, newTaskData);
    
            // If the response indicates failure, revert the appState
            if (!res.success) {
                console.error('Update failed, reverting state...');
                setappState((prevState) => ({
                    ...prevState,
                    tasks: prevState?.tasks?.map((task) =>
                        task.id === taskId ? { ...task, ...previousTask } : task
                    ),
                }));
            }
    
            return res; // Return the successful response
        } catch (error) {
            console.error('Error updating task:', error);
            
            // Revert the state on error
            setappState((prevState) => ({
                ...prevState,
                tasks: prevState?.tasks?.map((task) =>
                    task.id === taskId ? { ...task, ...previousTask } : task
                ),
            }));
        }
    };
    

    const addTask = (data:CompleteTaskWithRelations) => {
        const taskId = createId();
        const newTaskData = { ...data, id: taskId } as CompleteTaskWithRelations;
    
        // Immediately update the app state with the new task
        setappState((prevState) => ({
            ...prevState,
            tasks: [...(prevState?.tasks || []), newTaskData],
        }));
    
        // Then, make the async call to save the task in the backend
        _addTask(newTaskData)
            .then((res) => {
                console.log("Task added successfully:", res);
            })
            .catch((error) => {
                console.error("Error adding task:", error);
    
                // Optional: Remove the task from state if the backend call fails
                setappState((prevState) => ({
                    ...prevState,
                    tasks: prevState?.tasks?.filter((task) => task.id !== taskId),
                }));
            });
    }

    return (
        <AppStateContext.Provider value={{ appState, setappState, updateTask, addTask }}>
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




  