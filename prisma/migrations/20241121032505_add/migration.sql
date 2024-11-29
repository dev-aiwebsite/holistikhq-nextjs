-- AlterTable
ALTER TABLE "BoardStatus" ADD COLUMN     "isComplete" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "isCompleted" BOOLEAN DEFAULT false;
