import { prisma } from "../config/prisma.js";

class FolderService {
    async getAll(userId) {
        const folders = await prisma.folder.findMany({
            where: { userId },
            include: {
                routines: {
                    orderBy: { createdAt: "desc" },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        return folders;
    }

    async getById(id, userId) {
        const folder = await prisma.folder.findFirst({
            where: { id, userId },
            include: {
                routines: {
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        if (!folder) {
            const error = new Error("Carpeta no encontrada");
            error.statusCode = 404;
            throw error;
        }

        return folder;
    }

    async create(name, description, userId) {
        const folder = await prisma.folder.create({
            data: {
                name,
                description,
                userId,
            },
            include: {
                routines: true,
            },
        });

        return folder;
    }

    async update(id, name, description, userId) {
        const existingFolder = await prisma.folder.findFirst({
            where: { id, userId },
        });

        if (!existingFolder) {
            const error = new Error("Carpeta no encontrada");
            error.statusCode = 404;
            throw error;
        }

        const folder = await prisma.folder.update({
            where: { id },
            data: {
                name,
                description,
            },
            include: {
                routines: true,
            },
        });

        return folder;
    }

    async delete(id, userId) {
        const existingFolder = await prisma.folder.findFirst({
            where: { id, userId },
        });

        if (!existingFolder) {
            const error = new Error("Carpeta no encontrada");
            error.statusCode = 404;
            throw error;
        }

        await prisma.folder.delete({
            where: { id },
        });

        return { message: "Carpeta eliminada exitosamente" };
    }
}

export default new FolderService();
