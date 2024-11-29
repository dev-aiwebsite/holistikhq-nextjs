-- DropForeignKey
ALTER TABLE "Automations" DROP CONSTRAINT "Automations_boardId_fkey";

-- AddForeignKey
ALTER TABLE "Automations" ADD CONSTRAINT "Automations_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;
