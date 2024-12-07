"use client"
import { MyBoard } from "@app/components/dndComponents/MyBoard";
import { useAppStateContext } from "@app/context/AppStatusContext";
import { useMemo } from "react";

export default function Page() {
    const {appState} = useAppStateContext()
    const currentUser = useMemo(()=>{
        return appState.currentUser
    },[appState])
    const role = currentUser.roles
    
    return (<>
        <MyBoard className="bg-app-brown-200 board-wrapper py-4" />
        </>
    );

}