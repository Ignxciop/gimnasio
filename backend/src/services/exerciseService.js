import { prisma } from "../config/prisma.js";

class ExerciseService {
    async getAll() {
        const exercises = await prisma.exercise.findMany({
            include: {
                equipment: true,
                muscleGroup: true,
                secondaryMuscleGroups: {
                    include: {
                        muscleGroup: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return exercises;
    }

    async getById(id) {
        const exercise = await prisma.exercise.findUnique({
            where: { id },
            include: {
                equipment: true,
                muscleGroup: true,
                secondaryMuscleGroups: {
                    include: {
                        muscleGroup: true,
                    },
                },
            },
        });

        if (!exercise) {
            const error = new Error("Ejercicio no encontrado");
            error.statusCode = 404;
            throw error;
        }

        return exercise;
    }

    async create(
        name,
        equipmentId,
        muscleGroupId,
        secondaryMuscleGroupIds = []
    ) {
        const existingExercise = await prisma.exercise.findUnique({
            where: { name },
        });

        if (existingExercise) {
            const error = new Error("Ya existe un ejercicio con ese nombre");
            error.statusCode = 400;
            throw error;
        }

        const equipment = await prisma.equipment.findUnique({
            where: { id: equipmentId },
        });

        if (!equipment) {
            const error = new Error("Equipamiento no encontrado");
            error.statusCode = 404;
            throw error;
        }

        const muscleGroup = await prisma.muscleGroup.findUnique({
            where: { id: muscleGroupId },
        });

        if (!muscleGroup) {
            const error = new Error("Grupo muscular no encontrado");
            error.statusCode = 404;
            throw error;
        }

        const exercise = await prisma.exercise.create({
            data: {
                name,
                equipmentId,
                muscleGroupId,
                secondaryMuscleGroups: {
                    create: secondaryMuscleGroupIds
                        .filter((id) => id !== muscleGroupId)
                        .map((muscleGroupId) => ({ muscleGroupId })),
                },
            },
            include: {
                equipment: true,
                muscleGroup: true,
                secondaryMuscleGroups: {
                    include: {
                        muscleGroup: true,
                    },
                },
            },
        });

        return exercise;
    }

    async update(
        id,
        name,
        equipmentId,
        muscleGroupId,
        secondaryMuscleGroupIds = []
    ) {
        const existingExercise = await prisma.exercise.findUnique({
            where: { id },
        });

        if (!existingExercise) {
            const error = new Error("Ejercicio no encontrado");
            error.statusCode = 404;
            throw error;
        }

        const nameExists = await prisma.exercise.findFirst({
            where: {
                name,
                NOT: { id },
            },
        });

        if (nameExists) {
            const error = new Error("Ya existe un ejercicio con ese nombre");
            error.statusCode = 400;
            throw error;
        }

        const equipment = await prisma.equipment.findUnique({
            where: { id: equipmentId },
        });

        if (!equipment) {
            const error = new Error("Equipamiento no encontrado");
            error.statusCode = 404;
            throw error;
        }

        const muscleGroup = await prisma.muscleGroup.findUnique({
            where: { id: muscleGroupId },
        });

        if (!muscleGroup) {
            const error = new Error("Grupo muscular no encontrado");
            error.statusCode = 404;
            throw error;
        }

        const exercise = await prisma.exercise.update({
            where: { id },
            data: {
                name,
                equipmentId,
                muscleGroupId,
                secondaryMuscleGroups: {
                    deleteMany: {},
                    create: secondaryMuscleGroupIds
                        .filter((mgId) => mgId !== muscleGroupId)
                        .map((muscleGroupId) => ({ muscleGroupId })),
                },
            },
            include: {
                equipment: true,
                muscleGroup: true,
                secondaryMuscleGroups: {
                    include: {
                        muscleGroup: true,
                    },
                },
            },
        });

        return exercise;
    }

    async delete(id) {
        const existingExercise = await prisma.exercise.findUnique({
            where: { id },
        });

        if (!existingExercise) {
            const error = new Error("Ejercicio no encontrado");
            error.statusCode = 404;
            throw error;
        }

        await prisma.exercise.delete({
            where: { id },
        });

        return { message: "Ejercicio eliminado exitosamente" };
    }
}

export default new ExerciseService();
