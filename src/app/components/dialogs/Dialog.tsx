"use client"
import {
  Dialog as DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "src/components/ui/dialog";
import { Button } from "../ui/button";
import { ReactNode } from "react";
import { createId } from "@paralleldrive/cuid2";


type DialogAddBoardProps = {
  title?:string;
  trigger?:ReactNode;
  children?:ReactNode;
  header?:ReactNode;
  isOpen?:boolean;
  onOpenChange?: (open: boolean) => void
};

export default function Dialog({isOpen = false, onOpenChange,title = "", trigger,children,header = "" }: DialogAddBoardProps) {
  const key = createId()
  const handleOpenChange = (open:boolean) => {
    if(onOpenChange){
      onOpenChange(open)
    }
  }

  return (
    <DialogRoot open={isOpen} onOpenChange={handleOpenChange} key={key}>
      <DialogTrigger asChild>
      {trigger || (
          <Button variant="outline" className="p-2 hover:text-app-orange-500">
            Show Dialog
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-fit min-w-[600px] !rounded-2xl overflow-hidden">
        <>
      {header !== false &&  <DialogHeader>
          <DialogTitle className="text-stone-500">{title}</DialogTitle>
          {header}
        </DialogHeader>}
          {children}
        </>
      </DialogContent>
    </DialogRoot>
  );
}
