"use client"
import { ChartSplineIcon, ChevronFirst, MessageSquareWarning, SquareKanbanIcon } from "lucide-react";
import Image from "next/image";
import { Key, useState } from "react";
import { DashboardIcon } from "@radix-ui/react-icons";
import { cn } from "@lib/utils";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@app/components/ui/accordion"
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AddTaskIcon, MessageIcon } from "public/svgs/svgs";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import LogoutBtn from "./LogoutBtn";
import { useDrawerContext } from "@app/context/DrawerContext";
import { DialogTrigger } from "src/components/ui/dialog";
import { useAppStateContext } from "@app/context/AppStatusContext";
import { Board } from "@prisma/client";
import { getInitials } from "@lib/helperFunctions";
import ProfileAvatar from "./ProfileAvatar";


const Sidebar = ({ searchParams }: { searchParams?: { [key: string]: string } }) => {

    const { isOpen, openDrawer,closeDrawer,content } = useDrawerContext()
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)


    function handleOpenTaskForm() {
        openDrawer()
    }

    const {appState} = useAppStateContext()
    const currentUser = appState.currentUser
    const boards = currentUser.boards
    
    return (
        <div className={cn("sidebar bg-app-green-400 flex flex-col flex-nowrap", isCollapsed && 'collapsed')}>
            <div className="h-[var(--header-h)] max-h-[var(--header-h)] flex items-center ">
                <Image
                    className="mx-auto object-fit"
                    src="/images/appholistikhq-white.png"
                    width="200"
                    height="200"
                    alt="Holistikhq"
                >

                </Image>
            </div>
            
            <button className="navitem">
                <DialogTrigger asChild>
                <span className={cn("navitem-trigger !text-white bg-app-blue-500 hover:!bg-app-blue-500 hover:opacity-90 !w-fit")}>
                    <AddTaskIcon className="main-icon icon" />
                    <span className="title">Create Task</span>
                </span>
                </DialogTrigger>
            </button>
            
            <ul className="navlist">
                <li className="navitem">
                    <Link className={cn("navitem-trigger", pathname == '/dashboard' ? 'active' : '')}
                        href="/dashboard">
                        <DashboardIcon className="main-icon icon" />
                        <span className="title text-current">Dashboard</span>
                    </Link>
                </li>
                <li className="navitem">
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1" >
                            <AccordionTrigger className={cn("navitem-trigger", pathname == '/board' ? 'active' : '')}>
                                <span className="flex items-center flex-nowrap">
                                    <SquareKanbanIcon className="main-icon icon" />
                                    <span className="title text-current">Boards</span>
                                </span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <ul className="submenu">
                                    {boards && boards.map((board)=>(<li key={board.id} className="submenu-navitem">
                                        <Link  className={cn("navitem-trigger", pathname == '' ? 'active' : '')}
                                            href={`/board/${board.id}`}>
                                            {board.name}
                                        </Link>
                                    </li>)) }
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </li>
                <li className="navitem">
                    <Link className={cn("navitem-trigger", pathname == '/chat' ? 'active' : '')}
                        href="/chat">
                        <MessageIcon className="main-icon icon" />
                        <span className="title text-current">Chat</span>
                    </Link>
                </li>
                <li className="navitem">
                    <Link className={cn("navitem-trigger", pathname == '/analytics' ? 'active' : '')}
                        href="/analytics">
                        <ChartSplineIcon className="main-icon icon" />
                        <span className="title text-current">Analytics</span>
                    </Link>
                </li>


            </ul>

            <div className="mt-auto bg-app-blue-500">
                <ul className="space-y-2 p-[calc(var(--sidebar-padding)_/_2)]">
                    <li>
                        <Link className={cn("navitem-trigger flex flex-row flex-wrap-nowrap items-center gap-4")}
                            href="#">
                            
                            <ProfileAvatar name={getInitials(`${currentUser.firstName} ${currentUser.lastName}`)} src={currentUser.profileImage}/>

                            <span className="title text-white capitalize">{currentUser.firstName}</span>
                        </Link>
                    </li>

                    <li>
                        <Link className={cn("navitem-trigger flex flex-row flex-wrap-nowrap items-center title text-white hover:underline hover:text-app-orange-500 gap-4")}
                            href="/report-issue">
                            <MessageSquareWarning size={20} strokeWidth={1.75} />
                            <span className="">Report Issue</span>
                        </Link>
                    </li>
                    <li>
                        <LogoutBtn className={cn("flex flex-row flex-wrap-nowrap items-center title text-white hover:underline hover:text-app-orange-500 gap-4")} />
                    </li>
                </ul>
                
                <div style={{ height: 'var(--footer-h)' }} className="relative">
                    <button type="button" className="sidebar-collapsed-toggle btn-circle bg-white p-1 absolute right-0 translate-x-1/2 text-app-orange-500 hover:bg-orange-100 shadow-md ring-1 ring-gray-200"
                        onClick={() => setIsCollapsed(!isCollapsed)}>
                        <ChevronFirst size={24} />
                    </button>
                </div>
            </div>

        </div>
    );
}

export default Sidebar;