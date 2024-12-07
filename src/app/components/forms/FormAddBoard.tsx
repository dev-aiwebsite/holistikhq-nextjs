"use client";

import { Controller, useForm } from "react-hook-form";
import { _addBoard } from "@lib/server_actions/database_crud"; // Adjust the import path
import { Board } from "@prisma/client"
import { BoardAddType } from "@lib/types";
import { useAppStateContext } from "@app/context/AppStatusContext";
import { useRef } from "react";
import MultipleSelect from "../ui/MultipleSelect";
import ProfileAvatar from "../ui/ProfileAvatar";
import { ADD_BOARD } from "@lib/server_actions/appCrud";
import ColorPicker from "../ui/ColorPIcker";
import { Input } from "../ui/input";

const AddBoardForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const defaultValues = {
    name: "",
    description: "",
    color: "",
    icon: "",
    userIds: []
  }
  const { control, register, handleSubmit, setError } = useForm<BoardAddType>({ defaultValues });
  const { appState, clinics, addBoard } = useAppStateContext()
  const formRef = useRef<HTMLFormElement | null>(null)

  const handleOnSubmit = async (data: BoardAddType) => {
    const currentUser = appState.currentUser
    const currentUserId = currentUser.id
    const currentUserClinics = currentUser.clinics ? currentUser.clinics.map(clinic => clinic.id) : []

    let clinicUsers: string[] = []
    if (currentUserClinics.length && clinics) {
      let filteredClinics = clinics.filter(i => currentUserClinics.includes(i.id))

      if (filteredClinics) {
        clinicUsers = filteredClinics.flatMap(clinics => clinics.users.map(user => user.id))
      }
    }

    console.log(clinicUsers, 'clinicUsers')

    if (!clinicUsers.length) {
      console.error('no users selected')
      alert('Something went wrong')
      return
    }

    const handleOnSuccess = () => {
      if (onSuccess) {
        onSuccess()
      }
    }
    const newBoard: BoardAddType = {
      ...data,
      createdBy: currentUserId,
      // userIds: [...data.userIds, currentUserId] set via select users
      userIds: clinicUsers
    }

    console.log('submitting', newBoard);
    try {
      const res = await addBoard(newBoard, handleOnSuccess)
      console.log(res)

    } catch (error) {
      console.error("Error during submission:", error); // More detailed error logging
      setError("root", { message: "An unexpected error occurred." });
    }
  };



  const userList = appState.users.filter(user => user.id != appState.currentUser.id).map(user => {

    let data = {
      element: <ProfileAvatar
        src={user?.profileImage || undefined}
        className="w-7 h-7"
        fallbackClassName="!bg-app-orange-500"
        name={`${user.firstName} ${user.lastName}`}
        showName={true}
      />,
      value: user.id,
      text: `${user.firstName} ${user.lastName}`
    }

    return data

  })

  return (
    <form ref={formRef} onSubmit={handleSubmit(handleOnSubmit)} className="text-sm text-stone-600 flex flex-col space-y-4">

      <div>
        {/* <label htmlFor="name">Board Name</label> */}

        <Input {...register("name", { required: true })} className="rounded-lg" placeholder="Board name" />
      </div>
      <div>
        {/* <label htmlFor="name">Board Name</label> */}

        <Input {...register("description", { required: true })} className="rounded-lg" placeholder="About this board" />
      </div>
      <div>
        <label htmlFor="color" className="font-semibold">Board Color</label>

        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <ColorPicker
              value={field.value}
              onChange={(value) => {
                field.onChange(value); // Update the assignee
              }} />
          )}
        />
      </div>
      {/* <div>
          <Controller
              name="userIds"
              control={control}
              render={({ field }) => (
                <MultipleSelect
                onChange={(value) => {
                  field.onChange(value); // Update the assignee
              }}
                list={userList}
                value={field.value}
                />
              )}
          />
      </div> */}

      {/* <div>
        <label htmlFor="icon">Icon</label>
        <input {...register("icon", { required: true })} id="icon" />
      </div> */}
      <button type="submit" className="btn btn-primary">Add Board</button>
    </form>
  );
};

export default AddBoardForm;
