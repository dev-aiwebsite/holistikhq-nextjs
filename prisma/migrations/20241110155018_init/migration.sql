/*
  Warnings:

  - You are about to drop the `AutomationAction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AutomationTrigger` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AutomationAction" DROP CONSTRAINT "AutomationAction_automationId_fkey";

-- DropForeignKey
ALTER TABLE "AutomationTrigger" DROP CONSTRAINT "AutomationTrigger_automationId_fkey";

-- AlterTable
ALTER TABLE "Automations" ADD COLUMN     "actions" JSONB[],
ADD COLUMN     "triggers" JSONB[];

-- DropTable
DROP TABLE "AutomationAction";

-- DropTable
DROP TABLE "AutomationTrigger";
