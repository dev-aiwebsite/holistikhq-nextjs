"use client"
import { Popover,PopoverTrigger,PopoverContent } from "./ui/popover";
import ProfileAvatar from "./ui/ProfileAvatar";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from "./ui/command";
import { Button } from "./ui/button";
import { useState } from "react";
import { useAppStateContext } from "@app/context/AppStatusContext";
import { CircleX } from "lucide-react";
import { cn } from "@lib/utils";

type TypeUserList = {
    onChange?:(value:any)=>void;
    value:string | null;
    name?:string;
    variant?:'icon';
    className?:string;
}

const UserList = ({variant,name,value,onChange,className }:TypeUserList) => {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string | null>(value)
  const {appState} = useAppStateContext()
  const users = appState.users

  function handleOnChange(value:string){
    const userId = value.split(" ")[0]
    if(onChange){
        onChange(userId)
    }
    setSelected(userId || null)
    setOpen(false)
  }

  const selectedUserDetails = appState.users.find(user => user.id == selected)

  const styles = {
    default: 'w-72 max-w-[300px] justify-start',
    icon: '!p-px !rounded-full !w-fit hover:text-app-orange-500/80 hover:bg-white',
  }

  let selectedStyles = styles.default
  let showName = false
  switch (variant) {
    case "icon":
      selectedStyles = styles.icon
      break;
  
    default:
      selectedStyles = styles.default
      showName = true
      break;
  }

  return (
    <div className="flex items-center space-x-4 w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <div className="relative group w-full">
          <PopoverTrigger asChild>
              <Button variant={variant == 'icon' ? 'ghost' : 'outline'} className={cn('text-gray-400',selectedStyles, className)}>
                {selected ? <ProfileAvatar showName={showName} name={`${selectedUserDetails?.firstName} ${selectedUserDetails?.lastName}`} /> : <><ProfileAvatar showName={showName} placeholder="Select Assignee" /></>}
              </Button>
          </PopoverTrigger>
          <CircleX size="18" strokeWidth="1.5" onClick={() => handleOnChange("")} 
          className={cn(`invisible hover:cursor-pointer text-gray-600 hover:text-red-400 fill-white absolute top-1/2 -translate-y-1/2 right-2 group-has-[:hover]:visible`, !selected && 'hidden', variant == 'icon' && '-translate-y-[10%] translate-x-[20%] top-0 right-0') }/>
        </div>

        <PopoverContent className="p-0" side="bottom" align="start">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
              {users.map((user) => (
                    <CommandItem
                    key={user.id}
                    value={`${user.id} ${user.firstName} ${user.lastName}`}
                    onSelect={(value) => handleOnChange(value)}
                  >
                      <ProfileAvatar showName key={user.id} name={`${user.firstName} ${user.lastName}`} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default UserList;


