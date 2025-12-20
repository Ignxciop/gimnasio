import routineExerciseService from "../services/routineExerciseService.js";

class RoutineExerciseController {
    async getAllByRoutine(req, res, next) {
        try {
            const routineId = parseInt(req.params.routineId);
            const userId = req.user.userId;
            const routineExercises =
                await routineExerciseService.getAllByRoutine(routineId, userId);

            res.status(200).json({
                success: true,
                data: routineExercises,
            });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const routineId = parseInt(req.params.routineId);
            const { exerciseId, sets, reps, weight, restTime } = req.body;
            const userId = req.user.userId;

            const routineExercise = await routineExerciseService.create(
                routineId,
                exerciseId,
                sets,
                reps,
                weight || null,
                restTime,
                userId
            );

            res.status(201).json({
                success: true,
                message: "Ejercicio agregado a la rutina exitosamente",
                data: routineExercise,
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const { sets, reps, weight, restTime } = req.body;
            const userId = req.user.userId;

            const routineExercise = await routineExerciseService.update(
                id,
                sets,
                reps,
                weight || null,
                restTime,
                userId
            );

            res.status(200).json({
                success: true,
                message: "Ejercicio actualizado exitosamente",
                data: routineExercise,
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const userId = req.user.userId;
            const result = await routineExerciseService.delete(id, userId);

            res.status(200).json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            next(error);
        }
    }

    async reorder(req, res, next) {
        try {
            const { items } = req.body;
            const userId = req.user.userId;
            const result = await routineExerciseService.reorder(items, userId);

            res.status(200).json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new RoutineExerciseController();
