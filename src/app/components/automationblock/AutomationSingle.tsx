"use client"
import { useAppStateContext } from "@app/context/AppStatusContext";
import { MoveRight, Plus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "src/components/ui/dialog";
import { SelectScrollable } from "../ui/select";
import TriggerCard from "./TriggerCard";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { triggersList } from "@lib/const";
import ActionCard from "./ActionCard";
import { _updateAutomation } from "@lib/server_actions/database_crud";
import { Automations } from "prisma/prisma-client";

type SingleAutomationProps = {
    boardId: string;
    automationId: string;
    onOpenChange?: () => void;
    isOpen?:boolean;
}
const SingleAutomation = ({ boardId, automationId, onOpenChange, isOpen }: SingleAutomationProps) => {
    console.log(`open singleAutomation ${automationId}`)
    const { appState, boards, updateBoard } = useAppStateContext()
    const [dialogOpen,setDialogOpen] = useState(isOpen)
    const boardData = boards.find(board => board.id == boardId)
    if(!boardData || !boardData.Automations) return
    const automationData = boardData?.Automations.find(a => a.id == automationId)
    const automationTriggers = automationData?.triggers || []
    const automationActions = automationData?.actions || []
    const [triggers,setTriggers] = useState(automationTriggers)
    const [actions,setActions] = useState(automationActions)
    const [automationName, setAutomationName] = useState(automationData.name)

    const handleAddTrigger = () => {
        const newTrigger = {
            type: "status",
            value: ""
        };
        setTriggers(prevTriggers => [...prevTriggers, newTrigger]);
    }

    const handleAddActions = () => {
        const newAction = {
            type: "status",
            value: "" 
        };
        setActions(prevTriggers => [...prevTriggers, newAction]);
    }

    const handleTriggerUpdate = (v, indx) => {
        setTriggers(prevTriggers => {
          const updatedTriggers = [...prevTriggers];
      
          updatedTriggers[indx] = {
            ...updatedTriggers[indx], 
            ...v                      
          };
      
          return updatedTriggers;
        });
      };
    const handleActionUpdate = (v, indx) => {
        console.log(v,indx,'handleActionUpdate')
        setActions(prevActions => {
          const updatedActions = [...prevActions];
      
          updatedActions[indx] = {
            ...updatedActions[indx], 
            ...v                      
          };
      
          return updatedActions;
        });
      };
      

      const handleSaveAutomation = () => {
        console.log('saving automation');
    
        
        // Prepare the new data for comparison
        const newAutomationData = {
            ...automationData,
            triggers: [...triggers],
            actions: [...actions],
            updatedBy: appState.currentUser.id,
            name: automationName,
        };
    
        // Compare new data with current data
        const isDataChanged = JSON.stringify(automationTriggers) !== JSON.stringify(newAutomationData.triggers) ||
                              JSON.stringify(automationActions) !== JSON.stringify(newAutomationData.actions) || 
                              automationData.name !== automationName
    
        // If no changes, do not update the state or call the API
        if (!isDataChanged) {
            console.log('No changes detected. Skipping update.');
            return;
        }
    
        const newAutomations = [...boardData.Automations!]
        const index = newAutomations.findIndex((a) => a.id === automationId);
        newAutomations[index] = {...newAutomations[index],...newAutomationData}

        updateBoard(boardId,{Automations: newAutomations})

        setDialogOpen(false)

        _updateAutomation(automationId, newAutomationData)
        .then(res => {
            console.log(res, 'res _updateAutomation');
        })
        .catch(err => {
            console.log(err, '_updateAutomation');
        });


};
    

function handleOpenChange(){
    onOpenChange && onOpenChange()
}
    useEffect(()=>{
        if(dialogOpen == isOpen) return
        setDialogOpen(isOpen)
    },[isOpen])

    return (
     
        <Dialog open={dialogOpen} onOpenChange={handleOpenChange} > 
            <DialogContent className="w-[90vw] h-[90dvh] flex flex-col">
                <DialogHeader>
                    <DialogTitle><input type="text" name="name" value={automationName} onChange={(e)=>setAutomationName(e.target.value)} /></DialogTitle>
                </DialogHeader>
                <div className="relative dotted-bg flex-1 grid grid-cols-2 !py-0 *:py-6">
                    <div className="scrollbar-none border-stone-300 border-r pl-10 pr-28 max-h-[74dvh] overflow-auto">
                        <div className="h-fit space-y-10 connecting-line-vertical">
                            <div className="bg-white rounded-xl shadow-lg ring-1 ring-gray-200 p-6 flex flex-row items-center">
                                <div>
                                    <p className="font-bold">When</p>
                                    <p className="text-sm text-gray-400">This happens on...</p>
                                </div>
                                <div className="ml-auto">
                                    <SelectScrollable onChange={(e) => console.log(e)} value={'task'} options={[{ text: 'Task', value: 'task' }]} />
                                </div>
                            </div>

                            {triggers.map((trigger,indx) => (<TriggerCard key={trigger.type + indx} boardId={boardId} triggerType={trigger.type} value={trigger.value} onChange={(v)=> handleTriggerUpdate(v,indx)} />))}
                            
                            <Button onClick={handleAddTrigger} variant="outline" size="icon" className="mx-auto flex shadow-lg">
                                <Plus size={16} />
                            </Button>
                        </div>
                    </div>
                    <div className="absolute -translate-x-1/2 left-1/2">
                        <div className="ring-1 ring-stone-300 mt-6 p-4 rounded-md bg-white shadow text-stone-600">
                            <MoveRight />

                        </div>
                    </div>
                    <div className="scrollbar-none pr-10 pl-28 max-h-[80vh] overflow-auto">
                        <div className="h-fit space-y-10 connecting-line-vertical">
                            <div className="bg-white rounded-xl shadow-lg ring-1 ring-gray-200 p-6 flex flex-row items-center">
                                <div>
                                    <p className="font-bold">Then</p>
                                    <p className="text-sm text-gray-400">Do this actions...</p>
                                </div>
                            </div>
                            {actions.map((action,indx) => (<ActionCard boardId={boardId} key={action.type + indx} actionType={action.type} value={action.value} onChange={(v)=>handleActionUpdate(v,indx)} />))}
                            <Button onClick={handleAddActions} variant="outline" size="icon" className="mx-auto flex shadow-lg">
                                <Plus size={16} />
                            </Button>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <button onClick={handleSaveAutomation} className="btn btn-primary" type="button">Save</button>
                </DialogFooter>


            </DialogContent>
        </Dialog>
    );
}

export default SingleAutomation