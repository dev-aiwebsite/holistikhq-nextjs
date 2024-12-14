"use client"
import { KanbanBoard } from "@app/components/dndComponents/KanbanBoard";
import { MyTodoBoard } from "@app/components/dndComponents/MyTodo";
import { useAppStateContext } from "@app/context/AppStatusContext";
import { useMemo } from "react";

export default function Page() {
    const {appState, myTodoBoard} = useAppStateContext()
    const currentUser = useMemo(()=>{
        return appState.currentUser
    },[appState])
    return (<>
            <MyTodoBoard className="bg-app-brown-200 board-wrapper py-4" />
        </>
    );

}