"use client"
import { createId } from '@paralleldrive/cuid2';
import { useForm, Controller } from "react-hook-form";
import { DatePickerWithPresets } from "@app/components/ui/datepicker";
import { SelectScrollable } from "../ui/select";
import RichTextEditor from "../RichTextEditor";
import { useEffect, useRef, useState } from "react";
import { useAppStateContext } from "@app/context/AppStatusContext";
import { _addTask } from "@lib/server_actions/database_crud";
import { CompleteTaskWithRelations, TypeBoardComplete } from "@lib/types";
import TaskNameInput from '../ui/TaskNameInput';
import UserList from '../UserList';
import { priorityOptions } from '@lib/const';
import { Button } from '../ui/button';
import { WandSparkles } from 'lucide-react';
import { cn } from '@lib/utils';
import { SubtaskSection } from './SubtaskSection';
import { Task } from '@prisma/client';



export type TypeAddTaskdefaultData = {
    name?: string;
    description?: string;
    statusId?: string;
    priority?: string;
    dueDate?: Date | undefined;
    assigneeId?: string;
    taskLink?: string;
    clinicId?: string;
}
type TypeFormAddTask = {
    boardId?: string;
    statusId?: string;
    onCancel?: () => void;
    overrideSubmit?: boolean
    onSubmit?: (data: CompleteTaskWithRelations) => void;
    buttonOutside?: boolean;
    className?: string;
    templateId?:string;
    defaultData?: TypeAddTaskdefaultData;
}
const FormAddTask = ({defaultData, templateId, className, buttonOutside, boardId, statusId, onCancel, onSubmit, overrideSubmit = false }: TypeFormAddTask) => {
    const { appState, setappState, addTask } = useAppStateContext();
    const formRef = useRef<HTMLFormElement | null>(null)
    const [selectedTemplate, setSelectedTemplate] = useState(templateId)
    const [board_id, setBoard_id] = useState(boardId)
    const [newSubtaskList, setNewSubtaskList] = useState<Task[] | null>(null)

    const currentUser = appState.currentUser;
    const boards = currentUser?.boards;
    const clinics = appState.clinics
    const board = board_id ? boards.find(b => b.id == board_id) : boards[0] 
    const templates = board?.taskTemplate
    let useDefaultValues = defaultData
    
    useEffect(()=> {
        setSelectedTemplate(templateId)

    },[templateId])

    if(selectedTemplate && selectedTemplate != 'new' ){
        console.log(templateId, 'templateId inside selectedTemplate')
        const templateData = board?.taskTemplate.find(t => t.id == selectedTemplate)?.data
        console.log(templateData, 'templateData')
        if(templateData){
            useDefaultValues = templateData.task
            
        }
    }

    console.log(selectedTemplate, 'selectedTemplate')
    
    const defaultValues = {
        id: "",
        name: useDefaultValues?.name,
        description: useDefaultValues?.description,
        statusId: useDefaultValues?.statusId,
        priority: useDefaultValues?.priority,
        dueDate: useDefaultValues?.dueDate ? new Date(useDefaultValues?.dueDate ) : undefined,
        assigneeId: useDefaultValues?.assigneeId,
        taskLink: useDefaultValues?.taskLink,
        clinicId: useDefaultValues?.clinicId,
        createdBy: appState.currentUser.id,
    };

    console.log(defaultValues, 'defaultValues')
    const form = useForm({
        defaultValues,
    });

    useEffect(() => {
        form.reset(defaultValues); // Dynamically update the form with new values
      }, [useDefaultValues]);

    let boardStatusOptions = [
        { text: 'Set Status', value: '' },
    ]

    if (board && board.BoardStatus) {
        const statuses = board.BoardStatus

        boardStatusOptions = statuses.map(status => {
            return {
                text: status.name,
                value: status.id
            }
        })
    }

    function handleOnSubmit(data: CompleteTaskWithRelations) {
        // Generate the ID in the frontend
        const taskId = createId()
        data.id = taskId
        if (onSubmit) {
            onSubmit(data)
        }
        if (overrideSubmit) return
        console.log(data, 'addtask data')
        console.log(newSubtaskList, 'new subtask list data')

        const subtasks:Task[] | null = newSubtaskList ? newSubtaskList.map(s => {
            return {
                ...s,
                parentId: taskId,
                statusId: boardStatusOptions[0].value,
                clinicId: data.clinicId
            }
        }) : null
        
        if(subtasks){
            data.subtasks = subtasks
        }
        addTask(data)
    }

    const handleOnCancel = () => {
        if (onCancel) {
            onCancel()
        }
    }

    let templateList = templates?.map(t => (
        {
            label: t.name,
            text: t.name,
            value: t.id,
        }
    ))

 

    const clinicList = clinics?.map(c => ({
        label: c.name,
        text: c.name,
        value: c.id,
    }))

    const boardList = boards.map(b => ({
        label: b.name,
        text: b.name,
        value: b.id
    }))



    const ActionButtonSection = <div className="w-full flex flex-row gap-1 px-4">
        <div className="ml-auto grid grid-cols-2 gap-1 ">
            <Button variant="ghost" className="text-sm text-stone-600 hover:text-app-orange-500 bg-gray-100" onClick={handleOnCancel} type="button">Cancel</Button>
            <button className="text-sm btn font-semibold btn-primary" onClick={(e) => formRef?.current?.requestSubmit()} type="submit" disabled={board ? false : true}>Save</button>
        </div>
    </div>

    return (
        <>
            <div className={cn("space-y-4 w-screen-lg !px-0", className)}>
                <div className="*:px-4 bg-white py-4 rounded-lg space-y-4">
                <form ref={formRef} onSubmit={form.handleSubmit(handleOnSubmit)} className="formAddTask text-sm space-y-4">
                    <div className="FormControl border-b border-gray-200 pb-4">
                        <input {...form.register} type="hidden" name="id" />
                        <input {...form.register} type="hidden" name="createdBy" />
                        <div className='flex flex-row flex-nowrap gap-2'>
                            <div>
                                <Controller
                                    name="name"
                                    control={form.control}
                                    render={({ field: { onChange, value } }) => (
                                        <TaskNameInput
                                            required={true}
                                            taskNameChange={(name: string) => {
                                                // Update both name and link together
                                                const link = form.getValues("taskLink") || "";
                                                onChange(name); // Update task name
                                                form.setValue("taskLink", link); // Keep the link
                                            }}
                                            taskNameValue={value} // Pass the current value
                                            linkChange={(link: string) => {
                                                form.setValue("taskLink", link); // Update task link
                                            }}
                                            linkValue={form.getValues("taskLink")} // Get the current link value
                                        />
                                    )}
                                />
                                  
                            </div>

                            {!templateId && <div className='ml-auto w-fit'>
                                <SelectScrollable className="w-fit"
                                    icon={<WandSparkles className='mr-2' size={16} strokeWidth={1} />}
                                    placeholder='Select Template'
                                    options={templateList}
                                    onChange={setSelectedTemplate}
                                    value={selectedTemplate}
                                />
                            </div>}

                        </div>
                    </div>
                    <div className="flex flex-row gap-6 [&_.td]:!min-w-[5rem] [&_.td.label]:!text-gray-500 [&_.td.label]:!font-medium">
                        <div className="table h-fit">
                            {!boardId &&
                                <div className="FormControl tr">
                                    <span className="td label">Board</span>
                                    <div className="td">


                                        <SelectScrollable className="w-64 font-medium text-gray-700"
                                            placeholder="Select board"
                                            options={boardList}
                                            onChange={(v) => setBoard_id(v)}
                                            value={board_id}
                                            defaultValue={boardList[0].value}
                                        />


                                    </div>
                                </div>
                            }
                            {board && <>
                                <div className="FormControl tr">
                                    <span className="td label">Clinic</span>
                                    <div className="td">
                                        {clinicList && <Controller
                                            name="clinicId"
                                            control={form.control}
                                            rules={{ required: "This field is required." }}
                                            render={({ field }) => (
                                                <SelectScrollable className="w-64 font-medium text-gray-700"
                                                    placeholder="Select clinic"
                                                    options={clinicList}
                                                    onChange={field.onChange}
                                                    value={field.value}
                                                />
                                            )}
                                        />}

                                    </div>
                                </div>
                                <div className="FormControl tr">
                                    <span className="td label">Assignee</span>
                                    <div className="td">
                                        <Controller
                                            name="assigneeId"
                                            control={form.control}
                                            render={({ field }) => (
                                                <UserList
                                                    className="w-64 font-medium text-gray-700"
                                                    onChange={(value) => {
                                                        field.onChange(value); // Update the assignee
                                                    }} value={field.value} />
                                            )}
                                        />
                                    </div>
                                </div>

                            </>}
                        </div>
                        <div className="table h-fit">
                            {board && <>
                                <div className="FormControl tr">
                                    <span className="td label">Status</span>
                                    <div className="td">
                                        <Controller
                                            name="statusId"
                                            control={form.control}
                                            render={({ field }) => (
                                                <SelectScrollable className="w-64 font-medium text-gray-700"
                                                    placeholder="Set status"
                                                    options={boardStatusOptions}
                                                    onChange={field.onChange}
                                                    value={field.value}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="FormControl tr">
                                    <span className="td label">Due date</span>
                                    <div className="td">
                                        <Controller
                                            name="dueDate"
                                            control={form.control}
                                            render={({ field }) => (
                                                <DatePickerWithPresets className="w-64 font-medium text-gray-700"
                                                    onSelect={field.onChange}
                                                    value={field.value}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="FormControl tr">
                                    <span className="td label">Priority</span>
                                    <div className="td text-xs">
                                        <Controller
                                            name="priority"
                                            control={form.control}
                                            render={({ field }) => (
                                                <SelectScrollable className="w-64 font-medium text-gray-700"
                                                    placeholder="Set priority"
                                                    options={priorityOptions}
                                                    onChange={field.onChange}
                                                    value={field.value}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </>}
                        </div>
                    </div>

                    {board && <>
                        <div className="FormControl">
                            <span className="label font-medium">Description</span>
                            <Controller
                                name="description"
                                control={form.control}
                                render={({ field }) => (
                                    <RichTextEditor onChange={field.onChange} value={field.value as string | undefined} />
                                )}
                            />
                        </div>
                    </>}
                </form>
                <div>
                {boardId && 
                        <SubtaskSection onNewSubtaskUpdate={setNewSubtaskList} />
                    }
                </div>
                </div>

                {!buttonOutside && ActionButtonSection}
            </div>
            {buttonOutside && ActionButtonSection}
        </>
    );
}

export default FormAddTask;

