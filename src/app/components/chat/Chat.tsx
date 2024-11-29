"use client"

import { Search, SquarePen } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import ConvoItem from "./ConvoItem";
import { useCallback, useState } from "react";
import { useAppStateContext } from "@app/context/AppStatusContext";
import ConvoContent from "./ConvoContent";
import { useRouter, useSearchParams } from "next/navigation";
import { createId } from "@paralleldrive/cuid2";


const Chat = () => {
    const router = useRouter();
    const {appState} = useAppStateContext()
    const searchParams = useSearchParams()
    const convo_id = searchParams.get('cid')
    const newConvoId = searchParams.get('new')
    const [activeConvoId, setActiveConviId] = useState(convo_id);
    const [lastSelectedConvoId, setLastSelectedConvoId] = useState(convo_id)
    console.log(appState, 'appstate')

    const handleConvoItemOnClick = useCallback((cid:string) => {
        setActiveConviId(cid)
        router.push(`/messages?cid=${cid}`)
    },[])

    const handleCreateNewMessageOnClick= () => {
        setLastSelectedConvoId(activeConvoId)
        let uid = createId()
        router.push(`/messages?new=${uid}`)
        setActiveConviId(uid)
    }

    const handleOnCloseNewMessage = ()=> {
        setActiveConviId(lastSelectedConvoId)
        router.push(`/messages?cid=${lastSelectedConvoId}`)
    }

    return (
        <div className="flex flex-row flex-nowrap h-full p-0 border border-gray-200">
            <div className="bg-app-brown-200 w-72 max-w-72 h-full border-r border-gray-200">
                <div className="header-h p-6">
                    <div className="flex flex-row items-center">
                        <span className="text-md font-bold">Conversations</span>
                        <Button className="text-app-orange-500 ml-auto rounded-full bg-transparent shadow-none hover:bg-white" variant="default" size="icon"
                        onClick={handleCreateNewMessageOnClick}>
                            <SquarePen size={16} strokeWidth={1.8} />
                        </Button>
                    </div>
                </div>
                <div className="max-h-3-header-h p-6 overflow-auto relative">
                    <div className="z-10 sticky top-0 ring-[1.5rem] ring-app-brown-200 bg-app-brown-200 flex flex-nowrap flex-row items-center relative ">
                        <Search className="absolute left-2" size={16} strokeWidth={1} />
                        <Input className="pl-8 bg-white rounded-full" type="search" placeholder="Search" />
                    </div>

                    <div className="pt-6">
                        <div >
                            {newConvoId && <ConvoItem onClick={()=>handleOnCloseNewMessage()} convo_id={newConvoId}/>}
                            {appState.currentUser.conversations.map(c => <ConvoItem key={c.id} onClick={handleConvoItemOnClick.bind(null,c.id)} convo_id={c.id}/>)}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-1 flex flex-col flex-nowrap">
                {activeConvoId && <ConvoContent convoId={activeConvoId}/>}
            </div>
        </div>
    );
}

export default Chat;