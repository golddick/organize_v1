-- AlterTable
ALTER TABLE "Workspace" ALTER COLUMN "adminCode" DROP NOT NULL,
ALTER COLUMN "canEditCode" DROP NOT NULL,
ALTER COLUMN "inviteCode" DROP NOT NULL,
ALTER COLUMN "inviteCode" DROP DEFAULT,
ALTER COLUMN "readOnlyCode" DROP NOT NULL;