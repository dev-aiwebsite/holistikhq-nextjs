"use client"
import { ReactNode, useState } from "react"
import Dialog from "./Dialog";
import { AddTaskIcon } from "public/svgs/svgs";
import FormAddTask, { TypeAddTaskdefaultData } from "../forms/FormAddTask";
import { cn } from "@lib/utils";


type DialogAddTaskPropsType = {
  isOpen?: boolean,
  triggerContent?: {
    text?: string;
    icon?: ReactNode;
    button?: JSX.Element;
  },
  boardId?:string;
  formDefaultData?:TypeAddTaskdefaultData;

}
export function DialogAddTask({boardId,triggerContent, isOpen, formDefaultData }: DialogAddTaskPropsType) {
  const [dialogOpen, setDialogOpen] = useState(isOpen)
  

  let triggerEl = <span className={cn("navitem-trigger !text-white bg-app-blue-500 hover:!bg-app-blue-500 hover:opacity-90 !w-fit")}>
      <AddTaskIcon className="main-icon icon" />
        <span className="title">Create Task</span>
  </span>

  if(triggerContent){
    if(triggerContent.button){
      triggerEl = triggerContent.button
    } else {
      triggerEl = <span className={cn("navitem-trigger !text-white bg-app-blue-500 hover:!bg-app-blue-500 hover:opacity-90 !w-fit")}>
      {triggerContent.icon ? triggerContent.icon : <AddTaskIcon className="main-icon icon" />}
        {triggerContent.text ? triggerContent.text : <span className="title">Create Task</span>}
        </span>
    }
  }


  return (
    <Dialog header={false} isOpen={dialogOpen} onOpenChange={setDialogOpen}
      title="New Task"
      trigger={triggerEl}
    >
      <FormAddTask defaultData={formDefaultData} boardId={boardId} onCancel={()=>setDialogOpen(false)} />
    </Dialog>
  )
}
