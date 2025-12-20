import { prisma } from "../config/prisma.js";

class FolderService {
    async getAll(userId) {
        const folders = await prisma.folder.findMany({
            where: { userId },
            include: {
                routines: {
                    orderBy: { order: "asc" },
                },
            },
            orderBy: { order: "asc" },
        });
        return folders;
    }

    async getById(id, userId) {
        const folder = await prisma.folder.findFirst({
            where: { id, userId },
            include: {
                routines: {
                    orderBy: { order: "asc" },
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
        const maxOrder = await prisma.folder.findFirst({
            where: { userId },
            orderBy: { order: "desc" },
            select: { order: true },
        });

        const folder = await prisma.folder.create({
            data: {
                name,
                description,
                userId,
                order: maxOrder ? maxOrder.order + 1 : 0,
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

    async reorder(items, userId) {
        const updates = items.map((item) =>
            prisma.folder.updateMany({
                where: { id: item.id, userId },
                data: { order: item.order },
            })
        );

        await prisma.$transaction(updates);

        return { message: "Orden actualizado exitosamente" };
    }
}

export default new FolderService();
