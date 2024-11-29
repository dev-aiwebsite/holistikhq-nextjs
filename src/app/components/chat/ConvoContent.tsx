"use client"

import { _addMessage, _getMessages } from "@lib/server_actions/database_crud";
import { Message } from "prisma/prisma-client";
import { useEffect, useRef, useState } from "react";
import ProfileAvatar from "../ui/ProfileAvatar";
import { useAppStateContext } from "@app/context/AppStatusContext";
import { cn } from "@lib/utils";
import { AddTaskIcon } from "public/svgs/svgs";
import { Button } from "../ui/button";
import { DialogTrigger } from "src/components/ui/dialog";
import RichTextEditor from "../RichTextEditor";
import { SendHorizontal } from "lucide-react";
import { ConversationCompleteType, ConvoInfoType, MessageAddType } from "@lib/types";
import { createId } from "@paralleldrive/cuid2";
import MultipleSelect from "../ui/MultipleSelect";
import { ADD_MSG_TO_CONVO } from "@lib/server_actions/appCrud";
import { useRouter, useSearchParams } from "next/navigation";
import InfiniteScroll from "../ui/DynamicScroller";
import { DialogAddTask } from "../dialogs/DialogAddTask";
import { TypeAddTaskdefaultData } from "../forms/FormAddTask";
import { stripHtmlTags } from "@lib/helperFunctions";

type ConvoContentType = {
    convoId: string;
}

const ConvoContent = ({ convoId }: ConvoContentType) => {
    console.log('convoContent renders')
    const router = useRouter();
    const searchParams = useSearchParams()
    const convo_id = searchParams.get('cid')
    const newConvoId = searchParams.get('new')
    const isCreateMessage = newConvoId
    const { appState, setappState } = useAppStateContext()
    const [messages, setMessages] = useState<Message[] | null>(null)
    const [newMessage, setNewMessage] = useState<string>("")
    const [convoInfo, setConvoInfo] = useState<ConvoInfoType | null>(null)
    const [convoRecipient, setConvoRecipient] = useState<string[]>([])
    const convo_data = appState.currentUser.conversations.find(convo => convo.id == convoId)
    console.log(newMessage, 'newMessage top')
    useEffect(() => {
        if (!convo_data){
            setMessages(null)
            setConvoInfo(null)
            return 
        }

        _getMessages(convoId)
            .then(res => {
                if (res.success) {
                    setMessages(res.messages)
                }
            })

    }, [convoId])


    useEffect(() => {

        const profileInfo = {
            taskId: "",
            fullName: "Unknown",
            profileImage: "" as string | undefined
        }

        if (!convo_data) return setConvoInfo(null)
        const convo_type = convo_data.type
        const usersInConvo = convo_data.users

        if (convo_type == "private" && usersInConvo.length == 2) {
            const userInfo = convo_data.users.find(user => user.id != appState.currentUser.id)
            profileInfo.fullName = userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : "Unknown"
            profileInfo.profileImage = userInfo?.profileImage || undefined

        } else if (convo_type == "ticket") {
            profileInfo.taskId = convo_data.taskId || ""
            profileInfo.fullName = convo_data.task.name
            profileInfo.profileImage = convo_data.icon || undefined
        }

        setConvoInfo(profileInfo)


    }, [convoId,isCreateMessage])


    const userList = appState.users.filter(user => user.id != appState.currentUser.id).map(user => {
        
            let data = {
                element: <ProfileAvatar
                src={user?.profileImage || undefined}
                className="w-7 h-7"
                fallbackClassName="!bg-app-orange-500"
                name={`${user.firstName} ${user.lastName}`}
                showName={true}
              />,
              value: user.id,
              text: `${user.firstName} ${user.lastName}`
            }

            return data

    })

    const handleSendMessage = async () => {
        console.log('submitting')
        console.log(newMessage)
        if(!newMessage) return
        const newMessageId = createId()

        const newMessageData: MessageAddType = {
            id: newMessageId,
            createdBy: appState.currentUser.id,
            content: newMessage,
            conversationId: convoId,
            users:convoRecipient
        }
        
        const newStateMessage:Message = {
            id: newMessageId,
            status: "active",
            type: null,
            content: newMessage,
            parentMessageId: null,
            conversationId: convoId,
            createdBy: appState.currentUser.id,
            createdAt: new Date(),
        }


        if (!convo_data) {
            console.log(newMessage,convoInfo, 'adding new conversation')
            const users = appState.users.filter(i => convoRecipient.includes(i.id) || i.id == appState.currentUser.id)
            const optimisticConversationData:ConversationCompleteType = {
                id: convoId,
                status: "active",
                type: "private",
                users: users,
                messages: [newStateMessage],
                createdBy: appState.currentUser.id,
                createdAt: new Date(),
                name: null, // Add a value for the missing 'name' property
                taskId: null, // Add a value for the missing 'taskId' property
                description: null, // Add a value for the missing 'description' property
                icon: null
              }

              setMessages([newStateMessage])

                setappState(prevData => {
                    const updatedData = {
                        ...prevData, 
                        currentUser: {
                            ...prevData.currentUser, 
                            conversations: [optimisticConversationData, // Push the new conversation
                                ...prevData.currentUser.conversations
                                 
                            ]
                        }
                    };
                    return updatedData;
                });

            
                
                ADD_MSG_TO_CONVO(newMessageData)
                .then(res => {
                    console.log(res)
                    if(res.success){
                        router.push(`/messages?cid=${convoId}`)
                    } else {

                    }
                })
                .catch(err => {
                    console.log(err)
                })

            return 
        } 
    

        setMessages(prevMessage => {
         

            let newData = Array.isArray(prevMessage) ? [...prevMessage, newStateMessage] : [newStateMessage]
            return newData
        })
        setNewMessage("")

        ADD_MSG_TO_CONVO(newMessageData)
        .then(res => {
            console.log(res, 'addmessage')
            if (res.success) {

            } else {

            }
        })
        .catch(err => {
            console.log(err, 'add message')
        })
    }
    

    function handleSelect(e) {
        e.preventDefault()

        console.log()
    }

    const onEditorEnter = (e:any) => {
        console.log(e, newMessage, 'on enter')
        handleSendMessage()
    }

    return (<>
        <div className="header-h border-b border-gray-200 flex flex-row items-center p-2 gap-2">
            {!convoInfo && <>
                <div className="flex flex-row gap-1">
                    <span>To:</span>
                        <MultipleSelect onChange={(v)=>setConvoRecipient(v)} list={userList} />
                </div>

            </>}
            {convoInfo && <div

                className={cn(
                    "rounded-lg flex flex-row w-fit max-w-60 overflow-hidden gap-2 hover:bg-gray-100 hover:cursor-pointer p-2"
                )}
            >
                <ProfileAvatar
                    src={convoInfo.profileImage}
                    className="w-9 h-9"
                    fallbackClassName="!bg-app-orange-500"
                    name={convoInfo.fullName}
                />

                <div className="flex-1 flex items-center">
                    <div className="flex flex-col text-sm">
                        <span className="font-bold">{convoInfo.fullName}</span>
                        {convoInfo.taskId &&
                            <div className="text-[.9em] flex flex-row flex-nowrap gap-2">
                                <span className="truncate-1 flex-1 text-stone-500">{convoInfo.taskId}</span>
                            </div>
                        }
                    </div>
                </div>
            </div>}
        </div>
        <div className="flex-1 flex flex-col relative" chat-widget="1">
            <div className="pb-16 flex-1 max-h-3-header-h">
                {messages && messages.map(m => <MessageLayout key={m.id} message={m} />)}
            </div>
            <div className="w-full bg-white absolute bottom-0 mt-auto p-4 flex flex-row items-end gap-1">
                <div className="flex-1 bg-gray-100 rounded-[1.3em]">
                    <RichTextEditor onEnter={(e)=>onEditorEnter(e)} theme="bubble" onChange={(v) => setNewMessage(v)} value={newMessage as string | undefined} />
                </div>
                <Button onClick={handleSendMessage} className="h-fit aspect-square group h-fit rounded-full text-white hover:text-white" variant="ghost" size="icon">
                    <SendHorizontal size={30} strokeWidth={1} absoluteStrokeWidth className="h-[3em] fill-app-orange-500" />
                </Button>
            </div>
        </div>
    </>

    );
}

export default ConvoContent;

const MessageLayout = ({ message }: { message: Message }) => {
    const { appState } = useAppStateContext()
    const userInfo = appState.users.find(user => user.id == message.createdBy)
    const isSender = userInfo ? userInfo.id == appState.currentUser.id : false
    const layoutType = isSender ? "msg_layout-sent" : "msg_layout-received"
    const fullName = userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : "Unknown"
    const profileImage = userInfo?.profileImage || undefined

    const dialogTriggerContent = {
        button: <AddTaskIcon className="main-icon icon cursor-pointer hover:text-app-orange-500" />
    }
    const formData:TypeAddTaskdefaultData = {
        name: stripHtmlTags(message.content).split(" ").slice(0,4).join(" "),
        description: message.content 
    }
    return <>
        <div className={cn("msg_layout", layoutType)}>
            <div className="mt-auto py-4">
                <ProfileAvatar
                    src={profileImage}
                    className="w-9 h-9"
                    fallbackClassName="!bg-app-orange-500"
                    name={fullName}
                />
            </div>
            <div className="space-y-1 w-full">
                <div className="message_content_wrapper w-full group">
                    <div className="message_content" dangerouslySetInnerHTML={{ __html: message.content }}></div>
                    <div className="[&_.title]:!hidden text-gray-500 opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100">
                        <DialogAddTask formDefaultData={formData} triggerContent={dialogTriggerContent}/>
                    </div>
                </div>
            </div>
        </div>

    </>

}