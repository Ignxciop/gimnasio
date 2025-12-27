import bcryptjs from "bcryptjs";
import { prisma } from "../config/prisma.js";
import { generateToken } from "../config/jwt.js";

class AuthService {
    async login({ email, password }) {
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                lastname: true,
                username: true,
                email: true,
                password: true,
                gender: true,
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

        const token = generateToken({
            userId: user.id,
            email: user.email,
            roleId: user.roleId,
            username: user.username,
        });

        // Retornar datos del usuario sin el password
        const { password: _, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            token,
        };
    }
}

export default new AuthService();
