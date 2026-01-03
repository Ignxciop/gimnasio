import { verifyToken } from "../config/jwt.js";

export const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                error: "Token no proporcionado",
            });
        }

        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({
                success: false,
                error: "Formato de token inválido. Use: Bearer <token>",
            });
        }

        const token = parts[1];

        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                error: "Token inválido o expirado",
            });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: "Error al autenticar",
        });
    }
};

export const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            req.user = null;
            return next();
        }

        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            req.user = null;
            return next();
        }

        const token = parts[1];
        const decoded = verifyToken(token);

        req.user = decoded || null;
        next();
    } catch (error) {
        req.user = null;
        next();
    }
};

export const authorize = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            const { roleId } = req.user;

            const { prisma } = await import("../config/prisma.js");
            const userRole = await prisma.role.findUnique({
                where: { id: roleId },
            });

            if (!userRole || !allowedRoles.includes(userRole.role)) {
                return res.status(403).json({
                    success: false,
                    error: "No tienes permisos para acceder a este recurso",
                });
            }

            next();
        } catch (error) {
            return res.status(403).json({
                success: false,
                error: "Error al verificar permisos",
            });
        }
    };
};

export default authenticate;
