-- CreateTable
CREATE TABLE "ActiveRoutine" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "routineId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActiveRoutine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActiveRoutineSet" (
    "id" SERIAL NOT NULL,
    "activeRoutineId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "setNumber" INTEGER NOT NULL,
    "targetWeight" DECIMAL(65,30),
    "targetRepsMin" INTEGER NOT NULL,
    "targetRepsMax" INTEGER NOT NULL,
    "actualWeight" DECIMAL(65,30),
    "actualReps" INTEGER,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "isPR" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActiveRoutineSet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ActiveRoutine" ADD CONSTRAINT "ActiveRoutine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveRoutine" ADD CONSTRAINT "ActiveRoutine_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "Routine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveRoutineSet" ADD CONSTRAINT "ActiveRoutineSet_activeRoutineId_fkey" FOREIGN KEY ("activeRoutineId") REFERENCES "ActiveRoutine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveRoutineSet" ADD CONSTRAINT "ActiveRoutineSet_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
