"use client"

import { useAppStateContext } from "@app/context/AppStatusContext";
import { _updateTask } from "@lib/server_actions/database_crud";
import { CompleteTaskWithRelations } from "@lib/types";



export const UPDATETASK = (newTaskData:CompleteTaskWithRelations) => {
    const {setappState} = useAppStateContext()
    const taskId = newTaskData.id;
    _updateTask(taskId, newTaskData)
    .then(res => {
        console.log(res);
    })
    .catch(error => {
        console.log(error);
    });

setappState((prevState) => ({
    ...prevState,
    tasks: prevState?.tasks?.map((task) =>
        task.id === taskId ? { ...task, ...newTaskData } : task
    ),
}));
}