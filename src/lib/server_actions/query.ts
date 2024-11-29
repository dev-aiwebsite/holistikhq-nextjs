
const subtasksQueryIncludeAll = {
  status: true,
  assignedTo: true,
} as const;

export const taskIncludeAll = {
    subtasks: subtasksQueryIncludeAll,
    status: true,
    assignedTo: true,
    clinic: true,
  } as const;

export type NotificationAddType = {
  id?: string;
  emailedTo?: string[];
  title: string;
  content: string;
  type: string;
  sentTo: string[];
  appRoute: string;
  dataId: string;
  createdBy: string;
};
