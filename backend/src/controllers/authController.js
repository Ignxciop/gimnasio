import userService from "../services/userService.js";

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
                roleId: parseInt(roleId),
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
}

export default new AuthController();
