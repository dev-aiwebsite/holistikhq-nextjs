"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "src/components/ui/dialog";
import { Button } from "../ui/button";
import { Zap } from "lucide-react";
import Automations from "../automationblock/Automations";
// import AutomationDetails from '../automationblock/AutomationDetails';


type DialogAutomationsProps = {
  boardId: string;
};

export default function DialogAutomations({ boardId }: DialogAutomationsProps) {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="p-2 hover:text-app-orange-500">
          <Zap size={16} fill="currentColor" strokeWidth={1} />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-fit">
        <DialogHeader>
          <DialogTitle>Automations</DialogTitle>
        </DialogHeader>
          <Automations boardId={boardId} />
      </DialogContent>
    </Dialog>
  );
}
