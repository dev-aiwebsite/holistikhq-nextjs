import Navbar from "@app/components/ui/navbar";
import Sidebar from "@app/components/ui/sidebar";

type Page = {
    children: React.ReactNode;
}
const DashboardLayout = ({ children }: Page) => {
    return (<>
        <div className="flex flex-row flex-nowrap h-screen w-screen m-0 overflow-none">
            <Sidebar />
            <div className="flex-1 overflow-auto">
                <Navbar />
                <div style={{height: 'calc(100vh - var(--header-h))', maxHeight: 'calc(100vh - var(--header-h))'}} className="main-content-area">
                    {children}
                </div>
            </div>
        </div>
    </>
    );
}

export default DashboardLayout;