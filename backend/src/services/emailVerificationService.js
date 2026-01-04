import { prisma } from "../config/prisma.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { emailService } from "./emailService.js";

const CODE_EXPIRATION_MINUTES = 5;
const MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW = 60 * 1000;

class EmailVerificationService {
    generateCode() {
        return crypto.randomInt(100000, 999999).toString();
    }

    async createVerification(userId, userName, userEmail) {
        await prisma.emailVerification.deleteMany({
            where: { userId },
        });

        const code = this.generateCode();
        const codeHash = await bcrypt.hash(code, 10);
        const expiresAt = new Date(
            Date.now() + CODE_EXPIRATION_MINUTES * 60 * 1000
        );

        const verification = await prisma.emailVerification.create({
            data: {
                userId,
                codeHash,
                expiresAt,
            },
        });

        await emailService.sendVerificationCode(userEmail, code, userName);

        return verification;
    }

    async verifyCode(userId, code) {
        const verification = await prisma.emailVerification.findFirst({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        if (!verification) {
            const error = new Error("No se encontró código de verificación");
            error.statusCode = 404;
            throw error;
        }

        if (verification.attempts >= MAX_ATTEMPTS) {
            const error = new Error(
                "Límite de intentos excedido. Solicita un nuevo código"
            );
            error.statusCode = 429;
            throw error;
        }

        if (new Date() > verification.expiresAt) {
            const error = new Error(
                "El código ha expirado. Solicita uno nuevo"
            );
            error.statusCode = 410;
            throw error;
        }

        await prisma.emailVerification.update({
            where: { id: verification.id },
            data: { attempts: verification.attempts + 1 },
        });

        const isValid = await bcrypt.compare(code, verification.codeHash);

        if (!isValid) {
            const remainingAttempts =
                MAX_ATTEMPTS - (verification.attempts + 1);
            const error = new Error(
                `Código incorrecto. Te quedan ${remainingAttempts} intentos`
            );
            error.statusCode = 400;
            throw error;
        }

        await prisma.user.update({
            where: { id: userId },
            data: { isEmailVerified: true },
        });

        await prisma.emailVerification.deleteMany({
            where: { userId },
        });

        return true;
    }

    async resendCode(userId) {
        const recentVerification = await prisma.emailVerification.findFirst({
            where: {
                userId,
                createdAt: {
                    gte: new Date(Date.now() - RATE_LIMIT_WINDOW),
                },
            },
        });

        if (recentVerification) {
            const error = new Error(
                "Debes esperar 1 minuto antes de solicitar otro código"
            );
            error.statusCode = 429;
            throw error;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            const error = new Error("Usuario no encontrado");
            error.statusCode = 404;
            throw error;
        }

        if (user.isEmailVerified) {
            const error = new Error("El correo ya está verificado");
            error.statusCode = 400;
            throw error;
        }

        return await this.createVerification(userId, user.name, user.email);
    }

    async cleanExpiredVerifications() {
        await prisma.emailVerification.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });
    }
}

export default new EmailVerificationService();
