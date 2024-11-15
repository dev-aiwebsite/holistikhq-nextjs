"use server"
import { signIn } from "@lib/auth/auth";
import prisma from "@lib/db"
import { AutomationAddType, AutomationType, AutomationUpdateType, CompleteTaskWithRelations, createUserType } from "@lib/types";
import { Task, Board, User, BoardStatus } from "@prisma/client"; // Import the generated Task type
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import bcrypt from 'bcrypt';
import { taskIncludeAll } from "./query";


const handleError = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message; // Access message if error is an instance of Error
    }
    return 'An unknown error occurred'; // Fallback for unknown errors
}

// Get all users
export const _getUsers = async (where:object,include?:object) => {
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
export const _getTasks = async (query:object = {}) => {
    console.log(taskIncludeAll, 'taskIncludeAll')
    const res = {
        tasks: [] as CompleteTaskWithRelations[],
        success: false,
        message: ''
    };

    try {
        const task = await prisma.task.findMany({
            where: query,
            include: taskIncludeAll
        });
        res.tasks = task 

        res.success = true;
    } catch (error) {
        res.message = `Failed to fetch tasks: ${handleError(error)}`; // Use handleError to get the error message
    }

    return res;
}

// Add a new task
export const _addTask = async (task: Task) => {
    const res = {
        success: false,
        message: ''
    };

    try {
        const newTask = await prisma.task.create({
            data: task
        });
        res.success = true;
        res.message = `Task ${newTask.name} added successfully.`;
    } catch (error) {
        res.message = `Failed to add task: ${handleError(error)}`; // Use handleError to get the error message
    }

    return res;
}

export const _updateTask = async (taskId: string, updatedTask: Partial<Task>) => {
    const res = {
        success: false,
        message: ''
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
                taskLink: updatedTask.taskLink
            }
        });
        res.success = true;
        res.message = `Task ${updatedTaskResult.name} updated successfully.`;
    } catch (error) {
        res.message = `Failed to update task: ${handleError(error)}`; // Use handleError to get the error message
    }

    return res;
}


// Add a new board
export const _addBoard = async (name: string, createdBy: string, color: string, icon: string | null) => {
    const res = {
        board: [] as Board[],
        success: false,
        message: ''
    };

    try {
        const newBoard = await prisma.board.create({
            data: {
                name,
                createdBy,
                color,
                icon,
                users: {
                    connect: [{ id: createdBy }]
                }
            }
        });
        res.success = true;
        res.message = `Board ${newBoard.name} created successfully.`;
    } catch (error) {
        res.message = `Failed to create board: ${handleError(error)}`; // Use handleError to get the error message
    }
    console.log('server _addBoard', res)
    return res;
}

// Get all boards
export const _getBoards = async (boardId?: string) => {
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
        if (boardId) {
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
            const boards = await prisma.board.findMany({
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
export const _addBoardStatus = async (boardId: string, name: string, position: number, createdBy: string) => {
    const res = {
        success: false,
        message: ''
    };

    try {
        const newBoardStatus = await prisma.boardStatus.create({
            data: {
                boardId,
                name,
                position,
                createdBy
            }
        });
        res.success = true;
        res.message = `Status ${newBoardStatus.name} added to board successfully.`;
    } catch (error) {
        res.message = `Failed to add status: ${handleError(error)}`; // Use handleError to get the error message
    }

    return res;
}

// board automation 
export const _addAutomation = async (data:AutomationAddType) => {
    const res = {
        success: false,
        message: 'Not found'
    };
    if(!data) return res
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

export const _updateAutomation = async (id: string, data:AutomationUpdateType) => {
    const res = {
        success: false,
        message: 'Not found'
    };
    if(!id) return res
    
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

