import muscleGroupService from "../services/muscleGroupService.js";

class MuscleGroupController {
    async getAll(req, res, next) {
        try {
            const muscleGroups = await muscleGroupService.getAll();

            res.status(200).json({
                success: true,
                data: muscleGroups,
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const muscleGroup = await muscleGroupService.getById(id);

            res.status(200).json({
                success: true,
                data: muscleGroup,
            });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const { name } = req.body;
            const muscleGroup = await muscleGroupService.create(name);

            res.status(201).json({
                success: true,
                message: "Grupo muscular creado exitosamente",
                data: muscleGroup,
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const { name } = req.body;
            const muscleGroup = await muscleGroupService.update(id, name);

            res.status(200).json({
                success: true,
                message: "Grupo muscular actualizado exitosamente",
                data: muscleGroup,
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const result = await muscleGroupService.delete(id);

            res.status(200).json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new MuscleGroupController();
