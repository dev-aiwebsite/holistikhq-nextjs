"use client"
import { createId } from '@paralleldrive/cuid2';
import { useForm, Controller} from "react-hook-form";
import { DatePickerWithPresets } from "@app/components/ui/datepicker";
import { SelectScrollable } from "../ui/select";
import { Input } from "../ui/input";
import RichTextEditor from "../RichTextEditor";
import { Board, Task } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { useAppStateContext } from "@app/context/AppStatusContext";
import { _addTask } from "@lib/server_actions/database_crud";
import { CompleteTaskWithRelations, TypeBoardWithStatus } from "@lib/types";
import { SubtaskSection } from "./FormUpdateTask";
import TaskNameInput from '../ui/TaskNameInput';
import UserList from '../UserList';
import { priorityOptions } from '@lib/const';

const FormAddTask = ({boardId,statusId}:{boardId?:string;statusId?:string}) => {
    const { appState, setappState, addTask } = useAppStateContext();
    const formRef = useRef<HTMLFormElement | null>(null)
    const currentUser = appState.currentUser;
    const boards = currentUser?.boards;
    const boardUse = () => {
        if(!boards) return undefined
        let board = {} as TypeBoardWithStatus | undefined
        if(boardId){
            board = boards.find(b => b.id == boardId)
        } else {
            board = boards[0]
        }
        return board
    }
   
    const [board,setBoard] = useState<TypeBoardWithStatus | undefined>(boardUse)

    const defaultValues = {
        id: "",
        name: "",
        description: "",
        statusId: "",
        priority: "",
        dueDate: undefined,
        assigneeId: "",
        taskLink: "",
        createdBy: appState.currentUser.id,
    };

    const form = useForm({
        defaultValues,
    });
    

    function handleOnSubmit(data:CompleteTaskWithRelations) {
        // Generate the ID in the frontend
        console.log(data, 'addtask data')
        addTask(data)
    }

    let boardStatusOptions = [
        { text: 'Set Status', value: '' },
    ]

    if(board && board.BoardStatus){
        const statuses = board.BoardStatus

        boardStatusOptions = statuses.map(status => {
            return {
                text: status.name,
                value: status.id
            }
        })
    }

    let boardsOptions = [
        { text: 'Select Board', value: '' },
    ]

    return (
        <div className="space-y-4">
            <form ref={formRef} onSubmit={form.handleSubmit(handleOnSubmit)} className="formAddTask text-sm space-y-4">
                <div className="FormControl">
                    <input {...form.register} type="hidden" name="id" />
                    <input {...form.register} type="hidden" name="createdBy" />
                    <div>
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field: { onChange, value } }) => (
                                <TaskNameInput
                                    taskNameChange={(name:string) => {
                                        // Update both name and link together
                                        const link = form.getValues("taskLink") || "";
                                        onChange(name); // Update task name
                                        form.setValue("taskLink", link); // Keep the link
                                    }}
                                    taskNameValue={value} // Pass the current value
                                    linkChange={(link:string) => {
                                        form.setValue("taskLink", link); // Update task link
                                    }}
                                    linkValue={form.getValues("taskLink")} // Get the current link value
                                />
                            )}
                        />
                    </div>
                </div>
                <div className="table">
                    <div className="FormControl tr">
                        <span className="td label">Assignee</span>
                        <div className="td">
                            <Controller
                                name="assigneeId"
                                control={form.control}
                                render={({ field }) => (
                                    <UserList onChange={(value) => {
                                        field.onChange(value); // Update the assignee
                                    }} value={field.value} />
                                )}
                            />
                        </div>
                    </div>

                    <div className="FormControl tr">
                        <span className="td label">Priority</span>
                        <div className="td">
                            <Controller
                                name="priority"
                                control={form.control}
                                render={({ field }) => (
                                    <SelectScrollable className="w-72"
                                        options={priorityOptions}
                                        onChange={field.onChange}
                                        value={field.value}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className="FormControl tr">
                        <span className="td label">Status</span>
                        <div className="td">
                            <Controller
                                name="statusId"
                                control={form.control}
                                render={({ field }) => (
                                    <SelectScrollable className="w-72"
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
                                    <DatePickerWithPresets className="w-72"
                                        onSelect={field.onChange}
                                        value={field.value}
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>

                <div className="FormControl">
                    <span className="label font-semibold">Description</span>
                    <Controller
                        name="description"
                        control={form.control}
                        render={({ field }) => (
                            <RichTextEditor onChange={field.onChange} value={field.value as string | undefined} />
                        )}
                    />
                </div>
                
            </form>
            <div className="w-full flex flex-row">
                <button className="ml-auto text-sm btn btn-primary" onClick={(e) => formRef?.current?.requestSubmit()} type="submit">Save</button>
            </div>
        </div>
    );
}

export default FormAddTask;

