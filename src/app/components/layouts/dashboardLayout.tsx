import Navbar from "@app/components/ui/navbar";
import Sidebar from "@app/components/ui/sidebar";

type Page = {
    children: React.ReactNode;
}

// style={{height: 'calc(100vh - var(--header-h))', maxHeight: 'calc(100vh - var(--header-h))'}} 
const DashboardLayout = ({ children }: Page) => {
    return (<>
        <div className="flex flex-row flex-nowrap h-screen w-screen m-0 overflow-none">
            <Sidebar />
            <div className="flex flex-col flex-nowrap flex-1 overflow-auto">
                <Navbar />
                <div className="main-content-area flex-1 flex flex-col flex-nowrap">
                    {children}
                </div>
            </div>
        </div>
    </>
    );
}

export default DashboardLayout;