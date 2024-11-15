import {Prisma, Board, BoardStatus } from "@prisma/client";
import { Session, User } from "next-auth"
import { taskIncludeAll } from "./server_actions/query";

export interface ExtendedUser extends User {
    // Add additional properties here
    firstName: string;
    lastName: string;
    profileImage: string;
    role?: string[];
    id: string;
  }
  export interface ExtendedSession extends Session {
    firstName: string;
    lastName: string;
    profileImage: string;
    role?: string[];
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

  export type TypeBoardWithStatus = Board & {
    BoardStatus: BoardStatus[];
    Automations: AutomationType[];
  }


  
  // Define the complete type for task including relations
  export type CompleteTaskWithRelations = Prisma.TaskGetPayload<{
    include: typeof taskIncludeAll;
  }>;

  export type AutomationTriggerType = {
    type: string;
    value: string;
  };
  
  export type AutomationActionType = {
    type: string;
    value: string;
  };
  
  export type AutomationType = {
    id: string;
    name: string;
    board: Board;
    boardId: string;
    triggers?: AutomationTriggerType[]; // Optional array of triggers
    actions?: AutomationActionType[];   // Optional array of actions
    createdBy: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt?: Date;
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