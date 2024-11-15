-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "taskLink" TEXT;

-- CreateTable
CREATE TABLE "_ClinicToTask" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ClinicToTask_AB_unique" ON "_ClinicToTask"("A", "B");

-- CreateIndex
CREATE INDEX "_ClinicToTask_B_index" ON "_ClinicToTask"("B");

-- AddForeignKey
ALTER TABLE "_ClinicToTask" ADD CONSTRAINT "_ClinicToTask_A_fkey" FOREIGN KEY ("A") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClinicToTask" ADD CONSTRAINT "_ClinicToTask_B_fkey" FOREIGN KEY ("B") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
