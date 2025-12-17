import adminService from "../services/adminService.js";

class AdminController {
    async getUsers(req, res, next) {
        try {
            const users = await adminService.getAllUsers();

            res.status(200).json({
                success: true,
                message: "Usuarios obtenidos exitosamente",
                data: users,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateUserRole(req, res, next) {
        try {
            const { id } = req.params;
            const { roleId } = req.body;

            const user = await adminService.updateUserRole(
                parseInt(id),
                parseInt(roleId)
            );

            res.status(200).json({
                success: true,
                message: "Rol actualizado exitosamente",
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateUserStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { isActive } = req.body;

            const user = await adminService.updateUserStatus(
                parseInt(id),
                isActive
            );

            res.status(200).json({
                success: true,
                message: "Estado actualizado exitosamente",
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AdminController();
