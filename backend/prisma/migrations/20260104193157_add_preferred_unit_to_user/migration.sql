-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('kg', 'lbs');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "preferredUnit" "Unit" NOT NULL DEFAULT 'kg';
