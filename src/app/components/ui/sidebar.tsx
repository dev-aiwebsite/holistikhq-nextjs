"use client"
import { ChartSplineIcon, ChevronFirst, ListTodo, MessageSquareWarning, NotebookPen, Plus, SquareKanbanIcon, UserRoundPlus } from "lucide-react";
import Image from "next/image";
import { Key, ReactNode, useState } from "react";
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
import Dialog from "../dialogs/Dialog";
import AddBoardForm from "../forms/FormAddBoard";
import { Button } from "./button";
import FormAddTask from "../forms/FormAddTask";
import { DialogAddTask } from "../dialogs/DialogAddTask";
import { DialogAddBoard } from "../dialogs/DialogAddBoard";
import NavItem from "./NavItem";


const Sidebar = ({ searchParams }: { searchParams?: { [key: string]: string } }) => {
    const { isOpen, openDrawer, closeDrawer, content } = useDrawerContext()
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)


    function handleOpenTaskForm() {
        openDrawer()
    }

    const { appState } = useAppStateContext()
    const currentUser = appState.currentUser
    const boards = currentUser.boards


    const dialogAddTaskConfig = appState.currentUser.roles.includes('client') ? {
        text: 'Request Task'
    } : undefined
    

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
                <DialogAddTask triggerContent={dialogAddTaskConfig} />
            </button>

            <ul className="navlist">
                <NavItem link="/dashboard" title={"Dashboard"} icon={<DashboardIcon/>} />
                <NavItem link="/board" title={"Boards"} icon={<SquareKanbanIcon />} collapsible>
                    {boards && boards.map((board) => (
                        <NavItem isSubmenuItem key={board.id} link={`/board/${board.id}`} title={board.name} icon={<BoardIcon icon={board.icon} name={board.name} color={board.color}/>} />
                       
                    ))}
                </NavItem>
                {currentUser.roles.includes('client') && <NavItem link="/mytodo" title={"My To Do"} icon={<NotebookPen/>} />}
                <NavItem link="/messages" title={"Messages"} icon={<MessageIcon/>} />
                <NavItem link="/analytics" title={"Analytics"} icon={<ChartSplineIcon/>} />
                <NavItem link="/users" title={"Users"} icon={<UserRoundPlus/>} />
            </ul>
            <div className="mt-auto bg-app-blue-500">
                <ul className="space-y-2 p-[calc(var(--sidebar-padding)_/_2)]">
                    <li>
                        <Link className={cn("navitem-trigger flex flex-row flex-wrap-nowrap items-center gap-4")}
                            href="#">

                            <ProfileAvatar name={getInitials(`${currentUser.firstName} ${currentUser.lastName}`)} src={currentUser.profileImage || undefined} />

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

const BoardIcon = ({name,color,icon}:{name:string,color:string,icon?:ReactNode}) => {
    
    // const istext = icon ? typeof(icon) == "string" : false
    const istext = true
    let text = ""
    // if(!icon){
        text = name[0]
    // } else if(istext){
        
            // text = (icon as string).split(" ").map(i => i[0]).slice(0,2).join("")
    // }
    return <>
        <span style={{backgroundColor: `${color}` }} className="rounded flex items-center justify-center aspect-square text-white">
            {istext ?
                <span className="text-sm">
                    {text}        
                </span>

                : icon
            }
        </span>
    
    </>
}