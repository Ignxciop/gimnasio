import { prisma } from "../config/prisma.js";

class RoutineService {
    async getAll(userId) {
        const routines = await prisma.routine.findMany({
            where: { userId },
            include: {
                folder: true,
            },
            orderBy: { order: "asc" },
        });
        return routines;
    }

    async getById(id, userId) {
        const routine = await prisma.routine.findFirst({
            where: { id, userId },
            include: {
                folder: true,
            },
        });

        if (!routine) {
            const error = new Error("Rutina no encontrada");
            error.statusCode = 404;
            throw error;
        }

        return routine;
    }

    async create(name, description, folderId, userId) {
        if (folderId) {
            const folder = await prisma.folder.findFirst({
                where: { id: folderId, userId },
            });

            if (!folder) {
                const error = new Error("Carpeta no encontrada");
                error.statusCode = 404;
                throw error;
            }
        }

        const maxOrder = await prisma.routine.findFirst({
            where: { userId, folderId },
            orderBy: { order: "desc" },
            select: { order: true },
        });

        const routine = await prisma.routine.create({
            data: {
                name,
                description,
                folderId,
                userId,
                order: maxOrder ? maxOrder.order + 1 : 0,
            },
            include: {
                folder: true,
            },
        });

        return routine;
    }

    async update(id, name, description, folderId, userId) {
        const existingRoutine = await prisma.routine.findFirst({
            where: { id, userId },
        });

        if (!existingRoutine) {
            const error = new Error("Rutina no encontrada");
            error.statusCode = 404;
            throw error;
        }

        if (folderId) {
            const folder = await prisma.folder.findFirst({
                where: { id: folderId, userId },
            });

            if (!folder) {
                const error = new Error("Carpeta no encontrada");
                error.statusCode = 404;
                throw error;
            }
        }

        const routine = await prisma.routine.update({
            where: { id },
            data: {
                name,
                description,
                folderId,
            },
            include: {
                folder: true,
            },
        });

        return routine;
    }

    async move(id, folderId, userId) {
        const existingRoutine = await prisma.routine.findFirst({
            where: { id, userId },
        });

        if (!existingRoutine) {
            const error = new Error("Rutina no encontrada");
            error.statusCode = 404;
            throw error;
        }

        if (folderId) {
            const folder = await prisma.folder.findFirst({
                where: { id: folderId, userId },
            });

            if (!folder) {
                const error = new Error("Carpeta no encontrada");
                error.statusCode = 404;
                throw error;
            }
        }

        const maxOrder = await prisma.routine.findFirst({
            where: { userId, folderId },
            orderBy: { order: "desc" },
            select: { order: true },
        });

        const routine = await prisma.routine.update({
            where: { id },
            data: {
                folderId,
                order: maxOrder ? maxOrder.order + 1 : 0,
            },
            include: {
                folder: true,
            },
        });

        return routine;
    }

    async delete(id, userId) {
        const existingRoutine = await prisma.routine.findFirst({
            where: { id, userId },
        });

        if (!existingRoutine) {
            const error = new Error("Rutina no encontrada");
            error.statusCode = 404;
            throw error;
        }

        await prisma.routine.delete({
            where: { id },
        });

        return { message: "Rutina eliminada exitosamente" };
    }

    async reorder(items, userId) {
        const updates = items.map(async (item) => {
            const routine = await prisma.routine.findFirst({
                where: { id: item.id, userId },
            });

            if (!routine) {
                return null;
            }

            const updateData = { order: item.order };
            if (item.folderId !== undefined) {
                updateData.folderId = item.folderId;
            }

            return prisma.routine.update({
                where: { id: item.id },
                data: updateData,
            });
        });

        await Promise.all(updates);

        return { message: "Orden actualizado exitosamente" };
    }
}

export default new RoutineService();
