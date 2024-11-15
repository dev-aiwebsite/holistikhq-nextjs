"use client"
import {useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Trash2, ZapIcon } from "lucide-react";
import { cn } from "@lib/utils";
import { useAppStateContext } from "@app/context/AppStatusContext";
import SingleAutomation from "./AutomationSingle";
import AddAutomation from "./AddAutomation";


type AutomationsProps = {
    className?: string;
    boardId: string;
}
const Automations = ({ className, boardId }: AutomationsProps) => {
    const [toggleValue, setToggleValue] = useState('active')
    const [activeCount, setActiveCount] = useState(0)
    const [inActiveCount, setInActiveCount] = useState(0)
    const { appState } = useAppStateContext()
    const boardAutomations = appState.currentUser.boards.find(board => board.id == boardId).Automations
    const [selectedAutomation,setSelectedAutomation] = useState("")
    const [isAddingAutomation,setIsAddingAutomation] = useState(false)

    
    const openSingleAutomation = (automationId:string) => {
        setSelectedAutomation(automationId)
    }

    const onCloseSingleAutomation = ()=>{
        setSelectedAutomation("")
    }

    const onClosingAddAutomation = ()=>{
        setIsAddingAutomation(false)
    }

    console.log(selectedAutomation, 'selectedAutomation')

    return (
        <div className={cn("w-[70rem] max-w-[95vw] min-h-[70dvh] max-h-[95dvh]", className)} >
            <div className="flex flex-row items-center text-sm border-b border-gray-200 pb-4">
                <ToggleGroup type="single" className="" value={toggleValue} onValueChange={setToggleValue}>
                    <ToggleGroupItem value="active" className="btn-w-icon">
                        <span>Active {activeCount}</span>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="inactive" className="btn-w-icon">
                        <span>Inactive {inActiveCount}</span>
                    </ToggleGroupItem>
                </ToggleGroup>
                <button className="btn btn-w-icon btn-primary ml-auto"
                onClick={()=>setIsAddingAutomation(true)}>
                    <ZapIcon size={16} fill="white" />
                    <span className="font-semibold">Create new</span>
                </button>
            </div>
            <div className="text-sm divide-y divide-solid flex flex-col border-b border-gray-200">
                {boardAutomations && boardAutomations.map((a) => (
                    <div onClick={()=>openSingleAutomation(a.id)} key={a.id} className="group p-2 flex flex-row hover:bg-gray-50 cursor-pointer items-center">
                        <div className="flex flex-col">
                            {/* Use curly braces to dynamically render values */}
                            <span className="text-base">{a.name}</span>
                            <span className="text-gray-400">{new Date(a.createdAt).toLocaleString()}</span>
                        </div>
                        <button
                            type="button"
                            className="btn text-red-400 ml-auto invisible group-hover:visible hover:bg-white hover:shadow p-2"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>


            {selectedAutomation && <SingleAutomation boardId={boardId} automationId={selectedAutomation} onOpenChange={onCloseSingleAutomation}  />}
            {isAddingAutomation && <AddAutomation boardId={boardId} onOpenChange={onClosingAddAutomation}  />}
            
            
        </div>
    );
}



export default Automations;