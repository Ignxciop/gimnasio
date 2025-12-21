import activeRoutineService from "../services/activeRoutineService.js";

class ActiveRoutineController {
    async getActive(req, res, next) {
        try {
            const userId = req.user.userId;
            const activeRoutine = await activeRoutineService.getActiveByUser(
                userId
            );

            res.status(200).json({
                success: true,
                data: activeRoutine,
            });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const { routineId } = req.body;
            const userId = req.user.userId;

            const activeRoutine = await activeRoutineService.create(
                routineId,
                userId
            );

            res.status(201).json({
                success: true,
                message: "Rutina activa iniciada exitosamente",
                data: activeRoutine,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateSet(req, res, next) {
        try {
            const setId = parseInt(req.params.setId);
            const { actualWeight, actualReps } = req.body;
            const userId = req.user.userId;

            const updatedSet = await activeRoutineService.updateSet(
                setId,
                actualWeight || null,
                actualReps,
                userId
            );

            res.status(200).json({
                success: true,
                message: "Serie actualizada exitosamente",
                data: updatedSet,
            });
        } catch (error) {
            next(error);
        }
    }

    async reorderSets(req, res, next) {
        try {
            const { setIds } = req.body;
            const userId = req.user.userId;

            const result = await activeRoutineService.reorderSets(
                setIds,
                userId
            );

            res.status(200).json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            next(error);
        }
    }

    async complete(req, res, next) {
        try {
            const activeRoutineId = parseInt(req.params.id);
            const userId = req.user.userId;

            const completedRoutine = await activeRoutineService.complete(
                activeRoutineId,
                userId
            );

            res.status(200).json({
                success: true,
                message: "Rutina completada exitosamente",
                data: completedRoutine,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new ActiveRoutineController();
