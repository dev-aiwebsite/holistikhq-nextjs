"use client"
import { ReactNode, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "src/components/ui/dialog";
import { Button } from "./button";


type DialogAddTaskPropsType = {
    children?:ReactNode;
    headerContent?:ReactNode | string;
    isOpen?:boolean

}
export function DialogAddTask({children,isOpen,headerContent}:DialogAddTaskPropsType) {
  const [dialogOpen,setDialogOpen] = useState(isOpen)
  
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="max-w-[425px] md:max-w-full md:w-[600px]">
        <DialogHeader>
          <DialogTitle>{headerContent}</DialogTitle>
        </DialogHeader>
          {children}
        {/* <DialogFooter>
          <Button type="submit">Save</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  )
}
