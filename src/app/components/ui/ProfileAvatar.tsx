import { getInitials } from "@lib/helperFunctions";
import { cn } from "@lib/utils";
import { UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
type TypeProfileAvatar = {
    placeholder?:string;
    className?: string;
    name?: string;
    src?:string | undefined;
    showName?:boolean;
    fallbackClassName?: string;
}
const ProfileAvatar = ({fallbackClassName, className,name,src,showName,placeholder}:TypeProfileAvatar) => {
    let initials
    const useDefault = !name || name === 'undefined' || name == 'undefined undefined'
    if(!useDefault) initials = getInitials(name)

    return (
        <>
    {useDefault ? (
                <div className="flex flex-row gap-2 items-center">
                    <div className="flex items-center justify-center w-7 h-7 rounded-full border border-dashed border-current aspect-square">
                        <UserRound size={16} strokeWidth={1.5} />
                    </div>
                    {showName && <span className="text-[.9em] capitalize text-gray-500">{placeholder}</span>}
                 </div>
            ) : (<div className="flex flex-row gap-2 items-center">
                <Avatar className={cn("w-7 h-7", className)}>
                    <AvatarImage src={src} alt={initials} />
                    <AvatarFallback className={cn("!bg-indigo-400 font-bold text-sm text-white", fallbackClassName)}>
                        {initials}
                    </AvatarFallback>
                </Avatar>
                {showName && <span className="text-gray-700 text-[.9em] capitalize">{name}</span>}
            </div>
            )}
        </>
    );
}

export default ProfileAvatar;