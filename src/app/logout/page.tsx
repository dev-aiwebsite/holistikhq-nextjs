"use client"
import { LogoutUser } from "@lib/server_actions/database_crud";
import { useRouter } from "next/navigation";


const page = () => {
    const router = useRouter();
    
    LogoutUser()
    .then(res => {
        console.log(res)
        router.push("/login")
    })
    
    return (
        <div>
            Logging out...
        </div>
    );
}

export default page;