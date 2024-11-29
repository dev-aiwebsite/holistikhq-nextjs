"use client"
import { useState } from "react"
import Dialog from "./Dialog";
import AddBoardForm from "../forms/FormAddBoard";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";


type DialogAddBoardPropsType = {
    isOpen?:boolean
}
export function DialogAddBoard({isOpen}:DialogAddBoardPropsType) {
  const [dialogOpen,setDialogOpen] = useState(isOpen)
  
  return (
    <Dialog isOpen={dialogOpen} onOpenChange={setDialogOpen}
    title="New Board"
    trigger={  <Button className="bg-white/50" variant="ghost" size="icon">
        <Plus size={16} strokeWidth={3} />
    </Button>}
        >
        <AddBoardForm onSuccess={()=>setDialogOpen(false)}/>
    </Dialog>
  )
}
