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

        const isOwnProfile = requesterId && requesterId === user.id;

        if (!user.isProfilePublic && !isOwnProfile) {
            const error = new Error("Este perfil es privado");
            error.statusCode = 403;
            throw error;
        }

        return user;
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
