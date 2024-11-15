"use client";

import * as React from "react";
import { cn } from "@lib/utils"; // Adjust the path as necessary
import { ArrowRightToLine } from "lucide-react";
import { useDrawerContext } from "@app/context/DrawerContext";

interface SideDrawerProps {
    headerItem?:React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}

const SideDrawer: React.FC<SideDrawerProps> = ({children, headerItem,isOpen, onClose, ...props }) => {
    const {isOpen:drawerIsOpen, closeDrawer, content:drawerContent, headerItems:drawerHeaderItems } = useDrawerContext()
    
    if(!isOpen){
      isOpen = drawerIsOpen
    }
    const [isShown,setIsShown] = React.useState<boolean | undefined>(isOpen)
    const [content,setContent] = React.useState(children)
    const [headerItems,setHeaderItems] = React.useState(headerItem)
    

    const handleClickOutside = (event) => {
      const clickedEl = event.target
      const drawer = document.querySelector('.sideDrawerParent');
      const isTrigger = clickedEl.classList.contains('sidedrawer-trigger') || clickedEl.closest('.sidedrawer-trigger');

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

  
    React.useEffect(()=> {
      setIsShown(drawerIsOpen)
    },[drawerIsOpen, content])

    React.useEffect(() => {
        setHeaderItems(drawerHeaderItems);
    }, [drawerHeaderItems]);

    React.useEffect(() => {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }, [isShown]);

    
    React.useEffect(() => {
        setContent(drawerContent);
    }, [drawerContent]);
    
    console.log(content, ' from sidedrawer')

  return (
    <div
      {...props}
      style={{height:'calc(100dvh - var(--header-h))'}}
      className={cn(
        "sideDrawerParent fixed right-0 bottom-0 transition-opacity duration-500 right-0 pointer-events-none !p-0"
      )}
      onClick={handleClose} // Close the drawer when clicking outside
    >
      <div
      style={{maxHeight:'calc(100dvh - var(--header-h))',overflow:'auto'}}
        className={cn(
          "sideDrawer bg-white h-full rounded-l-lg shadow-lg transition-all duration-300 transform pointer-events-auto border-l ease-in-out",
          isShown && "shown"
        )}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the drawer
      >
        <div className="border-b sticky top-0 bg-white p-4 flex justify-between items-center mb-4">
          <div>
            {headerItems}
            </div>
          <button onClick={handleClose} className="text-gray-600 hover:text-app-orange-500 cursor-pointer">
            <ArrowRightToLine className="text-current"/>
            </button>
        </div>
        <div className="p-4">
          {content}
        </div>
      </div>
    </div>
  );
};

export default SideDrawer;
