/*
  Warnings:

  - The `actions` column on the `Automations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `triggers` column on the `Automations` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Automations" DROP COLUMN "actions",
ADD COLUMN     "actions" JSONB,
DROP COLUMN "triggers",
ADD COLUMN     "triggers" JSONB;
