"use client";

import { cn } from "@lib/utils"; // Adjust the path as necessary
import { ArrowRightToLine, Trash } from "lucide-react";
import { useTaskDrawerContext } from "@app/context/TaskDrawerContext";
import { useEffect, useMemo, useState } from "react";
import MarkAsCompleteBtn from "../task/MarkAsCompleteBtn";
import FormUpdateTask from "../forms/FormUpdateTask";
import DropDownMenu from "../DropDownMenu";
import { useAppStateContext } from "@app/context/AppStatusContext";

interface TaskDrawerProps {
  headerItem?:React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}

const TaskDrawer: React.FC<TaskDrawerProps> = ({children, headerItem,isOpen, onClose, ...props }) => {
    const {taskId, isOpen:drawerIsOpen, closeDrawer, content:drawerContent, headerItems:drawerHeaderItems } = useTaskDrawerContext()
    const {deleteTask} = useAppStateContext()

    if(!isOpen){
      isOpen = drawerIsOpen
    }
    const [isShown,setIsShown] = useState<boolean | undefined>(isOpen)
    const [content,setContent] = useState(children)
    const [headerItems,setHeaderItems] = useState(headerItem)
    
    console.log('TaskDrawer rendering..')

    const handleClickOutside = (event) => {
      const clickedEl = event.target
      const drawer = document.querySelector('.taskDrawerParent');
      const isTrigger = clickedEl.classList.contains('taskdrawer-trigger') || clickedEl.closest('.taskdrawer-trigger');

      if (drawerIsOpen && drawer && !drawer.contains(clickedEl) && !isTrigger) {
        closeDrawer();
        console.log('closing drawer')
      }

    };

    function handleClose(){
        closeDrawer()
        if(onClose){
            onClose()
        }
    }

  
    useEffect(()=> {
      setIsShown(drawerIsOpen)
    },[drawerIsOpen, content])

    useEffect(() => {
        setHeaderItems(drawerHeaderItems);
    }, [drawerHeaderItems]);

    useEffect(() => {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }, [isShown]);

    
    useEffect(() => {
        setContent(drawerContent);
    }, [drawerContent]);
    

    const dropDownMenuItems = useMemo(()=> {
      return [
        {
          icon: <Trash />,
          text: 'Delete',
          onClick: ()=> {
            if (!taskId) return
            deleteTask(taskId)
          },
        }
      ]
    },[deleteTask,taskId]) 

  return (
    <div
      {...props}
      style={{height:'calc(100dvh - var(--header-h))'}}
      className={cn(
        "taskDrawerParent fixed right-0 bottom-0 transition-opacity duration-500 right-0 pointer-events-none !p-0"
      )}
      onClick={handleClose} // Close the drawer when clicking outside
    >
      <div
      style={{maxHeight:'calc(100dvh - var(--header-h))',overflow:'auto'}}
        className={cn(
          "taskDrawer bg-white h-full rounded-l-lg shadow-lg transition-all duration-300 transform pointer-events-auto border-l ease-in-out",
          isShown && "shown"
        )}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the drawer
      >
        <div className="border-b sticky top-0 bg-white p-4 flex justify-between items-center mb-4">
          <div>
            {taskId && <MarkAsCompleteBtn taskId={taskId} />}
            {headerItems}
            </div>
            <div>
              <DropDownMenu items={dropDownMenuItems} />
              <button onClick={handleClose} className="text-gray-600 hover:text-app-orange-500 cursor-pointer">
                <ArrowRightToLine className="text-current"/>
              </button>

            </div>
        </div>
        <div className="p-4">
          {taskId && <FormUpdateTask onSubmit={() => closeDrawer()} taskId={taskId} />}
        </div>
      </div>
    </div>
  );
};

export default TaskDrawer;
