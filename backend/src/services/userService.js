import bcryptjs from "bcryptjs";
import { prisma } from "../config/prisma.js";

class UserService {
    async createUser({
        name,
        lastname,
        username,
        email,
        password,
        gender,
        roleId,
    }) {
        const existingEmail = await prisma.user.findUnique({
            where: { email },
        });
        if (existingEmail) {
            // Si el usuario NO está verificado y NO tiene código activo, eliminarlo y permitir registro
            if (!existingEmail.isEmailVerified) {
                const now = new Date();
                const activeCode = await prisma.emailVerification.findFirst({
                    where: {
                        userId: existingEmail.id,
                        expiresAt: { gt: now },
                    },
                });
                if (!activeCode) {
                    // Eliminar usuario no verificado y sin código activo
                    await prisma.user.delete({
                        where: { id: existingEmail.id },
                    });
                } else {
                    const error = new Error(
                        "Ya existe un código de verificación pendiente para este usuario. Debes esperar a que expire antes de volver a registrarte.",
                    );
                    error.statusCode = 429;
                    throw error;
                }
            } else {
                const error = new Error("El email ya está registrado");
                error.statusCode = 409;
                throw error;
            }
        }

        const existingUsername = await prisma.user.findUnique({
            where: { username },
        });
        if (existingUsername) {
            const error = new Error("El nombre de usuario ya está en uso");
            error.statusCode = 409;
            throw error;
        }

        // Bloqueo: ¿hay un código de verificación activo para este email o username?
        const now = new Date();
        const pendingVerification = await prisma.emailVerification.findFirst({
            where: {
                OR: [{ user: { email } }, { user: { username } }],
                expiresAt: { gt: now },
            },
            include: { user: true },
        });
        if (pendingVerification) {
            const error = new Error(
                "Ya existe un código de verificación pendiente para este usuario. Debes esperar a que expire antes de volver a registrarte.",
            );
            error.statusCode = 429;
            throw error;
        }

        if (roleId) {
            const roleExists = await prisma.role.findUnique({
                where: { id: roleId },
            });
            if (!roleExists) {
                const error = new Error("El rol especificado no existe");
                error.statusCode = 409;
                throw error;
            }
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                lastname,
                username,
                email,
                password: hashedPassword,
                gender,
                roleId,
                is_active: true,
            },
            select: {
                id: true,
                name: true,
                lastname: true,
                username: true,
                email: true,
                gender: true,
                createdAt: true,
                is_active: true,
                role: {
                    select: {
                        id: true,
                        role: true,
                    },
                },
            },
        });

        return user;
    }
}

export default new UserService();
