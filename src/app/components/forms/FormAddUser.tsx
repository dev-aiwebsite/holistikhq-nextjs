"use client"
import { _addUser, createUserType } from "@lib/server_actions/database_crud";
import { Input } from "@app/components/ui/input";
import { FormEvent, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { User } from "prisma/prisma-client";
import { TypeCurrentUserComplete, UserAddType } from "@lib/types";
import { useAppStateContext } from "@app/context/AppStatusContext";
import MultipleSelect from "../ui/MultipleSelect";
import { roles } from "@lib/const";
import { SelectScrollable } from "../ui/select";
import { Button } from "../ui/button";

// firstName: string;
// lastName: string;
// email: string;
// clinic?: string[];
// password: string;
// isAdmin?: boolean;
// roles?: string[];
// profileImage?: string; 

type TypeFormAddUser = {
    onSuccess?: () => void;
    useDefaultValues?:Partial<UserAddType>,
    onCancel?:()=>void;
}
const FormAddUser = ({onCancel,onSuccess,useDefaultValues}:TypeFormAddUser) => {
    const {appState, clinics, addUser} = useAppStateContext()
    const [hasError,setHasError] = useState<boolean | string | undefined>(false)
    const [success,setSuccess] = useState("")

    const defaultValues = {
        id: "",
        firstName: useDefaultValues?.firstName || "",
        lastName: useDefaultValues?.lastName || "",
        email: useDefaultValues?.email || "",
        password: useDefaultValues?.password || "",
        role: useDefaultValues?.roles || "",
        clinics: useDefaultValues?.clinics || "",
        createdBy: appState.currentUser.id,
    };

    console.log(defaultValues, 'defaultValues')
    const form = useForm({
        defaultValues,
    });

    async function handleSubmit(data:UserAddType) {
        console.log(data)
        addUser(data)
    }

    const roleList = roles.map(i => ({
        text:i,
        value:i
    }))

    const clinicList = clinics.map(i => ({
        text:i.name,
        value:i.id
    }))
    const handleOnCancel = () => {
        if (onCancel) {
            onCancel()
        }
    }

    return (
        <form className="space-y-4"
        onSubmit={form.handleSubmit(handleSubmit)}>
            {hasError && <span className="text-red-400">{hasError}</span>}
            <div className="grid grid-cols-2 gap-5">
                <label className="space-y-1">
                    <p className="text-sm font-medium">First Name</p>
                    <Controller
                    name="firstName"
                    control={form.control}
                    render={({ field }) => (
                        <Input name="firstName" type="text" required 
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}/>
                    )}
                    />
                </label>
                <label className="space-y-1">
                    <p className="text-sm font-medium">Last Name</p>
                    <Controller
                    name="lastName"
                    control={form.control}
                    render={({ field }) => (
                        <Input name="lastName" type="text" required 
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}/>
                    )}
                    />
                </label>
            </div>

            
            <div>
                <label className="space-y-1">
                    <p className="text-sm font-medium">Email</p>
                    <Controller
                    name="email"
                    control={form.control}
                    render={({ field }) => (

                    <Input
                     name="email" type="email" required 
                     value={field.value}
                     onChange={(e) => field.onChange(e.target.value)}/>
                    )}
                    />
                </label>
                
            </div>
            <div className="grid grid-cols-2 gap-4">
                
                <label className="space-y-1">
                    <p className="text-sm font-medium">Clinic</p>
                    <Controller
                    name="clinics"
                    control={form.control}
                    render={({ field }) => (
                        <SelectScrollable options={clinicList}
                        placeholder="Select clinic"
                        onChange={field.onChange}
                        value={field.value}
                        />
                    )}
                    />
                    
                </label>
                <label className="space-y-1">
                    <p className="text-sm font-medium">Role</p>
                    <Controller
                    name="role"
                    control={form.control}
                    render={({ field }) => (
                        <SelectScrollable options={roleList}
                        placeholder="Select role"
                        onChange={field.onChange}
                        value={field.value}
                        />
                    )}
                    />
                    
                </label>
                
            </div>
            <div>
                <label className="space-y-1">
                    <p className="text-sm font-medium">Password</p>
                    <Controller
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                       
                        <Input name="password" type="password" required 
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}/>
                    
                    )}
                    />
                </label>
            </div>
            {/* <div>
                <label className="space-y-1">
                    <p className="text-sm font-medium">Profile Image</p>
                    <Input name="profileImage" type="file" />
                </label>
            </div> */}


            <div className="w-full flex flex-row gap-1 px-4 !mt-8">
                <div className="ml-auto grid grid-cols-2 gap-1 ">
                    <Button variant="ghost" className="text-sm text-stone-600 hover:text-app-orange-500 bg-gray-100" onClick={handleOnCancel} type="button">Cancel</Button>
                    <button type="submit" className="text-sm btn font-semibold btn-primary">Add User</button>
                </div>
            </div>
            

        </form>
    );
}

export default FormAddUser;