"use client"
import { Input } from "@app/components/ui/input";
import { AuthenticateUser } from "@lib/server_actions/database_crud";

import { cn } from "@lib/utils";
import { UsersRound, KeyRound, LoaderCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const Login =() => {
    const [error,setError] = useState("")
    const [success,setSuccess] = useState("")
    const [isLoading,setIsLoading] = useState(false)
    const router = useRouter();
 
    async function handleSubmit(e:FormEvent){
        e.preventDefault()
        setIsLoading(true)
        const form = e.target as HTMLFormElement
        if(!form) return
        const formData = new FormData(form)
        try {
            const res = await AuthenticateUser(formData)
            console.log(res)
            
            setSuccess('Authentication successfull!')
            router.push(res?.redirectUrl)
        } catch (error) {
       
            setError(error?.message || 'Something went wrong')
        }

        setIsLoading(false)
        
    }

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-zinc-100">
            <div className="flex flex-row w-full max-w-[800px] rounded-3xl shadow-xl h-[70vh] mx-auto overflow-hidden bg-white">
                <div className="bg-app-orange-500 w-72 flex flex-col justify-center gap-5 p-8">
                    <Image
                        width={200}
                        height={100}
                        alt="holistikHq"
                        src="/images/appholistikhq-white.png"
                    />
                    <p className="text-sm text-white">Built by Osteopaths FOR Osteopaths</p>
                </div>
                <div className="p-5 md:p-20 flex-1 flex flex-col flex-nowrap justify-center">
                    <h1 className="mb-5 text-3xl text-center mx-auto">Members Login</h1>
                    {error && <p className="text-xs text-red-400">{error}</p>}
                    <form className="space-y-1" onSubmit={handleSubmit}>
                        <div className="text-lg space-y-2">
                            <label className="relative flex flex-row flex-nowrap gap-1 justify-center">
                            <UsersRound size={20} strokeWidth={1} className="text-gray-600 absolute left-2 top-1/2 -translate-y-1/2"/>
                            <Input className={cn("text-base pl-10")} type="text" name="useremail" placeholder="useremail" required/>
                            </label>
                            <label className="relative flex flex-row flex-nowrap gap-1 justify-center">
                            <KeyRound size={20} strokeWidth={1} className="text-gray-600 absolute left-2 top-1/2 -translate-y-1/2"/>
                            <Input className={cn("text-base pl-10 w-full")} type="password" name="userpass" placeholder="Password" required/>
                            </label>
                        </div>
                        
                        <Link
                        className="mt-1 text-sm text-gray-500 hover:text-app-orange-500"
                        href="/password-reset"
                        >Forgot password?</Link>
                        <button className={cn("!mt-6 w-full btn btn-primary", isLoading && 'pointer-events-none disabled opacity-50', success && 'bg-green-400 text-white')} type="submit">
                            {isLoading ? (<LoaderCircle size={20} color="#454545" strokeWidth={1} />) : success ? success : ("Login")}
                            </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;