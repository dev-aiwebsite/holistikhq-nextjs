import { useForm, Controller } from "react-hook-form";
import { DatePickerWithPresets } from "@app/components/ui/datepicker";
import { SelectScrollable } from "../ui/select";
import RichTextEditor from "../RichTextEditor";
import { useRef} from "react";
import { useAppStateContext } from "@app/context/AppStatusContext";
import { _updateTask } from "@lib/server_actions/database_crud";
import { TaskAddType, TaskAddTypeComplete } from "@lib/types";
import UserList from "../UserList";
import TaskNameInput from "../ui/TaskNameInput";
import { priorityOptions } from "@lib/const";
import { SubtaskSection } from "./SubtaskSection";

type TypeFormUpdateTask = {
    taskId?: string;
    boardId?: string;
    onSubmit?:(task:TaskAddTypeComplete)=>void;
};

const FormUpdateTask = ({taskId, onSubmit }: TypeFormUpdateTask) => {
    const { tasks, updateTask, boards, appState } = useAppStateContext();
    console.log(taskId, 'task FormUpdateTask')
    if(!tasks || !taskId) return
    const task = tasks.find(t => t.id == taskId)
    if(!task) return
    console.log(task, 'FormUpdateTask task')
    const formRef = useRef<HTMLFormElement | null>(null)
    const subtasks = task.subtasks
    
    
    const boardId = task.status.boardId
    const board = appState.currentUser.boards.find(b => b.id == boardId);
    const statuses = board?.BoardStatus
    const completeStatus = statuses?.find(s => s.isComplete)
    let boardStatusOptions = [
        { text: 'Set Status', value: null },
    ];

    if (statuses) {
        boardStatusOptions = statuses.map(status => ({
            text: status.name,
            value: status.id,
        }));
    }

    console.log(boardId, 'boardId')
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

    const { isDirty } = form.formState;

    function handleOnSubmit(formData: Partial<TaskAddType>) {

        const newTaskData:TaskAddTypeComplete = {
            ...task!,
            ...formData,
            subtasks: [],
        }

        if(completeStatus){
            if(completeStatus.id == newTaskData.statusId){
                newTaskData.isCompleted = true
            }
        }


        updateTask(newTaskData)
        
        if(onSubmit){
            const newTaskDataForState = {...task,...newTaskData}
            onSubmit(newTaskDataForState)
        }
    }

 

    console.log(defaultValues, 'defaultValues')
    console.log(boardStatusOptions, 'boardStatusOptions')
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
                                    linkValue={form.getValues("taskLink") || undefined} // Get the current link value
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
                                    <UserList
                                    onChange={(value) => {
                                        field.onChange(value); // Update the assignee
                                    }}
                                    value={field.value || undefined}
                                    />
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
                {boardId && subtasks &&
                    <SubtaskSection taskId={taskId} />
                }
            </div>
            <div className="w-full flex flex-row">
                <button className="ml-auto text-sm btn btn-primary" onClick={(e) => formRef?.current?.requestSubmit()} disabled={!isDirty} type="submit">Save</button>
            </div>
        </div>
    );
};

export default FormUpdateTask;
