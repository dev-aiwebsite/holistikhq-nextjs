"use server"
import { Conversation } from './../../../node_modules/.prisma/client/index.d';
import { signIn } from "@lib/auth/auth";
import prisma from "@lib/db"
import { AutomationAddType, AutomationType, AutomationUpdateType, BoardAddType, BoardStatusAddType, ClinicAddType, CompleteTaskWithRelations, ConversationAddType, createUserType, MessageAddType, TaskAddTypeComplete, TaskTemplateAddType, TaskTemplateComplete, TypeBoardComplete, TypeBoardWithStatus, TypeClinicComplete } from "@lib/types";
import {Notification, Task, Board, User, BoardStatus, Prisma, Message, Clinic } from "@prisma/client"; // Import the generated Task type
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import bcrypt from 'bcrypt';
import { NotificationAddType, taskIncludeAll } from "./query";
import { defaultStatusesName } from '@lib/const';


const handleError = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message; // Access message if error is an instance of Error
    }
    return 'An unknown error occurred'; // Fallback for unknown errors
}

// Get all users
export const _getUsers = async (where: Prisma.UserWhereInput, include?: Prisma.UserInclude) => {
    // Construct the query object based on the provided parameters
    const user = await prisma.user.findMany({
        where: where,
        include: include
    });
    return user;
};

export const _addUser = async (newUserData: createUserType) => {
    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(newUserData.password, 10);
        if (!newUserData.roles?.length) {
            newUserData.roles = ['basic']
        }
        const newUser = await prisma.user.create({
            data: {
                firstName: newUserData.firstName,
                lastName: newUserData.lastName,
                email: newUserData.email,
                password: hashedPassword,
                isAdmin: newUserData.isAdmin || false,
                roles: newUserData.roles,
                profileImage: newUserData.profileImage,
                isLogin: false, // Initialize isLogin as false
                isDeleted: false, // Initialize isDeleted as false
                clinics: newUserData.clinics
                    ? {
                        connect: newUserData.clinics, // Connect existing clinics by their IDs
                    }
                    : undefined, // If clinics are not provided, don't include this field
            },
        });

        return newUser;

    } catch (error) {
        console.error('Error creating user:', error);

        // Handle unique constraint violation
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
            const field = error?.meta?.target; // This will be an array of fields that caused the error
            if (field == 'email') {
                throw new Error(`Email already exist`);
            }

        }

        throw new Error('Failed to create user');
    }
};

export const AuthenticateUser = async (formData: FormData) => {
    const { useremail, userpass, viaadmin } = Object.fromEntries(formData);
    try {
        const redirectUrl = await signIn('credentials', { useremail, userpass, viaadmin, redirect: false });
        return {
            redirectUrl
        }

    } catch (error) {
        console.log(`${error}`, 'something went wrong')
    }
};



// Get tasks with an optional taskId filter
export const _getTasks = async (query: object = {}) => {
    console.log(taskIncludeAll, 'taskIncludeAll')
    const res = {
        tasks: [] as CompleteTaskWithRelations[],
        success: false,
        message: ''
    };

    try {
        const task = await prisma.task.findMany({
            orderBy: {
                updatedAt: 'desc',
            },
            where: query,
            include: {
                subtasks: {
                    include: {
                        status: true,
                        assignedTo: true,
                    }
                },
                status: true,
                assignedTo: true,
                clinic: true,
            }
        });

        res.tasks = task
        res.success = true;
    } catch (error) {
        res.message = `Failed to fetch tasks: ${handleError(error)}`; // Use handleError to get the error message
    }

    return res;
}

// Add a new task
export const _addTask = async (task: TaskAddTypeComplete) => {
    const res = {
        success: false,
        message: '',
        task: null as Task | null
    };

    try {
        const newTask = await prisma.task.create({
            data: {
                id: task.id,
                name: task.name,
                description: task.description,
                priority: task.priority,
                dueDate: task.dueDate,
                statusId: task.statusId,
                assigneeId: task.assigneeId,
                taskLink: task.taskLink,
                createdBy: task.createdBy,
                subtasks: {
                    create: task.subtasks.map((subtask) => ({
                        id: subtask.id,
                        name: subtask.name,
                        description: subtask.description,
                        dueDate: subtask.dueDate,
                        statusId: subtask.statusId,
                        assigneeId: subtask.assigneeId,
                        createdBy: subtask.createdBy,
                        // Add other subtask fields as required
                    })),
                },
            }
        });
        res.task = newTask
        res.success = true;
        res.message = `Task ${newTask.name} added successfully.`;
    } catch (error) {
        res.message = `Failed to add task: ${handleError(error)} ${task.id}:task`; // Use handleError to get the error message
    }

    return res;
}

export const _updateTask = async (taskId: string, updatedTask: Partial<Task>) => {
    const res = {
        success: false,
        message: '',
        task: null as Task | null
    };

    try {
        const updatedTaskResult = await prisma.task.update({
            where: {
                id: taskId // Find the task by its ID
            },
            data: {
                name: updatedTask.name,
                description: updatedTask.description,
                priority: updatedTask.priority,
                dueDate: updatedTask.dueDate,
                statusId: updatedTask.statusId,
                assigneeId: updatedTask.assigneeId,
                parentId: updatedTask.parentId,
                taskLink: updatedTask.taskLink,
                isCompleted: updatedTask.isCompleted
            }
        });
        res.task = updatedTaskResult
        res.success = true;
        res.message = `Task ${updatedTaskResult.name} updated successfully.`;
    } catch (error) {
        res.message = `Failed to update task: ${handleError(error)}`; // Use handleError to get the error message
    }

    return res;
}


// Add a new board
export const _addBoard = async (data: BoardAddType) => {
    const res = {
        board: null as TypeBoardComplete | null,
        success: false,
        message: ''
    };

    try {

        const newBoardStatuses = defaultStatusesName.map((name, indx) => {
            return {
                name: name,
                position: indx + 1,
                createdBy: data.createdBy,
                isComplete: name == 'Complete'
            }
        })

        const newBoard = await prisma.board.create({
            data: {
                id: data.id,
                name: data.name,
                status: data.status,
                createdBy: data.createdBy,
                color: data.color,
                icon: data.icon,
                userIds: data.userIds,
                users: {
                    connect: data.userIds.map(id => ({ id })),
                },
                BoardStatus: {
                    create: newBoardStatuses, // Create the predefined BoardStatus entries and link to Board
                },
            },
            include: {
                BoardStatus: true, // Include the created BoardStatus records in the response
                Automations: true,
            },
        });

        res.board = newBoard
        res.success = true;
        res.message = `Board ${newBoard.name} created successfully.`;
    } catch (error) {
        res.message = `Failed to create board: ${handleError(error)}`; // Use handleError to get the error message
    }
    console.log('server _addBoard', res)
    return res;
}

// Get all boards
export const _getBoards = async (boardId?: string | string[]) => {
    type resBoardType = (Board & {
        BoardStatus?: (BoardStatus & {
            tasks?: Task[];
        })[];
        users: User[];
    })
    type resType = {
        boards: resBoardType[];
        success: boolean;
        message: string;
    };


    const res: resType = {
        boards: [],
        success: false,
        message: ''
    };


    try {
        if (boardId && !Array.isArray(boardId)) {
            const board = await prisma.board.findUnique({
                where: { id: boardId },
                include: {
                    users: true,
                    BoardStatus: {
                        include: { tasks: true }
                    }
                }
            });
            res.boards = board ? [board] : [];

        } else {
            let where = {}
            if(boardId && Array.isArray(boardId)){
                where = {
                    id: {
                        in: boardId
                    }
                }
            }
            const boards = await prisma.board.findMany({
                where: where,
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    users: true,
                    BoardStatus: {
                        include: { tasks: true }
                    }
                }
            });
            res.boards = boards;
        }

        res.success = true;
    } catch (error) {
        res.message = `Failed to fetch boards: ${handleError(error)}`; // Use handleError to get the error message
    }

    return res;
}

export const _updateBoard = async (boardId: string, updatedBoard: Partial<Board>) => {
    const res = {
        success: false,
        message: ''
    };

    try {
        const updatedBoardResult = await prisma.board.update({
            where: {
                id: boardId // Find the board by its ID
            },
            data: {
                name: updatedBoard.name,
                color: updatedBoard.color,
                icon: updatedBoard.icon
            }
        });
        res.success = true;
        res.message = `Board ${updatedBoardResult.name} updated successfully.`;
    } catch (error) {
        res.message = `Failed to update board: ${handleError(error)}`; // Use handleError to get the error message
    }

    return res;
}

// Add a new BoardStatus
export const _addBoardStatus = async (data: BoardStatusAddType) => {
    const res = {
        success: false,
        message: '',
        boardStatus: null as BoardStatus | null
    };

    try {
        const newBoardStatus = await prisma.boardStatus.create({
            data: {
                id: data.id,
                boardId: data.boardId,
                name: data.name,
                position: data.position,
                createdBy: data.createdBy,
                isComplete: data.isComplete
            }
        });
        res.boardStatus = newBoardStatus;
        res.success = true;
        res.message = `Status ${newBoardStatus.name} added to board successfully.`;
    } catch (error) {
        res.message = `Failed to add status: ${handleError(error)}`; // Use handleError to get the error message
    }

    return res;
}

// board automation 
export const _addAutomation = async (data: AutomationAddType) => {
    const res = {
        success: false,
        message: 'Not found'
    };
    if (!data) return res
    try {
        const newAutomation = await prisma.automations.create({
            data
        })
        res.success = true;
        res.message = `Automation ${newAutomation.name} added successfully.`;
    } catch (error) {
        res.message = `Failed to add automation: ${handleError(error)}`; // Use handleError to get the error message
    }

    return res
}

export const _updateAutomation = async (id: string, data: AutomationUpdateType) => {
    const res = {
        success: false,
        message: 'Not found'
    };
    if (!id) return res

    try {
        const updatedAutomation = await prisma.automations.update({
            where: {
                id
            },
            data
        })
        res.success = true;
        res.message = `Automation ${updatedAutomation.name} updated successfully.`;
    } catch (error) {
        res.message = `Failed to update automation: ${handleError(error)}`; // Use handleError to get the error message
    }
    return res;
}

export const _getConversations = async (id?: string) => {
    const res = {
        success: false,
        message: 'Not found',
        conversations: [] as Conversation[]
    };
    try {
        if (id) {
            const conversation = await prisma.conversation.findUnique({

                where: {
                    id
                }
            })

            if (!conversation) return res
            res.success = true
            res.conversations = [conversation]

        } else {
            const conversations = await prisma.conversation.findMany({
                orderBy: {
                    createdAt: 'desc',
                }
            })
            res.success = true
            res.conversations = conversations
        }

        return res
    } catch (error) {
        res.message = `Failed to get conversations: ${handleError(error)}`; // Use handleError to get the error message
    }
    return res
}

export const _getMessages = async (
    conversationId: string,
    options?: { orderBy?: "asc" | "desc", count?: number }
) => {
    const res = {
        success: false,
        message: 'Not found',
        messages: [] as Message[]
    };

    try {
        const { orderBy = "asc", count } = options || {};

        const messages = await prisma.message.findMany({
            where: {
                conversationId
            },
            orderBy: {
                createdAt: orderBy
            },
            take: count
        });

        res.success = true;
        res.messages = messages;
    } catch (error) {
        res.message = `Failed to get messages: ${handleError(error)}`; // Use handleError to get the error message
    }

    return res;
}

export const _addMessage = async (data: MessageAddType) => {
    console.log(data, 'data _addMessage')
    const res = {
        data: data,
        success: false,
        message: 'Not found',
        messages: null as null | Message
    };
    if (!data) return res
    try {
        const newMessage = await prisma.message.create({
            data
        })
        res.success = true;
        res.message = `Message ${newMessage.content} added successfully.`;
    } catch (error) {
        res.message = `Failed to add message: ${handleError(error)}`; // Use handleError to get the error message
    }

    return res

}


export const _addConversation = async (data: ConversationAddType) => {
    const res = {
        success: false,
        message: "Not found",
        conversation: null as any,
    };

    if (!data) return res;

    try {
        const newConversation = await prisma.conversation.create({
            data: {
                id: data.id || undefined,
                status: data.status || "active",
                type: data.type || "private",
                taskId: data.taskId || null,
                name: data.name || null,
                description: data.description || null,
                icon: data.icon || null,
                createdBy: data.createdBy,
                users: {
                    connect: data.userIds.map((id) => ({ id })), // Associate users with this conversation
                },
            },
            include: {
                users: true, // Include users in the response
            },
        });

        res.success = true;
        res.message = `Conversation ${newConversation.name || "Unnamed"} added successfully.`;
        res.conversation = newConversation;
    } catch (error) {
        res.message = `Failed to add conversation: ${handleError(error)}`; // Use your custom `handleError` function
    }

    return res;
};


export const _deleteConversation = async (id: string) => {
    const res = {
        success: false,
        message: 'Not found'
    };
    if (!id) return res

    try {

        // Delete related messages first
        await prisma.message.deleteMany({
            where: {
                conversationId: id, // Replace with actual conversationId
            },
        });

        // Then delete the conversation
        const deletedConversation = await prisma.conversation.delete({
            where: {
                id: id,
            },
        });

        res.success = true;
        res.message = `Conversation ${deletedConversation.name} deleted successfully.`;
    } catch (error) {
        res.message = `Failed to delete conversation: ${handleError(error)}`; // Use handleError to get the error message
    }
    return res;

}


export const _addCLinic = async (data: ClinicAddType) => {
    const res = {
        success: false,
        message: 'Not found',
        clinic: null as TypeClinicComplete | null
    };
    if (!data) return res
    try {
        const newClinic = await prisma.clinic.create({
            data: {
                ...data,
                users: {
                    connect: data.userIds.map((id) => ({ id })), // Associate users with this conversation
                },
            },
            include: {
                users: true, // Include users in the response
            },
        })

        res.clinic = newClinic
        res.success = true;
        res.message = `Clinic ${newClinic.name} added successfully.`;

    } catch (error) {
        res.message = `Failed to add clinic: ${handleError(error)}`; // Use handleError to get the error message
    }

    return res

}

export const _getClinics = async (options?: any) => {
    const res = {
        success: false,
        message: 'Not found',
        clinics: undefined as TypeClinicComplete[] | undefined
    };

    try {
        const { orderBy = "asc", count } = options || {};
        const clinics = await prisma.clinic.findMany({
            include: {
                users: true, // Include users in the response
            },
            orderBy: {
                name: orderBy
            },
            take: count
        })
        res.success = true;
        res.clinics = clinics
    } catch (error) {
        res.message = `Failed to get clinics: ${handleError(error)}`; // Use handleError to get the error message
    }

    return res
}



export const _getIncompleteTaskCount = async (boardIds: string[]) => {
    type TaskCountResponse = {
        boardId: string;
        incompleteTasksCount: number;
    };

    type ResType = {
        counts: TaskCountResponse[];
        success: boolean;
        message: string;
    };

    const res: ResType = {
        counts: [],
        success: false,
        message: ''
    };

    try {
        // Fetch the count of incomplete tasks for each board ID
        const counts = await Promise.all(
            boardIds.map(async (boardId) => {
                const count = await prisma.task.count({
                    where: {
                        status: {
                            boardId: boardId, // Relating tasks via statuses to the board
                            isComplete: false,
                        },
                        parentId: null,
                        isCompleted: false // Assuming there's an `isCompleted` field
                    }
                });
                return { boardId, incompleteTasksCount: count };
            })
        );

        res.counts = counts;
        res.success = true;
    } catch (error) {
        res.message = `Failed to fetch task counts: ${handleError(error)}`;
    }

    return res;
};

export const _addTaskTemplate = async (data: TaskTemplateAddType) => {
    const res = {
        success: false,
        message: 'Not found',
        template: null as TaskTemplateComplete | null,
    };
    if (!data) return res;

    try {
        const newTemplate = await prisma.taskTemplate.create({
            data: {
                id: data.id,
                name: data.name || "",
                description: data.description || "",
                createdBy: data.createdBy,
                updatedBy: data.updatedBy,
                data: data.data,
                boards: {
                    connect: data.boardIds.map((id) => ({ id })) // Connect the task template to the boards
                },
            },
            include: {
                boards: true, // Optionally, include boards in the response
            },
        });

        res.template = newTemplate;
        res.success = true;
        res.message = `Template ${newTemplate.name} added successfully.`;
    } catch (error) {
        res.message = `Failed to add template: ${handleError(error)}`; // Use handleError to get the error message
    }

    return res;
};


export const _addNotification = async (data: NotificationAddType) => {
    const res = {
        success: false,
        message: 'Not found',
        notification: null as Notification | null,
    };
    if (!data) return res;

    try {
        const newNotification = await prisma.notification.create({
            data: {
                id: data.id,
                title: data.title || "",
                content: data.content || "",
                createdBy: data.createdBy,
                dataId: data.dataId,
                type: data.type,
                appRoute: data.appRoute,
                sentTo: {
                    connect: data.sentTo.map(id => ({ id })),
                },
            },
        });

        res.notification = newNotification;
        res.success = true;
        res.message = `Notification added successfully.`;   
    } catch (error) {
        res.message = `Failed to add notification: ${handleError(error)}`; // Use handleError to get the error message
    }   

    return res;
}