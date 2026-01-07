import bcryptjs from "bcryptjs";
import { prisma } from "../config/prisma.js";
import {
    generateToken,
    generateRefreshToken,
    verifyToken,
    verifyRefreshToken,
    hashToken,
} from "../config/jwt.js";

class AuthService {
    async login({ emailOrUsername, password }) {
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
            },
            select: {
                id: true,
                name: true,
                lastname: true,
                username: true,
                email: true,
                password: true,
                gender: true,
                preferredUnit: true,
                is_active: true,
                roleId: true,
                role: {
                    select: {
                        id: true,
                        role: true,
                    },
                },
            },
        });

        if (!user) {
            const error = new Error("Credenciales inválidas");
            error.statusCode = 401;
            throw error;
        }

        if (!user.is_active) {
            const error = new Error("Usuario inactivo");
            error.statusCode = 403;
            throw error;
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            const error = new Error("Credenciales inválidas");
            error.statusCode = 401;
            throw error;
        }

        const accessToken = generateToken({
            userId: user.id,
            email: user.email,
            roleId: user.roleId,
            username: user.username,
        });

        const refreshToken = generateRefreshToken({
            userId: user.id,
        });

        const tokenHash = hashToken(refreshToken);

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await prisma.refreshToken.create({
            data: {
                tokenHash,
                userId: user.id,
                expiresAt,
            },
        });

        const { password: _, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            accessToken,
            refreshToken,
        };
    }

    async refresh(refreshToken) {
        const decoded = verifyRefreshToken(refreshToken);

        if (!decoded || !decoded.userId) {
            const error = new Error("Refresh token inválido");
            error.statusCode = 401;
            throw error;
        }

        const tokenHash = hashToken(refreshToken);

        const storedToken = await prisma.refreshToken.findFirst({
            where: {
                tokenHash,
                userId: decoded.userId,
                expiresAt: {
                    gt: new Date(),
                },
            },
        });

        if (!storedToken) {
            await prisma.refreshToken.deleteMany({
                where: { userId: decoded.userId },
            });

            const error = new Error(
                "Refresh token inválido o reusado. Sesión cerrada por seguridad"
            );
            error.statusCode = 401;
            throw error;
        }

        await prisma.refreshToken.delete({
            where: {
                id: storedToken.id,
            },
        });

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                roleId: true,
                username: true,
                is_active: true,
            },
        });

        if (!user || !user.is_active) {
            const error = new Error("Usuario no encontrado o inactivo");
            error.statusCode = 401;
            throw error;
        }

        const newAccessToken = generateToken({
            userId: user.id,
            email: user.email,
            roleId: user.roleId,
            username: user.username,
        });

        const newRefreshToken = generateRefreshToken({
            userId: user.id,
        });

        const newTokenHash = hashToken(newRefreshToken);

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await prisma.refreshToken.create({
            data: {
                tokenHash: newTokenHash,
                userId: user.id,
                expiresAt,
            },
        });

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    }

    async logout(refreshToken) {
        if (!refreshToken) {
            return;
        }

        const tokenHash = hashToken(refreshToken);

        await prisma.refreshToken.deleteMany({
            where: {
                tokenHash,
            },
        });
    }

    async cleanupExpiredTokens() {
        await prisma.refreshToken.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });
    }
}

export default new AuthService();
