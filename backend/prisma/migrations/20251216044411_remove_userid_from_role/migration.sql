/*
  Warnings:

  - You are about to drop the column `userId` on the `Role` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Role_userId_key";

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "userId";
