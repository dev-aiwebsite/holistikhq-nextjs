"use client"
import { useState } from "react"
import Dialog from "./Dialog";
import AddBoardForm from "../forms/FormAddBoard";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { cn } from "@lib/utils";


type DialogAddBoardPropsType = {
    isOpen?:boolean;
    classNameIcon?:string;
}
export function DialogAddBoard({isOpen,classNameIcon}:DialogAddBoardPropsType) {
  const [dialogOpen,setDialogOpen] = useState(isOpen)
  
  return (
    <Dialog isOpen={dialogOpen} onOpenChange={setDialogOpen}
    title="New Board"
    trigger={<Button className={cn("bg-white/50", classNameIcon && classNameIcon )} variant="ghost" size="icon">
        <Plus size={16} strokeWidth={3} />
    </Button>}
        >
        <AddBoardForm onSuccess={()=>setDialogOpen(false)}/>
    </Dialog>
  )
}
