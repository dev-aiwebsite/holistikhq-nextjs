"use client"

import { useAppStateContext } from "@app/context/AppStatusContext";
import { TypeTask } from "@lib/types";

type TypeMarkAsCompleteBtn = {
    task: TypeTask;
    taskId?: never;
} | {
    task?: never;
    taskId: string;
}
const MarkAsCompleteBtn = ({taskId,task}:TypeMarkAsCompleteBtn) => {
    const {appState, updateTask, tasks} = useAppStateContext()
    if(!taskId && !task) return

    function handleUpdateTask(){
        console.log('marking as complete')
        if(!task){
            task = tasks?.find(t => t.id === taskId)
        }
        if(!task) return
        const boardId = task.status.boardId
        const boardData = appState.currentUser.boards.find(b => b.id === boardId)
        const completeStatus = boardData?.BoardStatus?.find(bs => bs.isComplete)
        console.log(boardId)
        console.log(boardData)
        console.log(task,'task')


        if(!completeStatus){
            alert("updating failed")
            return
        }
        const updatedTask = {...task}
        updatedTask.isCompleted = true
        updatedTask.statusId = completeStatus.id
        updateTask(updatedTask)
    }


    return <>
        <button onClick={handleUpdateTask} type="button" className="btn small btn-outlined text-grey-500">Mark as Complete</button>
    </>;
}

export default MarkAsCompleteBtn;