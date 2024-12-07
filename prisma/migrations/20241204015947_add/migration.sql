/*
  Warnings:

  - A unique constraint covering the columns `[taskId]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Conversation_taskId_key" ON "Conversation"("taskId");
