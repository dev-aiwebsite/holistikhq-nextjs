import { DefaultJWT } from './../../node_modules/@auth/core/jwt.d';
import {Prisma, Board, BoardStatus, Conversation, Message, Task, Automations, Clinic, User, Notification, TaskTemplate } from "@prisma/client";
import { Session } from "next-auth"
import { taskIncludeAll } from "./server_actions/query";

export interface ExtendedUser extends User {
    // Add additional properties here
    firstName: string;
    lastName: string;
    profileImage: string;
    roles: string[];
    id: string;
  }

  export interface ExtendedSession extends Session {
    firstName: string;
    lastName: string;
    profileImage: string;
    roles?: string[];
    userId: string;
    email: string;
  }

  
  export type createUserType = {
    firstName: string;
    lastName: string;
    email: string;
    clinics?: { id: string }[];
    password: string;
    isAdmin?: boolean;
    roles?: string[];
    profileImage?: string;
  }

  export type TypeUserWithBoard = User & {
    boards: TypeBoardComplete[];
};

  export type TypeBoardComplete = Board & {
    BoardStatus?: BoardStatus[];
    Automations?: AutomationType[];
    taskTemplate?: TaskTemplate[];
  }

  export type TypeBoardWithStatus = Board & {
    BoardStatus: BoardStatus[];
  }
  
  // Define the complete type for task including relations
  // export type CompleteTaskWithRelations = Prisma.TaskGetPayload<{
  //   include: typeof taskIncludeAll;
  // }>;

  export type CompleteTaskWithRelations = (Task & {
    subtasks: (Task & {
      status: BoardStatus;
      assignedTo?: User;
    })[];
    status: BoardStatus;
    assignedTo: User;
    clinic: (Clinic & {
      users: User[]
    });
  });
  



  export type AutomationTriggerType = {
    type: string;
    value: string;
  };
  
  export type AutomationActionType = {
    type: string;
    value: string;
  };
  
  export type AutomationType = Omit<Automations, 'triggers' | 'actions'> & {
    triggers: AutomationTriggerType[]; // New type for triggers
    actions: AutomationActionType[];   // New type for actions
  };

  export type AutomationAddType = {
    id?: string;
    name: string;
    boardId: string;
    triggers: AutomationTriggerType[]; // Optional array of triggers
    actions: AutomationActionType[];   // Optional array of actions
    createdBy: string;
  };

  export type AutomationUpdateType = {
    name?: string;
    boardId?: string;
    triggers?: AutomationTriggerType[]; // Optional array of triggers
    actions?: AutomationActionType[];   // Optional array of actions
    updatedBy: string;
  };

  export type MessageAddType = {
    id?: string;
    conversationId: string;
    content: string;
    createdBy: string;
    parentMessageId?: string;
    type?: string;
    users?: string[];
    taskId?:string;
  }

  export type ConvoInfoType = {
    taskId: string;
    fullName: string;
    profileImage: string | undefined
}

export type ConversationAddType = {
  id?:string;
  status?: string;
  type?: string;
  taskId?: string;
  name?: string;
  description?: string;
  icon?: string;
  userIds: string[];
  createdBy: string;
};

export type ConversationCompleteType = Conversation & {
  messages: Message[];
  users: User[];
  task?: Task; // Messages array with the latest 5 messages
};

export type BoardAddType = {
  id?:string;
  name: string;
  description?: string;
  status?: string;
  color: string;
  icon: string | null;
  createdBy: string;
  userIds: string[];
  myTodoUserId?: string;
}

export type BoardStatusAddType = {
  id?:string;
  boardId: string;
  name: string;
  position: number;
  createdBy: string;
  isComplete: boolean;
}


type clinicMeta = Record<string, any>
export type ClinicAddType = {
  id?:string;
  name: string;
  description?: string;
  icon?: string;
  meta?: clinicMeta;
  userIds: string[];
  createdBy: string;
}
export type TypeClinicComplete = Clinic & {
  users: User[]
}

export type TypeCurrentUserComplete = User & {
  boards: TypeBoardComplete[];
  conversations: ConversationCompleteType[];
  clinics: (Clinic & { users: User[] })[];
  notifications: Notification[];
}

export type TypeTaskWithoutId = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;

// Define the structure of a Subtask, which is similar to a Task but without `id`
export type TypeSubtasksWithoutId = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'parentId' | 'parent'>;

export type TypeTaskTemplateData = {
 task: TypeTaskWithoutId,
 subtasks?: TypeSubtasksWithoutId[]
}

export type TaskTemplateAddType = {
  id?: string;
  name?: string;
  description?: string;
  data?: TypeTaskTemplateData;
  createdBy: string;
  updatedBy?: string;
  boardIds: string[];
  taskId?: string;
  taskTemplateId?: string;
  
}

export type TaskTemplateComplete = TaskTemplate

export type TaskAddType = Partial<Task>
// export type TaskAddType = {
//   id?: string;
//   name: string;
//   taskLink?: string;
//   description?: string;
//   statusId: string;
//   isCompleted?: boolean;
//   assigneeId?: string;
//   clinicId?: string;
//   priority?: string;
//   dueDate?: Date;
//   createdBy: string;
//   updatedBy?: string;
// }

export type SubTaskAddType = {
  id?: string;
  name: string;
  description?: string;
  statusId: string;
  priority?: string;
  clinicId?: string;
  dueDate?: Date;
  isCompleted?: boolean;
  createdBy: string;
  updatedBy?: string;
  parentId:string;
  assigneeId?:string;
}

export type TaskAddTypeComplete = TaskAddType & {
  subtasks: SubTaskAddType[]
}
export type TypeClinicWithUsers = Clinic & {users: User[]}
export type TypeTaskWithSubtasks = Task & {subtasks: Task[]}
export type TypeTask = Task & {
  subtasks: (Task & {
    status: BoardStatus;
    assignedTo: true;
  })[],
  status: BoardStatus;
  assignedTo: true;
}

export type UserAddType = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImage?: string;
  roles: string;
  clinics: string;
}