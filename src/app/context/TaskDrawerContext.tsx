"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type ContentType = ReactNode;
type OpenDrawerType = (taskid:string) => void;

interface TaskDrawerContextProps {
  taskId:string | null;
  isOpen: boolean;
  openDrawer: OpenDrawerType;
  closeDrawer: () => void;
  content: ContentType;
  headerItems: ContentType;
  addOnCloseHandler: (handler: () => void) => void;
  removeOnCloseHandler: (handler: () => void) => void;
  getOnCloseHandlers: () => (() => void)[]; // Add this
}

const TaskDrawerContext = createContext<TaskDrawerContextProps | undefined>(undefined);

export const DrawerProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);
  const [headerItems, setHeaderItems] = useState<ReactNode>(null);
  const [onCloseHandlers, setOnCloseHandlers] = useState<(() => void)[]>([]);
  const [taskId,setTaskId] = useState<string | null>(null)

  console.log('TaskDrawerContext rendering...')
  console.log(taskId)
  const openDrawer: OpenDrawerType = (taskid) => {
    // if (newContent) {
    //   setContent(newContent);
    //   setHeaderItems(newHeaderItems);
    // }
    // if (onClose) {
    //   setOnCloseHandlers((prev) => [...prev, onClose]);
    // }
    if(taskid){
      setTaskId(taskid)
    }
    setIsOpen(true);
  };

  const closeDrawer = () => {
    onCloseHandlers.forEach((handler) => handler());
    setIsOpen(false);
    setContent(null);
    setOnCloseHandlers([]); // Clear the handlers after closing
  };

  const addOnCloseHandler = (handler: () => void) => {
    setOnCloseHandlers((prev) => [...prev, handler]);
  };

  const removeOnCloseHandler = (handler: () => void) => {
    setOnCloseHandlers((prev) => prev.filter((h) => h !== handler));
  };

  // New method to retrieve current onCloseHandlers
  const getOnCloseHandlers = () => {
    return onCloseHandlers;
  };

  // Add Escape key listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        closeDrawer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onCloseHandlers]);

  return (
    <TaskDrawerContext.Provider 
      value={{ 
        taskId,
        isOpen, 
        openDrawer, 
        closeDrawer, 
        content, 
        headerItems, 
        addOnCloseHandler, 
        removeOnCloseHandler,
        getOnCloseHandlers // Expose the method
      }}
    >
      {children}
    </TaskDrawerContext.Provider>
  );
};


export const useTaskDrawerContext = () => {
  const context = useContext(TaskDrawerContext);
  if (!context) {
    throw new Error("useDrawer must be used within a DrawerProvider");
  }
  return context;
};
