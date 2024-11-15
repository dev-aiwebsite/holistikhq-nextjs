"use client"
// context/TaskContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface TaskBoardContextProps {
  boardData:object;
  updateBoard: (boardData:object)=> void;

}

const TaskContext = createContext<TaskBoardContextProps | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [boardData, setBoardData] = useState<object>({});

  function updateBoard(boardData:object){
    setBoardData(boardData)
  }

  return (
    <TaskContext.Provider value={{ boardData , updateBoard }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};
