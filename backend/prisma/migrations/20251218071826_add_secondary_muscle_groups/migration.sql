-- CreateTable
CREATE TABLE "ExerciseSecondaryMuscleGroup" (
    "id" SERIAL NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "muscleGroupId" INTEGER NOT NULL,

    CONSTRAINT "ExerciseSecondaryMuscleGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExerciseSecondaryMuscleGroup_exerciseId_muscleGroupId_key" ON "ExerciseSecondaryMuscleGroup"("exerciseId", "muscleGroupId");

-- AddForeignKey
ALTER TABLE "ExerciseSecondaryMuscleGroup" ADD CONSTRAINT "ExerciseSecondaryMuscleGroup_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseSecondaryMuscleGroup" ADD CONSTRAINT "ExerciseSecondaryMuscleGroup_muscleGroupId_fkey" FOREIGN KEY ("muscleGroupId") REFERENCES "MuscleGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
