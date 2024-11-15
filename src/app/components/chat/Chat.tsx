"use client"

import { Search, SquarePen } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import ConvoItem from "./ConvoItem";

const Chat = () => {
    return (
        <div className="flex flex-row flex-nowrap h-full p-0 border border-gray-200">
            <div className="bg-app-brown-200 w-72 max-w-72 h-full border-r border-gray-200">
                <div className="h-20 p-6">
                    <div className="flex flex-row items-center">
                        <span className="text-md font-bold">Conversations</span>
                        <Button className="text-app-orange-500 ml-auto rounded-full bg-transparent shadow-none hover:bg-white" variant="default" size="icon">
                            <SquarePen size={16} strokeWidth={1.8} />
                        </Button>
                    </div>
                </div>
                <div className="p-6">
                    <div className="flex flex-nowrap flex-row items-center relative ">
                        <Search className="absolute left-2" size={16} strokeWidth={1} />
                        <Input className="pl-8 bg-white rounded-full" type="search" placeholder="Search" />
                    </div>

                    <div className="pt-6">
                        <div>
                            <ConvoItem />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-1">
                <div className="h-20 p-6 border-b border-gray-200">

                </div>
            </div>
        </div>
    );
}

export default Chat;