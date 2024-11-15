// AddBoardForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { _addBoard } from "@lib/server_actions/database_crud"; // Adjust the import path
import { Board } from "@prisma/client"

const AddBoardForm = () => {
  const { register, handleSubmit, setError } = useForm<Board>();

  const onSubmit = async (data: Board) => {
    console.log('submitting', data);

    try {
      const result = await _addBoard(data.name, data.createdBy, data.color, data.icon);
      
      if (result.success) {
        console.log("Board Data:", data); // Log success
      } else {
        console.log(result)
        setError("root", { message: result.message });
      }
      
    } catch (error) {
      console.error("Error during submission:", error); // More detailed error logging
      setError("root", { message: "An unexpected error occurred." });
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
      <div>
        <label htmlFor="name">Board Name</label>
        <input {...register("name", { required: true })} id="name" />
      </div>
      <div>
        <label htmlFor="createdBy">Created By</label>
        <input {...register("createdBy", { required: true })} id="createdBy" />
      </div>
      <div>
        <label htmlFor="color">Color</label>
        <input {...register("color", { required: true })} id="color" type="color" />
      </div>
      <div>
        <label htmlFor="icon">Icon</label>
        <input {...register("icon", { required: true })} id="icon" />
      </div>
      <button type="submit" className="btn btn-primary">Add Board</button>
    </form>
  );
};

export default AddBoardForm;
