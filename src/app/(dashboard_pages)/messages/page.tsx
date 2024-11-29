import Chat from "@app/components/chat/Chat";

const MessagesPage = () => {
    return (
        <>
            <div className="header-h">
                <div className="py-4">
                    <div className="flex flex-row items-center gap-2">
                        <span className="capitalize text-2xl font-bold">Messages</span>
                    </div>
                </div>
            </div>
            <div className="max-h-2-header-h h-full p-0">
                <Chat />
            </div>
        </>
    );
}

export default MessagesPage;