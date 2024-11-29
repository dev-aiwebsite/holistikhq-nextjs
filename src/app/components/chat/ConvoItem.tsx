import { memo, MouseEventHandler } from "react";
import ProfileAvatar from "../ui/ProfileAvatar";
import { cn } from "@lib/utils";
import { useAppStateContext } from "@app/context/AppStatusContext";
import { getShortTimeAgo, getTimeAgo, stripHtml } from "@lib/helperFunctions";
import { CircleX } from "lucide-react";
import { useSearchParams } from "next/navigation";

type ConvoItemType = {
  convo_id: string;
  onClick?: (e:React.MouseEvent<HTMLDivElement>,convo_info?:any)=>void; // Typing onClick as a MouseEventHandler
};

const ConvoItem = memo(({ convo_id, onClick }: ConvoItemType) => {
    console.log('convo item renders')
    const searchParams = useSearchParams()
    const activeConvoId = searchParams.get('cid')
    const newConvoId = searchParams.get('new')
    const { appState } = useAppStateContext()
    const convo_data = appState.currentUser.conversations.find(convo => convo.id == convo_id)
    const profileInfo = {
        taskId: "",
        fullName: "Unknown",
        profileImage: "" as string | undefined
    }

    const isActive = [activeConvoId,newConvoId].includes(convo_id)
    // const isActive = false

    const handleOnClick = (e: React.MouseEvent) => {
        if (onClick) {
          onClick(e);
        }
      };
    


    if(!convo_data) return (
            <div
            className={cn(
                "relative border-[16px] border-transparent ml-[-16px] box-content rounded-lg flex flex-row w-60 max-w-60 overflow-hidden gap-2 hover:bg-app-brown-300 hover:cursor-pointer hover:border-app-brown-300",
                isActive && 'bg-app-brown-400'
            )}
            >
                <ProfileAvatar
                    src={""}
                    className="w-9 h-9"
                    fallbackClassName="!bg-app-orange-500"
                    name={""}
                />

            <div className="flex-1">
                <div className="flex flex-col text-sm">
                <span className="font-medium">{"New Message"}</span>
                {/* <div className="text-[.9em] flex flex-row flex-nowrap gap-2">
                    <span className="truncate-1 flex-1 text-stone-500">{excerpt}</span>
                    <span>{messageDate}</span>
                </div> */}
                </div>
            </div>
            <CircleX  onClick={handleOnClick} className="hover:text-red-400 opacity-50 hover:opacity-100 hover:cursor-pointer" size={18} strokeWidth={2} />
            </div>
        );

    const convo_type = convo_data.type
    const usersInConvo = convo_data.users
    const messages = convo_data.messages
    const excerpt = messages[0] ? stripHtml(messages[0].content) : ""
    const messageDate = messages[0] ? getShortTimeAgo(messages[0].createdAt)  : ""
   
    
    if(convo_type == "private" && usersInConvo.length == 2){
        const userInfo = convo_data.users.find(user => user.id != appState.currentUser.id)
        profileInfo.fullName = userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : "Unknown"
        profileInfo.profileImage = userInfo?.profileImage || undefined

    } else if (convo_type == "ticket"){
        profileInfo.taskId = convo_data.taskId || ""
        profileInfo.fullName = convo_data.task.name
        profileInfo.profileImage = convo_data.icon || undefined
    }


 
  return (
    <div
      onClick={handleOnClick}
      className={cn(
        "border-[16px] border-transparent ml-[-16px] box-content rounded-lg flex flex-row w-60 max-w-60 overflow-hidden gap-2 hover:bg-app-brown-300 hover:cursor-pointer hover:border-app-brown-300",
        isActive && 'bg-app-brown-400'
      )}
    >
        <ProfileAvatar
            src={profileInfo.profileImage}
            className="w-9 h-9"
            fallbackClassName="!bg-app-orange-500"
            name={profileInfo.fullName}
        />

      <div className="flex-1">
        <div className="flex flex-col text-sm">
          <span className="font-medium">{profileInfo.fullName}</span>
          <div className="text-[.9em] flex flex-row flex-nowrap gap-2">
            <span className="truncate-1 flex-1 text-stone-500">{excerpt}</span>
            <span>{messageDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

ConvoItem.displayName = "ConvoItem";
export default ConvoItem;
