import { MoreHorizontal} from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { ReactNode } from "react";
import { cn } from "@lib/utils";

type TypeItem = {
    icon?: ReactNode;
    text: string;
    onClick?:()=>void;
}
interface DropDownMenu {
    items:TypeItem[];
    classNameTrigger?:string;
    side?:  "top" | "right" | "bottom" | "left"
}
const DropDownMenu = ({items,classNameTrigger,side}:DropDownMenu) => {
    if(!items) return

    return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className={cn("h-8 w-8 p-0", classNameTrigger && classNameTrigger)}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side={side} >
            {items.map((i,index) => <>
                <DropdownMenuItem key={index} onClick={i.onClick} className="!text-xs">
                    {i.icon && i.icon}
                    {i.text && <span>{i.text}</span>}
                </DropdownMenuItem>
                {(index != 0 || index != items.length -1) && <DropdownMenuSeparator />}
            </>)}
          
        </DropdownMenuContent>
      </DropdownMenu>
    );
}

export default DropDownMenu;