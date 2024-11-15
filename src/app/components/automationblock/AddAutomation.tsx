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
import { ChangeEvent, useState } from "react";
import ActionCard from "./ActionCard";
import { _addAutomation } from "@lib/server_actions/database_crud";
import { AutomationActionType, AutomationTriggerType, AutomationType, TypeBoardWithStatus } from "@lib/types";
import { createId } from "@paralleldrive/cuid2";

type AddAutomationProps = {
    boardId: string;
    onOpenChange?: () => void;
}
const AddAutomation = ({ boardId, onOpenChange }: AddAutomationProps) => {
    const automationId = createId()
    console.log(`open AddAutomation ${automationId}`)
    const { appState, setappState } = useAppStateContext()
    const board = appState.currentUser.boards.find(board => board.id == boardId)

    const [automationData, setAutomationData] = useState<AutomationType>({
        id: automationId,
        name: "",
        board: board as TypeBoardWithStatus,
        boardId,
        triggers: [] as AutomationTriggerType[],
        actions: [] as AutomationActionType[],
        createdBy: appState.currentUser.id,
        createdAt: new Date(),
    });
    
    if(!board) return false
    // Function to add a new trigger
    const handleAddTrigger = () => {
        const newTrigger: AutomationTriggerType = {
            type: "status",
            value: ""
        };
    
        setAutomationData(prevData => ({
            ...prevData,
            triggers: [...(prevData.triggers || []), newTrigger]
        }));
    };
    
    // Function to add a new action
    const handleAddAction = () => {
        const newAction: AutomationActionType = {
            type: "status",
            value: ""
        };
    
        setAutomationData(prevData => ({
            ...prevData,
            actions: [...(prevData.actions || []), newAction]
        }));
    };
    
    const setAutomationName = (e:ChangeEvent<HTMLInputElement>) => {
        setAutomationData(prevData => ({
            ...prevData,
            name: e.target.value
        }));
    };
    
    // Function to update an existing trigger by index
    const handleTriggerUpdate = (updatedTrigger: Partial<AutomationTriggerType>, index: number) => {
        setAutomationData(prevData => {
            const updatedTriggers = [...(prevData.triggers || [])];
            updatedTriggers[index] = {
                ...updatedTriggers[index],
                ...updatedTrigger
            };
    
            return {
                ...prevData,
                triggers: updatedTriggers
            };
        });
    };
    
    // Function to update an existing action by index
    const handleActionUpdate = (updatedAction: Partial<AutomationActionType>, index: number) => {
        setAutomationData(prevData => {
            const updatedActions = [...(prevData.actions || [])];
            updatedActions[index] = {
                ...updatedActions[index],
                ...updatedAction
            };
    
            return {
                ...prevData,
                actions: updatedActions
            };
        });
    };
      

    const handleSaveAutomation = () => {
        console.log('creating automation');
    
        // Find the current automation in the appState to compare before updating
        if (!board) {
            console.log('Board not found.');
            return;
        }
    
        const currentAutomation = board.Automations.find(a => a.id == automationId);
        if (currentAutomation) {
            console.log('Automation is already');
            return;
        }

        if(!(automationData?.triggers && automationData.triggers.length) && !(automationData?.actions && automationData.actions.length)){
            console.log('Automation No trigger and action');
            return
        }
    
        // Update the automation data in the appState only if changes are detected
        setappState(prevAppState => {
            const updatedAppState = { ...prevAppState };
            const boardIndex = updatedAppState.currentUser.boards.findIndex(board => board.id == boardId);
            if (boardIndex === -1) return prevAppState;
            
            // Update triggers and actions in the automation
            const newData = { ...automationData, createdAt: new Date() };
            const automations = updatedAppState.currentUser.boards[boardIndex].Automations;
            
            // Check for duplicates based on unique properties (e.g., `id`)
            const isDuplicate = automations.some(automation => automation.id === newData.id);
            
            if (!isDuplicate) {
                updatedAppState.currentUser.boards[boardIndex].Automations = [...automations, newData];
            }
            
            return updatedAppState;
        });
    
        // Call the API to update the automation with the new data
        const newData = {
            id: automationData.id,
            name: automationData.name,
            boardId,
            triggers: automationData.triggers as AutomationTriggerType[],
            actions: automationData.actions as AutomationActionType[],
            createdBy: appState.currentUser.id
        };
    
        _addAutomation(newData)
        .then(res => {
            console.log(res, 'res _addAutomation');
        })
        .catch(err => {
            console.log(err, '_addAutomation');
        });

};
    
    

    return (
        <Dialog onOpenChange={() => onOpenChange && onOpenChange()} defaultOpen={true} >
            <DialogContent className="w-[90vw] h-[90dvh] flex flex-col">
                <DialogHeader>
                    <DialogTitle><input type="text" name="name" defaultValue={automationData.name} placeholder="Automation name" onChange={setAutomationName}/></DialogTitle>
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

                            {automationData.triggers && automationData.triggers.map((trigger,indx) => (<TriggerCard key={trigger.type + indx} boardId={boardId} triggerType={trigger.type} value={trigger.value} onChange={(v)=> handleTriggerUpdate(v,indx)} />))}
                            
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
                            {automationData.actions && automationData.actions.map((action,indx) => (<ActionCard key={action.type + indx} actionType={action.type} value={action.value} onChange={(v)=>handleActionUpdate(v,indx)} />))}
                            <Button onClick={handleAddAction} variant="outline" size="icon" className="mx-auto flex shadow-lg">
                                <Plus size={16} />
                            </Button>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <button onClick={handleSaveAutomation} className="btn btn-primary">Save</button>
                </DialogFooter>


            </DialogContent>
        </Dialog>
    );
}

export default AddAutomation