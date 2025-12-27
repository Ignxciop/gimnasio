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

    async cancel(req, res, next) {
        try {
            const activeRoutineId = parseInt(req.params.id);
            const userId = req.user.userId;

            const result = await activeRoutineService.cancel(
                activeRoutineId,
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

    async getCompletedDates(req, res, next) {
        try {
            const userId = req.user.userId;
            const { year, month } = req.query;

            const dates = await activeRoutineService.getCompletedDates(
                userId,
                parseInt(year),
                parseInt(month)
            );

            res.status(200).json({
                success: true,
                data: dates,
            });
        } catch (error) {
            next(error);
        }
    }

    async getRecentCompleted(req, res, next) {
        try {
            const userId = req.user.userId;
            const limit = req.query.limit
                ? parseInt(req.query.limit)
                : undefined;

            const recent = await activeRoutineService.getRecentCompleted(
                userId,
                limit
            );

            res.status(200).json({
                success: true,
                data: recent,
            });
        } catch (error) {
            next(error);
        }
    }

    async getCompletedByDate(req, res, next) {
        try {
            const userId = req.user.userId;
            const { year, month, day } = req.query;

            const workouts = await activeRoutineService.getCompletedByDate(
                userId,
                parseInt(year),
                parseInt(month),
                parseInt(day)
            );

            res.status(200).json({
                success: true,
                data: workouts,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new ActiveRoutineController();
