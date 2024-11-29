/*
  Warnings:

  - You are about to drop the `_ClinicToTask` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ClinicToTask" DROP CONSTRAINT "_ClinicToTask_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClinicToTask" DROP CONSTRAINT "_ClinicToTask_B_fkey";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "clinicId" TEXT;

-- DropTable
DROP TABLE "_ClinicToTask";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE SET NULL ON UPDATE CASCADE;
