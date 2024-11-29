"use client"

import { Analytics } from "@app/components/Analytics";
import Meter from "@app/components/Meter";
import NotificationSmall from "@app/components/notification/NotificationSmall";
import { useAppStateContext } from "@app/context/AppStatusContext";
import { mainBoards } from "@lib/const";
import { _getIncompleteTaskCount } from "@lib/server_actions/database_crud";
import Link from "next/link";
import { useEffect, useState } from "react";


type typeIncompleteTaskData = {
    boardId:string;
    boardName:string;
    incompleteTasksCount: number;
}
const Page = () => {
    const { appState } = useAppStateContext()
    const [incompleteTaskData, setIncompleteTaskData] = useState<typeIncompleteTaskData[] | null>(null)
    console.log(appState)
    
    const mainBoardsIds =  mainBoards.map(b => b.id)
    const boards = appState.currentUser.boards
    useEffect(()=>{
        _getIncompleteTaskCount(mainBoardsIds)
        .then(res => {
            console.log(res)
            if(res.success){

                const new_incompleteTaskData = res.counts.map(bd => {
                    const newData = {
                        ...bd,
                        boardName: boards.find(b => b.id == bd.boardId)?.name || ""
                    }
                    return newData
                })

                setIncompleteTaskData(new_incompleteTaskData)
              
            }
        })
        .catch(error => {
            console.error(error, '_getIncompleteTaskCount')
        })

    },[])
    
    return (
        <>
        <div className="pt-10 h-full max-h-2-header-h grid grid-cols-2 p-6 divide-x-2 [&>*]:px-10 divide-gray-300">
            <div className="grid grid-cols-2 grid-rows-2 gap-10 p-4">
                    {incompleteTaskData &&
                        incompleteTaskData.map(d => (
                        <div key={d.boardId} className="flex flex-col text-center text-sm ring-1 ring-gray-200 hover:shadow-lg rounded-lg justify-center py-4 items-center">
                            <p className="font-bold">{d.boardName}</p>
                            <Meter count={d.incompleteTasksCount} rotation={"90"} />
                            <Link className="underline text-blue-500 font-medium"
                                href={`/board/${d.boardId}`}>
                                Access Board
                            </Link>
                        </div>

                        ))
                    }
            </div>

            <div className="p-4 space-y-4 grid grid-rows-2">
                    <NotificationSmall />
                    <Analytics />
            </div>

        </div>
        </>

    );
}

export default Page;