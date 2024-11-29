"use client"

import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { useAppStateContext } from "@app/context/AppStatusContext";
import { useRouter } from "next/navigation";
import { Bell, ClipboardList, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../dndComponents/ui/scroll-area";


type TypeNotifications = {
    onClick?: () => void;
    list?: ""
}
const NotificationSmall = ({ }: TypeNotifications) => {
    const { appState } = useAppStateContext()
    const users = appState.users
    const router = useRouter()

    const notifications = appState.currentUser.notifications
    console.log(notifications, ' notifications')

    function handleNotificationClick(route: string | null) {
        if (route) {
            router.push(route)
        }
    }

    function iconSelector(type){
        if(type == 'task'){
            return <ClipboardList className="text-teal-400" />

        } else if (type == 'message'){
            return <MessageCircle className="text-amber-400" />

        } else {
            return <Bell className="text-blue-400" />
        }
    }

    return (
        <div className="flex flex-col">
            <div>
            <h4 className="font-semibold">Notifications</h4>
            <ToggleGroup type="single" className="gap-0 bg-white ring-1 ring-app-orange-500 divide-x divide-solid divide-app-orange-500 rounded-lg w-fit grid grid-cols-3 !text-xs *:rounded-none overflow-hidden text-app-orange-500 *:py-1 *:h-[unset]"
                defaultValue="unread">
                <ToggleGroupItem value="unread" className="btn-w-icon text-xs data-[state=on]:bg-app-orange-500 data-[state=on]:text-white">
                    <span>Unread</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="all" className="btn-w-icon text-xs data-[state=on]:bg-app-orange-500 data-[state=on]:text-white">
                    <span>All</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="read" className="btn-w-icon text-xs data-[state=on]:bg-app-orange-500 data-[state=on]:text-white">
                    <span>Read</span>
                </ToggleGroupItem>

            </ToggleGroup>
            </div>
            <div className="relative flex-1 shadow-sm ring-1 ring-gray-200 mt-2 w-full flex flex-col rounded-lg min-h-1/2 items-center overflow-auto">
                <ScrollArea  className="w-full min-h-[20vh] !absolute top-0">
                <ul className="list-none w-full">
                    {notifications && notifications.map(n => {

                        const from = users.find(u => u.id == n.createdBy)
                        return <li key={n.id} onClick={() => handleNotificationClick(n.appRoute)}>
                            <div className="flex flex-row flex-nowrap items-center p-2 bg-orange-500/10 hover:bg-orange-500/15 cursor-pointer">
                                <div className="p-2">
                                    {n.type && iconSelector(n.type)}
                                </div>
                                <div className="flex flex-col p-2 text-gray-600 space-y-1">
                                    {/* <span className="text-xs text-gray-400">{from && `${from.firstName} ${from.lastName}`}</span> */}
                                    <div>
                                        <p className="text-sm font-semibold">{n.title}</p>
                                        <p className="text-sm truncate">{n.content}</p>
                                    </div>
                                    <span className="text-xs text-gray-400">{n.createdAt.toDateString()}</span>
                                </div>
                                <div className="ml-auto p-2">
                                    <button className="btn btn-primary rounded-full text-xs !py-1.5 shadow-sm">View</button>
                                </div>
                            </div>
                        </li>

                    })}
                </ul>
                {!notifications && <span className="mt-10 text-center w-full h-fit text-sm text-gray-500">Empty</span>}
                </ScrollArea>
            </div>
        </div>
    );
}

export default NotificationSmall;