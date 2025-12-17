import exerciseService from "../services/exerciseService.js";

class ExerciseController {
    async getAll(req, res, next) {
        try {
            const exercises = await exerciseService.getAll();

            res.status(200).json({
                success: true,
                data: exercises,
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const exercise = await exerciseService.getById(id);

            res.status(200).json({
                success: true,
                data: exercise,
            });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const { name, equipmentId, muscleGroupId } = req.body;
            const exercise = await exerciseService.create(
                name,
                equipmentId,
                muscleGroupId
            );

            res.status(201).json({
                success: true,
                message: "Ejercicio creado exitosamente",
                data: exercise,
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const { name, equipmentId, muscleGroupId } = req.body;
            const exercise = await exerciseService.update(
                id,
                name,
                equipmentId,
                muscleGroupId
            );

            res.status(200).json({
                success: true,
                message: "Ejercicio actualizado exitosamente",
                data: exercise,
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const result = await exerciseService.delete(id);

            res.status(200).json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new ExerciseController();
