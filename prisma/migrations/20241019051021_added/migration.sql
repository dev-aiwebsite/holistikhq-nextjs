/*
  Warnings:

  - You are about to drop the `_ClinicUsers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserBoards` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ClinicUsers" DROP CONSTRAINT "_ClinicUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClinicUsers" DROP CONSTRAINT "_ClinicUsers_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserBoards" DROP CONSTRAINT "_UserBoards_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserBoards" DROP CONSTRAINT "_UserBoards_B_fkey";

-- DropTable
DROP TABLE "_ClinicUsers";

-- DropTable
DROP TABLE "_UserBoards";

-- CreateTable
CREATE TABLE "_ClinicToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BoardToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ClinicToUser_AB_unique" ON "_ClinicToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ClinicToUser_B_index" ON "_ClinicToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BoardToUser_AB_unique" ON "_BoardToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_BoardToUser_B_index" ON "_BoardToUser"("B");

-- AddForeignKey
ALTER TABLE "_ClinicToUser" ADD CONSTRAINT "_ClinicToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClinicToUser" ADD CONSTRAINT "_ClinicToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BoardToUser" ADD CONSTRAINT "_BoardToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BoardToUser" ADD CONSTRAINT "_BoardToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
