"use client"
import { _addUser, createUserType } from "@lib/server_actions/database_crud";
import { Input } from "@app/components/ui/input";
import { FormEvent, useState } from "react";

// firstName: string;
// lastName: string;
// email: string;
// clinic?: string[];
// password: string;
// isAdmin?: boolean;
// roles?: string[];
// profileImage?: string; 
const FormAddUser = () => {
    const [hasError,setHasError] = useState<boolean | string | undefined>(false)
    const [success,setSuccess] = useState("")
    async function handleSubmit(e:FormEvent) {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        if(!form){

            return
        }

    
            const formData = new FormData(form)
            const data = {} as Record<string,unknown>;
            formData.forEach((value,key) => {
                data[key] = value
            })
        
            const userData = {
                isAdmin: false,
                ...data
            } as createUserType
    

            try {
                const res = await _addUser(userData)
                setHasError(false)
            } catch (error) {
                // console.log(res)
                setHasError(error.message)
            }
         
        
        
    }

    return (
        <form onSubmit={handleSubmit}>
            {hasError && <span className="text-red-400">{hasError}</span>}
            <div>
                <label>
                    <p>First Name</p>
                    <Input name="firstName" type="text" required />
                </label>
            </div>
            <div>
                <label>
                    <p>Last Name</p>
                    <Input name="lastName" type="text" required />
                </label>
            </div>
            <div>
                <label>
                    <p>Email</p>
                    <Input name="email" type="email" required />
                </label>
            </div>
            <div>
                <label>
                    <p>Profile Image</p>
                    <Input name="profileImage" type="text" />
                </label>
            </div>
            <div>
                <label>
                    <p>Password</p>
                    <Input name="password" type="password" required />
                </label>
            </div>
            <div>
                <label>
                    <p>Type password again</p>
                    <Input name="passwordMatch" type="password" required />
                </label>
            </div>
            <button type="submit" className="btn btn-primary">Add User</button>

        </form>
    );
}

export default FormAddUser;