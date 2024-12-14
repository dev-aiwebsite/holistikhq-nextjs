"use server"
import DashboardLayout from "@app/components/layouts/dashboardLayout";
import SideDrawer from "@app/components/ui/sidedrawer";
import AppStateContextProvider, { AppStateDataType } from "@app/context/AppStatusContext";
import { DrawerProvider } from "@app/context/DrawerContext";
import { auth } from "@lib/auth/auth";
import { _deleteConversation, _getClinics, _getUsers } from "@lib/server_actions/database_crud";
import { TypeCurrentUserComplete, TypeUserWithBoard } from "@lib/types";
import { User } from "@prisma/client";
import prisma from "@lib/db";


export default async function Layout({ children }: { children: React.ReactNode }) {
   
    const session = await auth() 
    const datas:AppStateDataType = {
        users: [] as User[],
        currentUser: {} as TypeCurrentUserComplete,
        clinics: undefined
    }
     
    if(session && "userId" in session){
        const queryWhere = {id: session.userId as string}
        const queryIncludes ={
            boards: {
                where: {
                    // myTodoUserId:null
                },
                include: {
                    BoardStatus: true,
                    Automations: true,
                    taskTemplate:true
                },
            },
            conversations: {
                orderBy: {
                    createdAt: 'desc', // Order conversations by `createdAt` in descending order
                  },
                include: {
                  messages: {
                    take: 5, // Limit to the latest 5 messages
                    orderBy: {
                      createdAt: 'desc', // Order by the `createdAt` field in descending order
                    },
                  },
                  users: true,
                  task:true,
                },
            },
            clinics: {
                include: {
                    users: true,
                  }
            },
            notifications: true,
        }

        try {
            // Create promises for getting the current user and all users
            const currentUserPromise = _getUsers(queryWhere, queryIncludes);
            const allUsersPromise = _getUsers({}, {}); // Adjust this based on your method signature for fetching all users.
            const getClinicPromise = _getClinics()
            // Use Promise.all to run both queries concurrently
            const [res, allUsers, resClinics] = await Promise.all([currentUserPromise, allUsersPromise, getClinicPromise]);
    
            // Handle the user result
            if (res != null) {
                if (Array.isArray(res)) {
                    datas.currentUser = res[0] as unknown as TypeCurrentUserComplete;
                } else {
                    datas.currentUser = res as TypeCurrentUserComplete;
                }
            }
    
            // Handle the all users result
            if (Array.isArray(allUsers)) {
                datas.users = allUsers as User[];
            }

            if(resClinics.clinics){
                datas.clinics = resClinics.clinics
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
      
    // const deletedBoards = await prisma.automations.deleteMany({
    //     where: {
    //       // Example criteria, delete boards with a specific status
    //       status: 'inactive',
    //     },
    //   });

    


    return <>
        <AppStateContextProvider data={datas}>
            <DrawerProvider>
                    <DashboardLayout>
                        {children}
                        <SideDrawer />
                    </DashboardLayout>
            </DrawerProvider>
        </AppStateContextProvider>
    </>
}