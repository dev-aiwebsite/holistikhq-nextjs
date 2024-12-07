"use client"
import { useState } from "react"
import Dialog from "./Dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import FormAddClinic from "../forms/FormAddClinic";

type DialogAddBoardPropsType = {
    isOpen?:boolean
}
export function DialogAddClinic({isOpen}:DialogAddBoardPropsType) {
  const [dialogOpen,setDialogOpen] = useState(isOpen)
  
  return (
    <Dialog isOpen={dialogOpen} onOpenChange={setDialogOpen}
    title="New Clinic"
    trigger={
        <Button type="button" className="btn-primary btn-w-icon">
            <span>Add clinic</span><Plus size={15} strokeWidth={3} />
        </Button>
    }
        >
        <FormAddClinic onCancel={()=>setDialogOpen(false)} onSuccess={()=>setDialogOpen(false)}/>
    </Dialog>
  )
}
