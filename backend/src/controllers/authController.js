import userService from "../services/userService.js";
import authService from "../services/authService.js";

class AuthController {
    async register(req, res, next) {
        try {
            const { name, lastname, username, email, password, roleId } =
                req.body;

            const user = await userService.createUser({
                name,
                lastname,
                username,
                email,
                password,
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

            res.status(200).json({
                success: true,
                message: "Inicio de sesión exitoso",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();
