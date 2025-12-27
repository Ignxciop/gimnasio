import { prisma } from "../config/prisma.js";

class StatisticsService {
    async getWeeklySets(userId, startDate, endDate) {
        const sets = await prisma.activeRoutineSet.findMany({
            where: {
                activeRoutine: {
                    userId: userId,
                    endTime: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
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
