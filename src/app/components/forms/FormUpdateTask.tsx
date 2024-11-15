import { useForm, Controller } from "react-hook-form";
import { DatePickerWithPresets } from "@app/components/ui/datepicker";
import { SelectScrollable } from "../ui/select";
import RichTextEditor from "../RichTextEditor";
import { useEffect, useRef, useState } from "react";
import { useAppStateContext } from "@app/context/AppStatusContext";
import { _updateTask } from "@lib/server_actions/database_crud";
import { CompleteTaskWithRelations, TypeBoardWithStatus } from "@lib/types";
import UserList from "../UserList";
import TaskNameInput from "../ui/TaskNameInput";
import { Button } from "../ui/button";
import { CircleCheck, Plus } from "lucide-react";
import { priorityOptions } from "@lib/const";

type TypeFormUpdateTask = {
    taskId: string;
    boardId?: string;
};

const FormUpdateTask = ({ taskId, boardId }: TypeFormUpdateTask) => {
    const { appState, setappState, updateTask } = useAppStateContext();
    console.log(taskId, 'taskId FormUpdateTask')
    if(!appState.tasks) return false
    const task = appState.tasks.find(t => t.id == taskId)
    if(!task) return false

    console.log(task, 'FormUpdateTask task')
    const currentUser = appState.currentUser;
    const boards = currentUser?.boards;
    const formRef = useRef<HTMLFormElement | null>(null)
    const subtasksIds = task.subtasks.map(s => s.id)
    const subtasks = appState.tasks?.filter(task => subtasksIds.includes(task.id))
    
    const boardUse = () => {
        if (!boards) return undefined;
        let board = {} as TypeBoardWithStatus | undefined;
        if (boardId) {
            board = boards.find(b => b.id == boardId);
        } else {
            board = boards[0];
        }
        return board;
    };

    const [board, setBoard] = useState<TypeBoardWithStatus | undefined>(boardUse);

    const defaultValues = task ? {
        id: task.id,
        name: task.name,
        description: task.description,
        statusId: task.statusId,
        priority: task.priority,
        dueDate: task.dueDate as Date | undefined,
        assigneeId: task.assigneeId,
        taskLink: task.taskLink,
    } : {};

    const form = useForm({
        defaultValues,
    });

    function handleOnSubmit(newTaskData: CompleteTaskWithRelations) {
        updateTask(newTaskData)
    }

    let boardStatusOptions = [
        { text: 'Set Status', value: '' },
    ];

    if (board && board.BoardStatus) {
        const statuses = board.BoardStatus;
        boardStatusOptions = statuses.map(status => ({
            text: status.name,
            value: status.id,
        }));
    }

    return (
        <div className="space-y-4">
            <form ref={formRef} onSubmit={form.handleSubmit(handleOnSubmit)} className="formAddTask space-y-4">
                <div className="FormControl">
                    <input {...form.register} type="hidden" name="id" />
                    <div>
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field: { onChange, value } }) => (
                                <TaskNameInput
                                    taskNameChange={(name:string) => {
                                        // Update both name and link together
                                        const link = form.getValues("taskLink");
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
            <div>
                <SubtaskSection subtasks={subtasks} />
            </div>
            <div className="w-full flex flex-row">
                <button className="ml-auto text-sm btn btn-primary" onClick={(e) => formRef?.current?.requestSubmit()} type="submit">Save</button>
            </div>
        </div>
    );
};

export default FormUpdateTask;


export const SubtaskSection = ({subtasks = []}:{subtasks?:CompleteTaskWithRelations[]}) => {

    const [showNewSubtaskForm,setShowNewSubtaskForm] = useState(false)
    const newSubtaskInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (showNewSubtaskForm && newSubtaskInputRef.current) {
            newSubtaskInputRef.current.focus();
        }
    }, [showNewSubtaskForm]);

    return (<>

            <div className="text-sm font-semibold flex flex-row items-center gap-1">
                    <span>Subtasks</span>
                    <Button onClick={() => setShowNewSubtaskForm(!showNewSubtaskForm)} variant="ghost" size="icon" className="w-6 h-6">
                        <Plus size={16} strokeWidth={2} />
                    </Button>
            </div>
           {(showNewSubtaskForm || subtasks.length > 0) && <div className="w-full text-sm divide-y divide-solid flex flex-col border-y border-gray-200">
                {showNewSubtaskForm && <>
                    <form action="">
                        <div className="group focus-within:bg-app-brown-200 hover:bg-app-brown-200 w-full flex flex-row flex-nowrap items-center gap-2 p-2">
                            <CircleCheck size="18" strokeWidth="2" className="hover:cursor-pointer text-gray-400 hover:text-green-600"/>
                            <input ref={newSubtaskInputRef} 
                            className="w-72 p-1 bg-transparent focus:bg-white ring-0 border-none outline-none"
                            type="text" placeholder="Task name" name="name"/>
                            <div className="ml-auto flex flex-row flex-nowrap gap-2 items-center">
                                <UserList variant="icon" value={null}/>
                                <DatePickerWithPresets variant="icon" className=""/>
                            </div>
                        </div>
                    </form>
                </>}
                {subtasks.length > 0 && subtasks.map((subtask) => (

                    <form action="">
                        <div className="group focus-within:bg-app-brown-200 hover:bg-app-brown-200 w-full flex flex-row flex-nowrap items-center gap-2 p-2">
                            { subtask.status.name == 'complete' ?
                                <CircleCheck size="18" strokeWidth="2" className="hover:cursor-pointer text-green-600 hover:text-green-500"/>
                                : <CircleCheck size="18" strokeWidth="2" className="hover:cursor-pointer text-gray-400 hover:text-green-600"/>
                                }
                            <input
                            className="text-gray-600 text-sm w-72 p-1 bg-transparent focus:bg-white ring-0 border-none outline-none"
                            type="text" placeholder="Task name" name="name" defaultValue={subtask.name}/>
                            <div className="ml-auto flex flex-row flex-nowrap gap-2 items-center">
                                <UserList variant="icon" value={subtask.assigneeId}/>
                                <DatePickerWithPresets variant="icon" className="" value={subtask.dueDate || undefined}/>
                            </div>
                        </div>
                    </form>
                )
            )}
            </div>}
    </>)
}