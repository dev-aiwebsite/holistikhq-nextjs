"use client"
import { ReactNode, useState } from "react"
import Dialog from "./Dialog";
import { AddTaskIcon } from "public/svgs/svgs";
import { cn } from "@lib/utils";
import TaksTemplateEditor from "../ui/TaksTemplateEditor";
import { Wand2 } from "lucide-react";
import { Button } from "../ui/button";


type DialogTaskTemplateType = {
  isOpen?: boolean,
  triggerContent?: {
    text?: string;
    icon?: ReactNode;
    button?: JSX.Element;
  },
  boardId?:string;

}
export function DialogTaskTemplate({boardId,triggerContent, isOpen }: DialogTaskTemplateType) {
  const [dialogOpen, setDialogOpen] = useState(isOpen)

  let triggerEl = <Button variant="outline" className="p-2 hover:text-app-orange-500">
                <Wand2 size={16} fill="currentColor" strokeWidth={1} />
                </Button>

  

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
    <Dialog isOpen={dialogOpen} onOpenChange={setDialogOpen}
      title="Task Templates"
      trigger={triggerEl}
    >
            <TaksTemplateEditor boardId={boardId} />
    </Dialog>
  )
}
