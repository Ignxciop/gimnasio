import routineService from "../services/routineService.js";

class RoutineController {
    async getAll(req, res, next) {
        try {
            const userId = req.user.userId;
            const routines = await routineService.getAll(userId);

            res.status(200).json({
                success: true,
                data: routines,
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const userId = req.user.userId;
            const routine = await routineService.getById(id, userId);

            res.status(200).json({
                success: true,
                data: routine,
            });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const { name, description, folderId } = req.body;
            const userId = req.user.userId;
            const routine = await routineService.create(
                name,
                description,
                folderId || null,
                userId
            );

            res.status(201).json({
                success: true,
                message: "Rutina creada exitosamente",
                data: routine,
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const { name, description, folderId } = req.body;
            const userId = req.user.userId;
            const routine = await routineService.update(
                id,
                name,
                description,
                folderId !== undefined ? folderId : null,
                userId
            );

            res.status(200).json({
                success: true,
                message: "Rutina actualizada exitosamente",
                data: routine,
            });
        } catch (error) {
            next(error);
        }
    }

    async move(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const { folderId } = req.body;
            const userId = req.user.userId;
            const routine = await routineService.move(
                id,
                folderId || null,
                userId
            );

            res.status(200).json({
                success: true,
                message: "Rutina movida exitosamente",
                data: routine,
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const userId = req.user.userId;
            const result = await routineService.delete(id, userId);

            res.status(200).json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new RoutineController();
