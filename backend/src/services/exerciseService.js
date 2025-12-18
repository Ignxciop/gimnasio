import { prisma } from "../config/prisma.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        secondaryMuscleGroupIds = [],
        videoPath = null
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
                videoPath,
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
        secondaryMuscleGroupIds = [],
        videoPath = null
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

        if (videoPath && existingExercise.videoPath) {
            const oldVideoPath = path.join(
                __dirname,
                "../../resources/examples_exercises",
                existingExercise.videoPath
            );
            if (fs.existsSync(oldVideoPath)) {
                fs.unlinkSync(oldVideoPath);
            }
        }

        const exercise = await prisma.exercise.update({
            where: { id },
            data: {
                name,
                equipmentId,
                muscleGroupId,
                ...(videoPath && { videoPath }),
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

        if (existingExercise.videoPath) {
            const videoPath = path.join(
                __dirname,
                "../../resources/examples_exercises",
                existingExercise.videoPath
            );
            if (fs.existsSync(videoPath)) {
                fs.unlinkSync(videoPath);
            }
        }

        await prisma.exercise.delete({
            where: { id },
        });

        return { message: "Ejercicio eliminado exitosamente" };
    }
}

export default new ExerciseService();
