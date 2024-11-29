"use client"
import { KanbanBoard } from "@app/components/dndComponents/KanbanBoard";

const Page = ({ params }: { params: { board_id: string } }) => {
    const boardId = params.board_id

    return (<>
            <KanbanBoard boardId={boardId} className="bg-app-brown-200 board-wrapper py-4" />
    </>

    );
}

export default Page;