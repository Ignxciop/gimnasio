/*
  Warnings:

  - You are about to drop the column `reps` on the `RoutineExercise` table. All the data in the column will be lost.
  - Added the required column `repsMax` to the `RoutineExercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `repsMin` to the `RoutineExercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RoutineExercise" DROP COLUMN "reps",
ADD COLUMN     "repsMax" INTEGER NOT NULL,
ADD COLUMN     "repsMin" INTEGER NOT NULL;
