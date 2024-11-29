"use client"
import { CompleteTaskWithRelations, TaskTemplateAddType } from "@lib/types";
import FormAddTask from "../forms/FormAddTask";
import { useState } from "react";
import { SelectScrollable } from "./select";
import { useAppStateContext } from "@app/context/AppStatusContext";
import { WandSparkles } from "lucide-react";
import { _addTaskTemplate } from "@lib/server_actions/database_crud";

type TypeTasksTemplateEditor = {
    onSubmit?: () => void;
    boardId?: string;
}

const TaksTemplateEditor = ({ onSubmit, boardId }: TypeTasksTemplateEditor) => {
    const [selectedTemplate, setSelectedTemplate] = useState("new")
    const {appState} = useAppStateContext()
    if(!boardId) return
    if(!appState.currentUser.boards) return
    const board = appState.currentUser.boards.find(b => b.id == boardId)
    const templates = board?.taskTemplate

    let templateList  =[
        {
            label: 'New template',
            text: 'New template',
            value: 'new',
        }]
    

    if(templates){
        templateList = [...templateList, ...templates.map(t => (
            {
                label: t.name,
                text: t.name,
                value: t.id,
            }
        ))]
        
    }
    function handleSubmit(data: CompleteTaskWithRelations) {
        
        const newTemplateData:TaskTemplateAddType = {
            name: data.name,
            createdBy: appState.currentUser.id,
            boardIds: [boardId!],
            data: {
                task: data
            }
        }


        if (onSubmit) {
            onSubmit()
        }


        console.log(newTemplateData, 'newTemplateData')
        _addTaskTemplate(newTemplateData)
        .then(res => {
            console.log(res)
        })
        .catch(error => {
            alert('something went wrong')
            console.error(error)
        })
        
    }
    
    let defaultData = {
        name: "New Template",
        description: "",
        statusId: "",
        priority: "",
        dueDate: undefined,
        assigneeId: "",
        taskLink: "",
        clinicId:""
    }

    
    
    return (
        <>
            <div className="bg-gray-200 !pb-1">
                <div className='w-fit'>
                    <SelectScrollable className="bg-white w-fit"
                        icon={<WandSparkles className='mr-2' size={16} strokeWidth={1} />}
                        placeholder='Select Template'
                        options={templateList}
                        onChange={setSelectedTemplate}
                        value={selectedTemplate}
                    />
                </div>
            </div>
            <FormAddTask defaultData={defaultData} templateId={selectedTemplate} className="bg-gray-200 !p-6 *:shadow-lg" buttonOutside={true} boardId={boardId} overrideSubmit={true} onSubmit={handleSubmit} />
        </>

    );
}

export default TaksTemplateEditor;