import { prisma } from "../config/prisma.js";

class ProfileService {
    async getUserProfile(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                lastname: true,
                username: true,
                email: true,
                isProfilePublic: true,
                is_active: true,
                role: {
                    select: {
                        id: true,
                        role: true,
                    },
                },
            },
        });

        if (!user) {
            const error = new Error("Usuario no encontrado");
            error.statusCode = 404;
            throw error;
        }

        return user;
    }

    async getProfileByUsername(username, requesterId = null) {
        const user = await prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                name: true,
                lastname: true,
                username: true,
                isProfilePublic: true,
                role: {
                    select: {
                        role: true,
                    },
                },
            },
        });

        if (!user) {
            const error = new Error("Usuario no encontrado");
            error.statusCode = 404;
            throw error;
        }

        const isOwnProfile = requesterId === user.id;

        if (!user.isProfilePublic && !isOwnProfile) {
            const error = new Error("Este perfil es privado");
            error.statusCode = 403;
            throw error;
        }

        return user;
    }

    async checkUsernameAvailability(username, userId = null) {
        const existingUser = await prisma.user.findUnique({
            where: { username },
            select: { id: true },
        });

        if (!existingUser) {
            return { available: true };
        }

        if (userId && existingUser.id === userId) {
            return { available: true };
        }

        return { available: false };
    }

    async updateUsername(userId, newUsername) {
        const availability = await this.checkUsernameAvailability(
            newUsername,
            userId
        );

        if (!availability.available) {
            const error = new Error("El nombre de usuario ya está en uso");
            error.statusCode = 400;
            throw error;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { username: newUsername },
            select: {
                id: true,
                name: true,
                lastname: true,
                username: true,
                email: true,
                isProfilePublic: true,
            },
        });

        return updatedUser;
    }

    async updateProfilePrivacy(userId, isPublic) {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { isProfilePublic: isPublic },
            select: {
                id: true,
                name: true,
                lastname: true,
                username: true,
                isProfilePublic: true,
            },
        });

        return updatedUser;
    }
}

export default new ProfileService();
