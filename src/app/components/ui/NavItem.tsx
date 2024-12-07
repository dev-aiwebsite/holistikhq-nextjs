import { ChevronRight, Ellipsis, ListFilter } from "lucide-react";
import { Button } from "../dndComponents/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { CardContent, CardHeader, CardTitle } from "./card";
import Link from "next/link";
import { cn } from "@lib/utils";
import { usePathname } from "next/navigation";
import { MessageIcon } from "public/svgs/svgs";
import { ReactNode, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible";

type TypeNavItemProps = {
    icon?:ReactNode;
    link?:string;
    title?:string;
    actions?:ReactNode;
    collapsible?:boolean;
    children?:ReactNode;
    isSubmenuItem?:boolean
}
const NavItem = ({isSubmenuItem,collapsible,icon,link = '#',title,actions, children}:TypeNavItemProps) => {
    const pathname = usePathname()
    const [isOpen,setIsOpen] = useState(true)
    console.log(isOpen, 'isOpen')

    if(!collapsible){
        return <div className={cn(isSubmenuItem ? "submenu-navitem" : "navitem")}>
        <Link className={cn("navitem-trigger", (link != '#' && pathname == `${link}`) ? 'active' : '', !link && 'pointer-events-none')}
        href={link}>
        <div className="main-icon icon">
            {icon}
        </div>
        <span className="title text-current truncate">{title}</span>
       {collapsible && <span className="h-4 w-4 ml-auto pointer-evens-none absolute right-2 top-1/2  -translate-y-1/2">
            <ChevronRight className={cn("w-full h-full transition ease-in-out duration-300", isOpen && "rotate-90")} />
        </span>}
        </Link>  

        </div>
    }


    return (
        
        <Collapsible className="navitem"
        open={isOpen}
        onOpenChange={setIsOpen}
        >
        <CollapsibleTrigger asChild className="flex w-full">
        <span className={cn("navitem-trigger", (link != '#' && pathname == `${link}`) ? 'active' : '', !link && 'pointer-events-none')}>
        <div className="main-icon icon">
            {icon}
        </div>
        <span className="title text-current">{title}</span>
       {collapsible && <span className="h-4 w-4 ml-auto pointer-evens-none absolute right-2 top-1/2  -translate-y-1/2">
            <ChevronRight className={cn("w-full h-full transition ease-in-out duration-300", isOpen && "rotate-90")} />
        </span>}
        </span>  
       </CollapsibleTrigger>
       
    {collapsible && <CollapsibleContent className="submenu">
        {children}
       </CollapsibleContent>}

   </Collapsible>
   
     
    );
}

export default NavItem;