import { ClinicsDataTable } from "@app/components/ClinicsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@app/components/ui/tabs";
import { UsersDataTable } from "@app/components/UsersTable";


const page = () => {
    return (
        <>
            
                <Tabs defaultValue="users">
                    <div className="header-h border-b border-gray-200 flex items-center">
                        
                        <TabsList className="*:capitalize *:text-xl *:font-bold">
                            <TabsTrigger value="users">Users</TabsTrigger>
                            <TabsTrigger value="clinics">Clinics</TabsTrigger>
                        </TabsList>
                        
                    </div>
                   
                    <div className="flex-1 max-h-2-header-h h-full p-0">
                        <div className="p-4">
                        <TabsContent value="users">
                            <UsersDataTable />
                        </TabsContent>

                        <TabsContent value="clinics">
                            <ClinicsDataTable />
                        </TabsContent>

                        </div>
                    </div>
                </Tabs>
                    
        
        </>
    );
}

export default page;