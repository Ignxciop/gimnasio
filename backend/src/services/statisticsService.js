import { prisma } from "../config/prisma.js";

class StatisticsService {
    async getMonthlySets(userId, year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const sets = await prisma.activeRoutineSet.findMany({
            where: {
                activeRoutine: {
                    userId: userId,
                    endTime: {
                        gte: startDate,
                        lte: endDate,
                    },
                    status: "completed",
                },
            },
            select: {
                id: true,
                exerciseId: true,
                targetWeight: true,
                targetRepsMin: true,
                targetRepsMax: true,
                actualWeight: true,
                actualReps: true,
                completed: true,
            },
        });

        return sets;
    }

    async getMonthsWithWorkouts(userId) {
        const workouts = await prisma.activeRoutine.findMany({
            where: {
                userId: userId,
                status: "completed",
                endTime: {
                    not: null,
                },
            },
            select: {
                endTime: true,
            },
            orderBy: {
                endTime: "desc",
            },
        });

        const monthsSet = new Set();
        workouts.forEach((workout) => {
            if (workout.endTime) {
                const date = new Date(workout.endTime);
                const monthKey = `${date.getFullYear()}-${String(
                    date.getMonth() + 1
                ).padStart(2, "0")}`;
                monthsSet.add(monthKey);
            }
        });

        return Array.from(monthsSet).sort().reverse();
    }

    async getAllExercises() {
        const exercises = await prisma.exercise.findMany({
            select: {
                id: true,
                name: true,
                muscleGroup: {
                    select: {
                        name: true,
                    },
                },
                secondaryMuscleGroups: {
                    select: {
                        muscleGroup: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        return exercises;
    }
}

export default new StatisticsService();
