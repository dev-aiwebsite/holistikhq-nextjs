-- AlterTable
ALTER TABLE "Board" ADD COLUMN     "defaultTemplate" TEXT;

-- CreateTable
CREATE TABLE "TaskTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BoardToTaskTemplate" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BoardToTaskTemplate_AB_unique" ON "_BoardToTaskTemplate"("A", "B");

-- CreateIndex
CREATE INDEX "_BoardToTaskTemplate_B_index" ON "_BoardToTaskTemplate"("B");

-- AddForeignKey
ALTER TABLE "_BoardToTaskTemplate" ADD CONSTRAINT "_BoardToTaskTemplate_A_fkey" FOREIGN KEY ("A") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BoardToTaskTemplate" ADD CONSTRAINT "_BoardToTaskTemplate_B_fkey" FOREIGN KEY ("B") REFERENCES "TaskTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
