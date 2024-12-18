import { AppStateDataType } from "@app/context/AppStatusContext";
import { Automations, Board, BoardStatus, Task } from "@prisma/client";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, formatDistanceToNow } from "date-fns";
import { AutomationActionType, AutomationType, CompleteTaskWithRelations, TaskAddType, TaskAddTypeComplete, TypeBoardComplete, TypeTask } from "./types";

interface NormalizedData {
  boards: Record<string, Board & { BoardStatus: BoardStatus[] }>;
  statuses: Record<string, BoardStatus & { tasks: string[] }>;
  tasks: Record<string, Task>;
}

export const normalizeData = (data: AppStateDataType): NormalizedData => {
  const boardsMap: Record<string, Board & { BoardStatus: BoardStatus[] }> = {};
  const statusesMap: Record<string, BoardStatus & { tasks: Task[] }> = {};
  const tasksMap: Record<string, Task> = {};

  if (data.currentUser?.boards) {
    data.currentUser.boards.forEach((board) => {
      boardsMap[board.id] = { ...board, BoardStatus: [] };

      board.BoardStatus?.forEach((status) => {
        statusesMap[status.id] = { ...status, tasks: [] };
        boardsMap[board.id].BoardStatus.push(status.id);

        status.tasks?.forEach((task) => {
          tasksMap[task.id] = task;
          statusesMap[status.id].tasks.push(task.id);
        });
      });
    });
  }

  return {
    boards: boardsMap,
    statuses: statusesMap,
    tasks: tasksMap,
  };
};


export function getInitials(name:string) {
    return name
      .split(' ') // Split the name into words
      .map(word => word[0]?.toUpperCase()) // Get the first letter of each word and make it uppercase
      .join(''); // Join the initials together
  }

export const getTimeAgo = (date: Date | string): string => {
  return formatDistanceToNow(new Date(date));
};


export const getShortTimeAgo = (date: Date | string): string => {
  const now = new Date();
  const past = new Date(date);

  const seconds = differenceInSeconds(now, past);
  if (seconds < 60) return `${seconds}s`;

  const minutes = differenceInMinutes(now, past);
  if (minutes < 60) return `${minutes}m`;

  const hours = differenceInHours(now, past);
  if (hours < 24) return `${hours}h`;

  const days = differenceInDays(now, past);
  return `${days}d`;
};

export const stripHtml = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, "text/html");

  // Check for common content types
  if (doc.querySelector("img")) return "Sent a photo";
  if (doc.querySelector("a[href*='.pdf'], a[href*='.doc'], a[href*='.docx']")) return "Sent a document";
  if (doc.querySelector("audio")) return "Sent an audio file";
  if (doc.querySelector("video")) return "Sent a video";

  // Fallback to plain text
  return doc.body.textContent?.trim() || "...";
};



export function calculateNeedleRotation(value:number, min = 0, max = 100, rotateMin = 0, rotateMax = 180) {
  // Ensure the value is within the min and max bounds
  if (value < min) value = min;
  if (value > max) value = max;

  // Calculate the proportion of the value within the range
  let proportion = (value - min) / (max - min);

  // Calculate the rotation angle
  let angle = proportion * (rotateMax - rotateMin) + rotateMin;

  return angle;
}

export const stripHtmlTags = (html: string) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
};

export const automationChecking = (taskData:TaskAddTypeComplete | TypeTask, boardData:TypeBoardComplete) => {
  const boardAutomations = boardData.Automations
  const res = {
    automationChecks: [] as Record<string,any>[],
    isTriggerMatch: false,
    taskData: taskData,
    automationActions: [] as AutomationActionType[]
  }
  if(!boardAutomations) return res
  const updatedTaskData = {...taskData}
  const activeAutomations = boardAutomations.filter(a => a.status == "active")
  const completeStatus = boardData?.BoardStatus?.find(s => s.isComplete || s.name.toLowerCase() == "complete")

  const actions:AutomationActionType[] = []

  activeAutomations.forEach(a => {
    const isTriggerMatch = a.triggers.every(t => {
        let isMatch = () => {
          switch(t.type){
              case "status":
                  return taskData.statusId == t.value
              case "assignee":
                  return taskData.assigneeId == t.value
                  
              case "clinic":
                  return taskData?.clinicId  == t.value
  
              case "task_moved_to_board":
                  return boardData.id == t.value
              
              case "subtasks_completed":
                  return taskData.subtasks?.every(st => st?.isCompleted)
  
              default:
                  return false
                          
          }
        }

        let checkRes = isMatch()
        res.automationChecks.push({trigger: t, isMatch: checkRes})
        return checkRes

    })

    if(isTriggerMatch){
      res.isTriggerMatch = true
        a.actions.forEach(a => {
            switch(a.type){
              case "mark_as_complete":
                updatedTaskData.isCompleted = true
                updatedTaskData.statusId = completeStatus?.id!
                break

                case "assign_to":
                    updatedTaskData.assigneeId = a.value
                    break

                case "change_status":
                    updatedTaskData.statusId = a.value
                    break
                    
                case "change_due_date":
                    updatedTaskData.dueDate = new Date(a.value)
                    break
                    
                case "change_description":
                    updatedTaskData.description = a.value
                    break

                case "move_to_board":
                    actions.push(a)
                    // get the pending status of new board
                    break;

                case "add_subtask":
                    actions.push(a)
                    break;

                case "add_comment":
                    actions.push(a)
                    break;

                case "create_task":
                  actions.push(a)
                    break;

                case "create_message":
                  actions.push(a)
                    break;
            }
        })
    }

  })
  
    res.taskData = updatedTaskData,
    res.automationActions = actions
  

  return res

}