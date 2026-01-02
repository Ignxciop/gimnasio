import userService from "../services/userService.js";
import authService from "../services/authService.js";

class AuthController {
    async register(req, res, next) {
        try {
            const {
                name,
                lastname,
                username,
                email,
                password,
                gender,
                roleId,
            } = req.body;

            const user = await userService.createUser({
                name,
                lastname,
                username,
                email,
                password,
                gender,
                roleId: roleId ? parseInt(roleId) : 3,
            });

            res.status(201).json({
                success: true,
                message: "Usuario registrado exitosamente",
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            const result = await authService.login({ email, password });

            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(200).json({
                success: true,
                message: "Inicio de sesión exitoso",
                data: {
                    user: result.user,
                    accessToken: result.accessToken,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async refresh(req, res, next) {
        try {
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                return res.status(401).json({
                    success: false,
                    error: "Refresh token no proporcionado",
                });
            }

            const result = await authService.refresh(refreshToken);

            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(200).json({
                success: true,
                message: "Token renovado exitosamente",
                data: {
                    accessToken: result.accessToken,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async logout(req, res, next) {
        try {
            const refreshToken = req.cookies.refreshToken;

            await authService.logout(refreshToken);

            res.clearCookie("refreshToken");

            res.status(200).json({
                success: true,
                message: "Sesión cerrada exitosamente",
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();
