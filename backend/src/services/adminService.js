import { prisma } from "../config/prisma.js";

class AdminService {
    async getAllUsers() {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                lastname: true,
                username: true,
                email: true,
                is_active: true,
                role_id: true,
                role: {
                    select: {
                        id: true,
                        role: true,
                    },
                },
                created_at: true,
            },
            orderBy: {
                created_at: "desc",
            },
        });

        return users;
    }

    async updateUserRole(userId, roleId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            const error = new Error("Usuario no encontrado");
            error.statusCode = 404;
            throw error;
        }

        const role = await prisma.role.findUnique({
            where: { id: roleId },
        });

        if (!role) {
            const error = new Error("Rol no encontrado");
            error.statusCode = 404;
            throw error;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role_id: roleId },
            select: {
                id: true,
                name: true,
                lastname: true,
                username: true,
                email: true,
                is_active: true,
                role_id: true,
                role: {
                    select: {
                        id: true,
                        role: true,
                    },
                },
            },
        });

        return updatedUser;
    }

    async updateUserStatus(userId, isActive) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            const error = new Error("Usuario no encontrado");
            error.statusCode = 404;
            throw error;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { is_active: isActive },
            select: {
                id: true,
                name: true,
                lastname: true,
                username: true,
                email: true,
                is_active: true,
                role_id: true,
                role: {
                    select: {
                        id: true,
                        role: true,
                    },
                },
            },
        });

        return updatedUser;
    }
}

export default new AdminService();
