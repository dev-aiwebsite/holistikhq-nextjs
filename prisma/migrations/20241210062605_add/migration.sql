/*
  Warnings:

  - A unique constraint covering the columns `[myTodoUserId]` on the table `Board` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Board" ADD COLUMN     "myTodoUserId" TEXT;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "todoStatusId" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "roles" SET DEFAULT ARRAY['client']::TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "Board_myTodoUserId_key" ON "Board"("myTodoUserId");

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_myTodoUserId_fkey" FOREIGN KEY ("myTodoUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_todoStatusId_fkey" FOREIGN KEY ("todoStatusId") REFERENCES "BoardStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
