"use server"
import FormAddTask from "@app/components/forms/FormAddTask";
import DashboardLayout from "@app/components/layouts/dashboardLayout";
import { AppDialog } from "@app/components/ui/dialog";
import SideDrawer from "@app/components/ui/sidedrawer";
import AppStateContextProvider, { AppStateDataType } from "@app/context/AppStatusContext";
import { DrawerProvider } from "@app/context/DrawerContext";
import { auth } from "@lib/auth/auth";
import { _getUsers } from "@lib/server_actions/database_crud";
import { TypeBoardWithStatus } from "@lib/types";
import { User } from "@prisma/client";
import { Dialog } from "@radix-ui/react-dialog";
import SocketClient from "src/components/SocketClient";


type TypeUserWithBoard = User & {
        boards: TypeBoardWithStatus[];
    };

export default async function Layout({ children }: { children: React.ReactNode }) {
   
    const session = await auth() 
    const datas:AppStateDataType = {
        users: [] as User[],
        currentUser: {} as TypeUserWithBoard
    } 
    if(session && "userId" in session){
        const queryWhere = {id: session.userId as string}
        const queryIncludes ={
            boards: {
                include: {
                    BoardStatus: true,
                    Automations: true
                },
            }
        }

        try {
            // Create promises for getting the current user and all users
            const userPromise = _getUsers(queryWhere, queryIncludes);
            const allUsersPromise = _getUsers({}, {}); // Adjust this based on your method signature for fetching all users.
    
            // Use Promise.all to run both queries concurrently
            const [res, allUsers] = await Promise.all([userPromise, allUsersPromise]);
    
            // Handle the user result
            if (res != null) {
                if (Array.isArray(res)) {
                    datas.currentUser = res[0] as TypeUserWithBoard;
                } else {
                    datas.currentUser = res as TypeUserWithBoard;
                }
            }
    
            // Handle the all users result
            if (Array.isArray(allUsers)) {
                datas.users = allUsers as User[];
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
      
    return <>
        <AppStateContextProvider data={datas}>
            <DrawerProvider>
                <Dialog>
                    <DashboardLayout>
                        {children}
                        <SideDrawer />
                    </DashboardLayout>
                    <AppDialog headerContent={<span className="text-gray-500">New Task</span>}>
                        <FormAddTask />
                    </AppDialog>
                </Dialog>
            </DrawerProvider>
        </AppStateContextProvider>
    </>
}