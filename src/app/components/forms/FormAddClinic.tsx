"use client"
import { _addUser, createUserType } from "@lib/server_actions/database_crud";
import { Input } from "@app/components/ui/input";
import { FormEvent, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { User } from "prisma/prisma-client";
import { TypeCurrentUserComplete, ClinicAddType } from "@lib/types";
import { useAppStateContext } from "@app/context/AppStatusContext";
import MultipleSelect from "../ui/MultipleSelect";
import { roles } from "@lib/const";
import { SelectScrollable } from "../ui/select";
import { Button } from "../ui/button";
import UserList from "../UserList";
import ProfileAvatar from "../ui/ProfileAvatar";

// firstName: string;
// lastName: string;
// email: string;
// clinic?: string[];
// password: string;
// isAdmin?: boolean;
// roles?: string[];
// profileImage?: string; 

type TypeFormAddClinic = {
    onSuccess?: () => void;
    useDefaultValues?:Partial<ClinicAddType>,
    onCancel?:()=>void;
}
const FormAddClinic = ({onCancel,onSuccess,useDefaultValues}:TypeFormAddClinic) => {
    const {appState, clinics, addClinic} = useAppStateContext()
    const [hasError,setHasError] = useState<boolean | string | undefined>(false)
    const [success,setSuccess] = useState("")

    const defaultValues = {
        id: "",
        name: useDefaultValues?.name || "",
        description: useDefaultValues?.description || "",
        userIds: useDefaultValues?.userIds || [],
        createdBy: appState.currentUser.id,
    };

    console.log(defaultValues, 'defaultValues')
    const form = useForm({
        defaultValues,
    });

    async function handleSubmit(data:ClinicAddType) {
        console.log(data)
        addClinic(data)
    }

    const handleOnCancel = () => {
        if (onCancel) {
            onCancel()
        }
    }

    const usersList = useMemo(()=> {
        return appState.users.map(u => ({
            element: <ProfileAvatar showName name={`${u.firstName} ${u.lastName}`} />,
            text: `${u.firstName[0]} ${u.lastName}`,
            value: u.id
        }))

    },[appState.users])

    return (
        <form className="space-y-4"
        onSubmit={form.handleSubmit(handleSubmit)}>
            {hasError && <span className="text-red-400">{hasError}</span>}
            <div>
                <label className="space-y-1">
                    <p className="text-sm font-medium">Name</p>
                    <Controller
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                        <Input name="name" type="text" required 
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}/>
                    )}
                    />
                </label>
            </div>
            <div>
                <label className="space-y-1">
                    <p className="text-sm font-medium">Description</p>
                    <Controller
                    name="description"
                    control={form.control}
                    render={({ field }) => (
                        <Input name="description" type="text" required 
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}/>
                    )}
                    />
                </label>
            </div>

            
            <div>
                <label className="space-y-1">
                    <p className="text-sm font-medium">Add Members</p>
                    <Controller
                    name="userIds"
                    control={form.control}
                    render={({ field }) => (
                        <MultipleSelect 
                        value={field.value}
                        onChange={(v)=> field.onChange(v)}
                        list={usersList} />
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

export default FormAddClinic;