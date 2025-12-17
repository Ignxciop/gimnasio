import { prisma } from "../config/prisma.js";

class EquipmentService {
    async getAll() {
        const equipment = await prisma.equipment.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return equipment;
    }

    async getById(id) {
        const equipment = await prisma.equipment.findUnique({
            where: { id },
        });

        if (!equipment) {
            const error = new Error("Equipamiento no encontrado");
            error.statusCode = 404;
            throw error;
        }

        return equipment;
    }

    async create(name) {
        const existingEquipment = await prisma.equipment.findUnique({
            where: { name },
        });

        if (existingEquipment) {
            const error = new Error("Ya existe un equipamiento con ese nombre");
            error.statusCode = 400;
            throw error;
        }

        const equipment = await prisma.equipment.create({
            data: { name },
        });

        return equipment;
    }

    async update(id, name) {
        const existingEquipment = await prisma.equipment.findUnique({
            where: { id },
        });

        if (!existingEquipment) {
            const error = new Error("Equipamiento no encontrado");
            error.statusCode = 404;
            throw error;
        }

        const nameExists = await prisma.equipment.findFirst({
            where: {
                name,
                NOT: { id },
            },
        });

        if (nameExists) {
            const error = new Error("Ya existe un equipamiento con ese nombre");
            error.statusCode = 400;
            throw error;
        }

        const equipment = await prisma.equipment.update({
            where: { id },
            data: { name },
        });

        return equipment;
    }

    async delete(id) {
        const existingEquipment = await prisma.equipment.findUnique({
            where: { id },
        });

        if (!existingEquipment) {
            const error = new Error("Equipamiento no encontrado");
            error.statusCode = 404;
            throw error;
        }

        await prisma.equipment.delete({
            where: { id },
        });

        return { message: "Equipamiento eliminado exitosamente" };
    }
}

export default new EquipmentService();
