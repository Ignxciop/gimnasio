import equipmentService from "../services/equipmentService.js";

class EquipmentController {
    async getAll(req, res, next) {
        try {
            const equipment = await equipmentService.getAll();

            res.status(200).json({
                success: true,
                data: equipment,
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const equipment = await equipmentService.getById(id);

            res.status(200).json({
                success: true,
                data: equipment,
            });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const { name } = req.body;
            const equipment = await equipmentService.create(name);

            res.status(201).json({
                success: true,
                message: "Equipamiento creado exitosamente",
                data: equipment,
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const { name } = req.body;
            const equipment = await equipmentService.update(id, name);

            res.status(200).json({
                success: true,
                message: "Equipamiento actualizado exitosamente",
                data: equipment,
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const result = await equipmentService.delete(id);

            res.status(200).json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new EquipmentController();
