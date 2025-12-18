import folderService from "../services/folderService.js";

class FolderController {
    async getAll(req, res, next) {
        try {
            const userId = req.user.id;
            const folders = await folderService.getAll(userId);

            res.status(200).json({
                success: true,
                data: folders,
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const userId = req.user.id;
            const folder = await folderService.getById(id, userId);

            res.status(200).json({
                success: true,
                data: folder,
            });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const { name, description } = req.body;
            const userId = req.user.id;
            const folder = await folderService.create(
                name,
                description,
                userId
            );

            res.status(201).json({
                success: true,
                message: "Carpeta creada exitosamente",
                data: folder,
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const { name, description } = req.body;
            const userId = req.user.id;
            const folder = await folderService.update(
                id,
                name,
                description,
                userId
            );

            res.status(200).json({
                success: true,
                message: "Carpeta actualizada exitosamente",
                data: folder,
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const userId = req.user.id;
            const result = await folderService.delete(id, userId);

            res.status(200).json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new FolderController();
