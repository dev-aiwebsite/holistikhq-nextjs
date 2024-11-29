/*
  Warnings:

  - You are about to drop the column `address` on the `Clinic` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Clinic" DROP COLUMN "address",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "meta" JSONB;
