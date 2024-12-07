"use client"
import { useState } from "react"
import Dialog from "./Dialog";
import AddBoardForm from "../forms/FormAddBoard";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import FormAddUser from "../forms/FormAddUser";

type DialogAddBoardPropsType = {
    isOpen?:boolean
}
export function DialogAddUser({isOpen}:DialogAddBoardPropsType) {
  const [dialogOpen,setDialogOpen] = useState(isOpen)
  
  return (
    <Dialog isOpen={dialogOpen} onOpenChange={setDialogOpen}
    title="New User"
    trigger={
        <Button type="button" className="btn-primary btn-w-icon">
            <span>Add user</span><Plus size={15} strokeWidth={3} />
        </Button>
    }
        >
        <FormAddUser onCancel={()=>setDialogOpen(false)} onSuccess={()=>setDialogOpen(false)}/>
    </Dialog>
  )
}
