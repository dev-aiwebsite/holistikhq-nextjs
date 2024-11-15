"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type ContentType = ReactNode;
type OpenDrawerType = (newContent?: ContentType, newHeaderItems?: ContentType, onClose?: () => void) => void;

interface DrawerContextProps {
  isOpen: boolean;
  openDrawer: OpenDrawerType;
  closeDrawer: () => void;
  content: ContentType;
  headerItems: ContentType;
  addOnCloseHandler: (handler: () => void) => void;
  removeOnCloseHandler: (handler: () => void) => void;
  getOnCloseHandlers: () => (() => void)[]; // Add this
}

const DrawerContext = createContext<DrawerContextProps | undefined>(undefined);

export const DrawerProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);
  const [headerItems, setHeaderItems] = useState<ReactNode>(null);
  const [onCloseHandlers, setOnCloseHandlers] = useState<(() => void)[]>([]);

  const openDrawer: OpenDrawerType = (newContent, newHeaderItems, onClose) => {
    if (newContent) {
      setContent(newContent);
      setHeaderItems(newHeaderItems);
    }
    if (onClose) {
      setOnCloseHandlers((prev) => [...prev, onClose]);
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

  return (
    <DrawerContext.Provider 
      value={{ 
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
    </DrawerContext.Provider>
  );
};

export const useDrawerContext = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawer must be used within a DrawerProvider");
  }
  return context;
};
