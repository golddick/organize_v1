/*
  Warnings:

  - The primary key for the `_MindMapToTag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_TagToTask` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_MindMapToTag` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_TagToTask` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "_MindMapToTag" DROP CONSTRAINT "_MindMapToTag_AB_pkey";

-- AlterTable
ALTER TABLE "_TagToTask" DROP CONSTRAINT "_TagToTask_AB_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "_MindMapToTag_AB_unique" ON "_MindMapToTag"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_TagToTask_AB_unique" ON "_TagToTask"("A", "B");
