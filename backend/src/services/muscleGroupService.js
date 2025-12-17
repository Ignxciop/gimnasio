import { prisma } from "../config/prisma.js";

class MuscleGroupService {
    async getAll() {
        const muscleGroups = await prisma.muscleGroup.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return muscleGroups;
    }

    async getById(id) {
        const muscleGroup = await prisma.muscleGroup.findUnique({
            where: { id },
        });

        if (!muscleGroup) {
            const error = new Error("Grupo muscular no encontrado");
            error.statusCode = 404;
            throw error;
        }

        return muscleGroup;
    }

    async create(name) {
        const existingMuscleGroup = await prisma.muscleGroup.findUnique({
            where: { name },
        });

        if (existingMuscleGroup) {
            const error = new Error(
                "Ya existe un grupo muscular con ese nombre"
            );
            error.statusCode = 400;
            throw error;
        }

        const muscleGroup = await prisma.muscleGroup.create({
            data: { name },
        });

        return muscleGroup;
    }

    async update(id, name) {
        const existingMuscleGroup = await prisma.muscleGroup.findUnique({
            where: { id },
        });

        if (!existingMuscleGroup) {
            const error = new Error("Grupo muscular no encontrado");
            error.statusCode = 404;
            throw error;
        }

        const nameExists = await prisma.muscleGroup.findFirst({
            where: {
                name,
                NOT: { id },
            },
        });

        if (nameExists) {
            const error = new Error(
                "Ya existe un grupo muscular con ese nombre"
            );
            error.statusCode = 400;
            throw error;
        }

        const muscleGroup = await prisma.muscleGroup.update({
            where: { id },
            data: { name },
        });

        return muscleGroup;
    }

    async delete(id) {
        const existingMuscleGroup = await prisma.muscleGroup.findUnique({
            where: { id },
        });

        if (!existingMuscleGroup) {
            const error = new Error("Grupo muscular no encontrado");
            error.statusCode = 404;
            throw error;
        }

        await prisma.muscleGroup.delete({
            where: { id },
        });

        return { message: "Grupo muscular eliminado exitosamente" };
    }
}

export default new MuscleGroupService();
