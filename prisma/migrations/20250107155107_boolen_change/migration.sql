/*
  Warnings:

  - Made the column `adminCode` on table `Workspace` required. This step will fail if there are existing NULL values in that column.
  - Made the column `canEditCode` on table `Workspace` required. This step will fail if there are existing NULL values in that column.
  - Made the column `inviteCode` on table `Workspace` required. This step will fail if there are existing NULL values in that column.
  - Made the column `readOnlyCode` on table `Workspace` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Workspace" ALTER COLUMN "adminCode" SET NOT NULL,
ALTER COLUMN "canEditCode" SET NOT NULL,
ALTER COLUMN "inviteCode" SET NOT NULL,
ALTER COLUMN "readOnlyCode" SET NOT NULL;
