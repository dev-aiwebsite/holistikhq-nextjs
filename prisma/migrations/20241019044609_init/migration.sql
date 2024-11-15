/*
  Warnings:

  - You are about to drop the column `clinic` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "clinic";

-- CreateTable
CREATE TABLE "Clinic" (
    "id" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Clinic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClinicUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ClinicUsers_AB_unique" ON "_ClinicUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_ClinicUsers_B_index" ON "_ClinicUsers"("B");

-- AddForeignKey
ALTER TABLE "_ClinicUsers" ADD CONSTRAINT "_ClinicUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClinicUsers" ADD CONSTRAINT "_ClinicUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
