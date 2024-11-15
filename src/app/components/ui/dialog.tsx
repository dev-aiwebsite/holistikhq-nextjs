
import { ReactNode } from "react"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "src/components/ui/dialog";
import { Button } from "./button";


type AppDialogPropsType = {
    children?:ReactNode;
    headerContent?:ReactNode | string
}
export function AppDialog({children,headerContent}:DialogPropsType) {
  return (
      <DialogContent className="max-w-[425px] md:max-w-full md:w-[600px]">
        <DialogHeader>
          <DialogTitle>{headerContent}</DialogTitle>
        </DialogHeader>
          {children}
        {/* <DialogFooter>
          <Button type="submit">Save</Button>
        </DialogFooter> */}
      </DialogContent>
  )
}
