-- DropForeignKey
ALTER TABLE "ActiveRoutineSet" DROP CONSTRAINT "ActiveRoutineSet_exerciseId_fkey";

-- AddForeignKey
ALTER TABLE "ActiveRoutineSet" ADD CONSTRAINT "ActiveRoutineSet_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
