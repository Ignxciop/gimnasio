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

    async addSet(exerciseId, userId) {
        const activeRoutine = await this.getActiveByUser(userId);

        if (!activeRoutine) {
            const error = new Error("No tienes rutina activa");
            error.statusCode = 404;
            throw error;
        }

        const exerciseSets = activeRoutine.sets.filter(
            (s) => s.exerciseId === exerciseId
        );

        if (exerciseSets.length === 0) {
            const error = new Error("Ejercicio no encontrado en la rutina");
            error.statusCode = 404;
            throw error;
        }

        const lastSet = exerciseSets[exerciseSets.length - 1];
        const maxOrder = Math.max(...activeRoutine.sets.map((s) => s.order));

        const newSet = await prisma.activeRoutineSet.create({
            data: {
                activeRoutineId: activeRoutine.id,
                exerciseId,
                setNumber: exerciseSets.length + 1,
                targetWeight: lastSet.targetWeight,
                targetRepsMin: lastSet.targetRepsMin,
                targetRepsMax: lastSet.targetRepsMax,
                order: maxOrder + 1,
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

        return newSet;
    }

    async removeSet(setId, userId) {
        const set = await prisma.activeRoutineSet.findFirst({
            where: {
                id: setId,
                activeRoutine: {
                    userId,
                    status: "active",
                },
            },
            include: {
                activeRoutine: {
                    include: {
                        sets: {
                            where: {
                                exerciseId:
                                    prisma.activeRoutineSet.fields.exerciseId,
                            },
                        },
                    },
                },
            },
        });

        if (!set) {
            const error = new Error("Serie no encontrada");
            error.statusCode = 404;
            throw error;
        }

        const exerciseSets = await prisma.activeRoutineSet.findMany({
            where: {
                activeRoutineId: set.activeRoutineId,
                exerciseId: set.exerciseId,
            },
        });

        if (exerciseSets.length <= 1) {
            const error = new Error(
                "No puedes eliminar la única serie del ejercicio"
            );
            error.statusCode = 400;
            throw error;
        }

        await prisma.activeRoutineSet.delete({
            where: { id: setId },
        });

        const remainingSets = await prisma.activeRoutineSet.findMany({
            where: {
                activeRoutineId: set.activeRoutineId,
            },
            orderBy: { order: "asc" },
        });

        const updates = remainingSets.map((s, index) =>
            prisma.activeRoutineSet.update({
                where: { id: s.id },
                data: { order: index },
            })
        );

        await prisma.$transaction(updates);

        return { message: "Serie eliminada exitosamente" };
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

    async getCompletedDates(userId, year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const completedRoutines = await prisma.activeRoutine.findMany({
            where: {
                userId,
                status: "completed",
                endTime: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                endTime: true,
            },
        });

        const dates = completedRoutines.map((routine) => {
            const date = new Date(routine.endTime);
            return date.getDate();
        });

        return [...new Set(dates)];
    }

    async getRecentCompleted(userId, limit = 3) {
        const completedRoutines = await prisma.activeRoutine.findMany({
            where: {
                userId,
                status: "completed",
            },
            include: {
                routine: true,
                sets: {
                    where: {
                        completed: true,
                    },
                    select: {
                        id: true,
                    },
                },
            },
            orderBy: {
                endTime: "desc",
            },
            take: limit,
        });

        return completedRoutines.map((ar) => ({
            id: ar.id,
            routineName: ar.routine.name,
            date: ar.endTime,
            duration: Math.floor(
                (new Date(ar.endTime) - new Date(ar.startTime)) / 1000
            ),
            completedSets: ar.sets.length,
        }));
    }

    async getCompletedByDate(userId, year, month, day) {
        const startDate = new Date(year, month - 1, day, 0, 0, 0);
        const endDate = new Date(year, month - 1, day, 23, 59, 59);

        const completedRoutines = await prisma.activeRoutine.findMany({
            where: {
                userId,
                status: "completed",
                endTime: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                routine: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    },
                },
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
            orderBy: {
                endTime: "desc",
            },
        });

        return completedRoutines.map((ar) => ({
            id: ar.id,
            routineId: ar.routineId,
            routineName: ar.routine.name,
            startTime: ar.startTime,
            endTime: ar.endTime,
            duration: Math.floor(
                (new Date(ar.endTime) - new Date(ar.startTime)) / 1000
            ),
            sets: ar.sets,
        }));
    }

    async getWeeklyStreak(userId) {
        const completedRoutines = await prisma.activeRoutine.findMany({
            where: {
                userId,
                status: "completed",
                endTime: { not: null },
            },
            select: {
                endTime: true,
            },
            orderBy: {
                endTime: "desc",
            },
        });

        if (completedRoutines.length === 0) {
            return { currentStreak: 0 };
        }

        const getWeekNumber = (date) => {
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);
            d.setDate(d.getDate() + 4 - (d.getDay() || 7));
            const yearStart = new Date(d.getFullYear(), 0, 1);
            const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
            return `${d.getFullYear()}-W${weekNo}`;
        };

        const workoutWeeks = new Set();
        completedRoutines.forEach((routine) => {
            const weekKey = getWeekNumber(routine.endTime);
            workoutWeeks.add(weekKey);
        });

        const sortedWeeks = Array.from(workoutWeeks).sort().reverse();

        const currentWeek = getWeekNumber(new Date());

        let streak = 0;
        let checkWeek = currentWeek;

        for (const week of sortedWeeks) {
            if (week === checkWeek) {
                streak++;
                const [year, weekNum] = checkWeek.split("-W");
                const previousWeekNum = parseInt(weekNum) - 1;
                if (previousWeekNum > 0) {
                    checkWeek = `${year}-W${previousWeekNum}`;
                } else {
                    checkWeek = `${parseInt(year) - 1}-W52`;
                }
            } else if (week < checkWeek) {
                break;
            }
        }

        return { currentStreak: streak };
    }

    async getMonthlyStats(userId, year, month) {
        const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
        const endDate = new Date(Date.UTC(year, month, 1, 0, 0, 0));

        const currentMonthRoutines = await prisma.activeRoutine.findMany({
            where: {
                userId,
                status: "completed",
                endTime: {
                    gte: startDate,
                    lt: endDate,
                },
            },
            include: {
                sets: {
                    where: {
                        completed: true,
                    },
                },
            },
        });

        const previousStartDate = new Date(
            Date.UTC(year, month - 2, 1, 0, 0, 0)
        );
        const previousEndDate = startDate;

        const previousMonthRoutines = await prisma.activeRoutine.findMany({
            where: {
                userId,
                status: "completed",
                endTime: {
                    gte: previousStartDate,
                    lt: previousEndDate,
                },
            },
            include: {
                sets: {
                    where: {
                        completed: true,
                    },
                },
            },
        });

        const calculateStats = (routines) => {
            let totalWorkouts = routines.length;
            let totalTime = 0;
            let totalVolume = 0;

            routines.forEach((routine) => {
                if (routine.startTime && routine.endTime) {
                    totalTime +=
                        (new Date(routine.endTime) -
                            new Date(routine.startTime)) /
                        1000;
                }

                routine.sets.forEach((set) => {
                    if (set.actualWeight && set.actualReps) {
                        totalVolume += set.actualWeight * set.actualReps;
                    }
                });
            });

            return {
                totalWorkouts,
                totalTime: Math.floor(totalTime),
                totalVolume: Math.floor(totalVolume),
            };
        };

        const currentStats = calculateStats(currentMonthRoutines);
        const previousStats = calculateStats(previousMonthRoutines);

        const calculateChange = (current, previous) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
        };

        return {
            current: currentStats,
            comparison: {
                workouts: calculateChange(
                    currentStats.totalWorkouts,
                    previousStats.totalWorkouts
                ),
                time: calculateChange(
                    currentStats.totalTime,
                    previousStats.totalTime
                ),
                volume: calculateChange(
                    currentStats.totalVolume,
                    previousStats.totalVolume
                ),
            },
        };
    }
}

export default new ActiveRoutineService();
