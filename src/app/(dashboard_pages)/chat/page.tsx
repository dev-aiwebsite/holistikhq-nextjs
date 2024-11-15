import Chat from "@app/components/chat/Chat";

const ChatPage = () => {
    return (
        <>
            <div className="">
                <div className="py-4">
                    <div className="flex flex-row items-center gap-2">
                        <span className="capitalize text-2xl font-bold">Messages</span>
                    </div>
                </div>
            </div>
            <Chat />
        </>
    );
}

export default ChatPage;