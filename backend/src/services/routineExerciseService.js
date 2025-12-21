import { prisma } from "../config/prisma.js";

class RoutineExerciseService {
    async getAllByRoutine(routineId, userId) {
        const routine = await prisma.routine.findFirst({
            where: { id: routineId, userId },
        });

        if (!routine) {
            const error = new Error("Rutina no encontrada");
            error.statusCode = 404;
            throw error;
        }

        const routineExercises = await prisma.routineExercise.findMany({
            where: { routineId },
            include: {
                exercise: {
                    include: {
                        equipment: true,
                        muscleGroup: true,
                    },
                },
            },
            orderBy: { order: "asc" },
        });

        return routineExercises;
    }

    async create(
        routineId,
        exerciseId,
        sets,
        repsMin,
        repsMax,
        weight,
        restTime,
        userId
    ) {
        const routine = await prisma.routine.findFirst({
            where: { id: routineId, userId },
        });

        if (!routine) {
            const error = new Error("Rutina no encontrada");
            error.statusCode = 404;
            throw error;
        }

        const exercise = await prisma.exercise.findUnique({
            where: { id: exerciseId },
        });

        if (!exercise) {
            const error = new Error("Ejercicio no encontrado");
            error.statusCode = 404;
            throw error;
        }

        const existing = await prisma.routineExercise.findUnique({
            where: {
                routineId_exerciseId: {
                    routineId,
                    exerciseId,
                },
            },
        });

        if (existing) {
            const error = new Error("Este ejercicio ya está en la rutina");
            error.statusCode = 400;
            throw error;
        }

        const maxOrder = await prisma.routineExercise.findFirst({
            where: { routineId },
            orderBy: { order: "desc" },
            select: { order: true },
        });

        const routineExercise = await prisma.routineExercise.create({
            data: {
                routineId,
                exerciseId,
                sets,
                repsMin,
                repsMax,
                weight,
                restTime,
                order: maxOrder ? maxOrder.order + 1 : 0,
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

        return routineExercise;
    }

    async update(id, sets, repsMin, repsMax, weight, restTime, userId) {
        const existing = await prisma.routineExercise.findFirst({
            where: {
                id,
                routine: { userId },
            },
        });

        if (!existing) {
            const error = new Error("Ejercicio no encontrado en la rutina");
            error.statusCode = 404;
            throw error;
        }

        const routineExercise = await prisma.routineExercise.update({
            where: { id },
            data: {
                sets,
                repsMin,
                repsMax,
                weight,
                restTime,
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

        return routineExercise;
    }

    async delete(id, userId) {
        const existing = await prisma.routineExercise.findFirst({
            where: {
                id,
                routine: { userId },
            },
        });

        if (!existing) {
            const error = new Error("Ejercicio no encontrado en la rutina");
            error.statusCode = 404;
            throw error;
        }

        await prisma.routineExercise.delete({
            where: { id },
        });

        return { message: "Ejercicio eliminado de la rutina exitosamente" };
    }

    async reorder(items, userId) {
        const routineExercise = await prisma.routineExercise.findFirst({
            where: {
                id: items[0].id,
                routine: { userId },
            },
        });

        if (!routineExercise) {
            const error = new Error(
                "No tienes permiso para reordenar estos ejercicios"
            );
            error.statusCode = 403;
            throw error;
        }

        const updates = items.map(async (item) => {
            return prisma.routineExercise.update({
                where: { id: item.id },
                data: { order: item.order },
            });
        });

        await Promise.all(updates);

        return { message: "Orden actualizado exitosamente" };
    }
}

export default new RoutineExerciseService();
