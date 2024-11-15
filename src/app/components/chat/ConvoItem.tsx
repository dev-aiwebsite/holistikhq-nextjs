import { getInitials } from "@lib/helperFunctions";
import { cn } from "@lib/utils";
import { UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import ProfileAvatar from "../ui/ProfileAvatar";
type ConvoItemType = {
    message?:Message
}
const ConvoItem = ({message}:ConvoItemType) => {

    return <>
        <div className="ring-8 ring-transparent rounded flex flex-row w-60 max-w-60 overflow-hidden gap-2 hover:bg-app-brown-300 hover:ring-app-brown-300 hover:cursor-pointer">
            
            <ProfileAvatar className="w-9 h-9" fallbackClassName="!bg-app-orange-500" name={"ian rafols"}/>
            
            <div className="flex-1">
                <div className="flex flex-col text-sm">
                    <span className="font-medium">Ian Rafols</span>
                    <div className="text-[.9em] flex flex-row flex-nowrap gap-2">
                        <span className="truncate-1 flex-1 text-stone-500">This is a sample content please read it carefully</span>
                        <span>19h</span>
                    </div>
                </div>
            </div>
        </div>
    
    </>
}

export default ConvoItem;