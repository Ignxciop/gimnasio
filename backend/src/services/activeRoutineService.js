import { prisma } from "../config/prisma.js";

class ActiveRoutineService {
    async getActiveByUser(userId) {
        const activeRoutine = await prisma.activeRoutine.findFirst({
            where: {
                userId,
                status: "active",
            },
            include: {
                routine: true,
                sets: {
                    include: {
                        exercise: {
                            include: {
                                equipment: true,
                                muscleGroup: true,
                            },
                        },
                    },
                    orderBy: { order: "asc" },
                },
            },
        });

        return activeRoutine;
    }

    async create(routineId, userId) {
        const existing = await this.getActiveByUser(userId);
        if (existing) {
            const error = new Error("Ya tienes una rutina activa");
            error.statusCode = 400;
            throw error;
        }

        const routine = await prisma.routine.findFirst({
            where: { id: routineId, userId },
            include: {
                exercises: {
                    include: {
                        exercise: true,
                    },
                    orderBy: { order: "asc" },
                },
            },
        });

        if (!routine) {
            const error = new Error("Rutina no encontrada");
            error.statusCode = 404;
            throw error;
        }

        const exerciseIds = routine.exercises.map((ex) => ex.exerciseId);
        const historicalMaxWeights = await prisma.activeRoutineSet.groupBy({
            by: ["exerciseId"],
            where: {
                exerciseId: { in: exerciseIds },
                completed: true,
                activeRoutine: {
                    userId,
                    status: "completed",
                },
            },
            _max: {
                actualWeight: true,
            },
        });

        const maxWeightMap = Object.fromEntries(
            historicalMaxWeights.map((item) => [
                item.exerciseId,
                item._max.actualWeight,
            ])
        );

        const activeRoutine = await prisma.activeRoutine.create({
            data: {
                userId,
                routineId,
                sets: {
                    create: routine.exercises.flatMap((routineEx) => {
                        const sets = [];
                        const maxHistorical =
                            maxWeightMap[routineEx.exerciseId];
                        const targetWeight = maxHistorical || routineEx.weight;
                        for (let i = 0; i < routineEx.sets; i++) {
                            sets.push({
                                exerciseId: routineEx.exerciseId,
                                setNumber: i + 1,
                                targetWeight,
                                targetRepsMin: routineEx.repsMin,
                                targetRepsMax: routineEx.repsMax,
                                order: routineEx.order * 100 + i,
                            });
                        }
                        return sets;
                    }),
                },
            },
            include: {
                routine: true,
                sets: {
                    include: {
                        exercise: {
                            include: {
                                equipment: true,
                                muscleGroup: true,
                            },
                        },
                    },
                    orderBy: { order: "asc" },
                },
            },
        });

        return activeRoutine;
    }

    async updateSet(setId, actualWeight, actualReps, userId) {
        const set = await prisma.activeRoutineSet.findFirst({
            where: {
                id: setId,
                activeRoutine: {
                    userId,
                    status: "active",
                },
            },
        });

        if (!set) {
            const error = new Error("Serie no encontrada");
            error.statusCode = 404;
            throw error;
        }

        const finalWeight = actualWeight ?? set.targetWeight ?? 0;
        const finalReps = actualReps ?? set.targetRepsMax;

        const isPR = await this.checkIfPR(
            set.exerciseId,
            finalWeight,
            finalReps,
            userId
        );

        const updatedSet = await prisma.activeRoutineSet.update({
            where: { id: setId },
            data: {
                actualWeight: finalWeight,
                actualReps: finalReps,
                completed: true,
                isPR,
            },
            include: {
                exercise: {
                    include: {
                        equipment: true,
                        muscleGroup: true,
                    },
                },
            },
        });

        return updatedSet;
    }

    async checkIfPR(exerciseId, weight, reps, userId) {
        const historicalSets = await prisma.activeRoutineSet.findMany({
            where: {
                exerciseId,
                completed: true,
                activeRoutine: {
                    userId,
                    status: "completed",
                },
            },
            orderBy: [{ actualWeight: "desc" }, { actualReps: "desc" }],
        });

        const currentSets = await prisma.activeRoutineSet.findMany({
            where: {
                exerciseId,
                completed: true,
                activeRoutine: {
                    userId,
                    status: "active",
                },
            },
        });

        const allSets = [...historicalSets, ...currentSets];

        if (allSets.length === 0) return true;

        const maxWeight = Math.max(
            ...allSets.map((s) => Number(s.actualWeight || 0))
        );
        const maxReps = Math.max(...allSets.map((s) => s.actualReps || 0));

        const currentWeight = Number(weight || 0);

        if (currentWeight > maxWeight) return true;

        if (currentWeight === maxWeight && reps > maxReps) return true;

        return false;
    }

    async reorderSets(setIds, userId) {
        const updates = setIds.map((id, index) =>
            prisma.activeRoutineSet.updateMany({
                where: {
                    id,
                    activeRoutine: {
                        userId,
                        status: "active",
                    },
                },
                data: { order: index },
            })
        );

        await prisma.$transaction(updates);
        return { message: "Orden actualizado exitosamente" };
    }

    async complete(activeRoutineId, userId) {
        const activeRoutine = await prisma.activeRoutine.findFirst({
            where: {
                id: activeRoutineId,
                userId,
                status: "active",
            },
        });

        if (!activeRoutine) {
            const error = new Error("Rutina activa no encontrada");
            error.statusCode = 404;
            throw error;
        }

        const completed = await prisma.activeRoutine.update({
            where: { id: activeRoutineId },
            data: {
                status: "completed",
                endTime: new Date(),
            },
            include: {
                routine: true,
                sets: {
                    include: {
                        exercise: {
                            include: {
                                equipment: true,
                                muscleGroup: true,
                            },
                        },
                    },
                },
            },
        });

        return completed;
    }

    async cancel(activeRoutineId, userId) {
        const activeRoutine = await prisma.activeRoutine.findFirst({
            where: {
                id: activeRoutineId,
                userId,
                status: "active",
            },
        });

        if (!activeRoutine) {
            const error = new Error("Rutina activa no encontrada");
            error.statusCode = 404;
            throw error;
        }

        await prisma.activeRoutineSet.deleteMany({
            where: { activeRoutineId },
        });

        await prisma.activeRoutine.delete({
            where: { id: activeRoutineId },
        });

        return { success: true, message: "Rutina cancelada" };
    }
}

export default new ActiveRoutineService();
