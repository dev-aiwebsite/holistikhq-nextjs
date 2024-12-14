/*
  Warnings:

  - The `type` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('task', 'mytodo');

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "type",
ADD COLUMN     "type" "TaskType" DEFAULT 'task';
