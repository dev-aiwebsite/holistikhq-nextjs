import { AppStateDataType } from "@app/context/AppStatusContext";
import { Board, BoardStatus, Task } from "@prisma/client";

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