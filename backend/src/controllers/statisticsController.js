import statisticsService from "../services/statisticsService.js";
import profileService from "../services/profileService.js";

class StatisticsController {
    async getMonthlySets(req, res, next) {
        try {
            const { userId, year, month } = req.query;

            if (!userId || !year || !month) {
                const error = new Error("userId, year y month son requeridos");
                error.statusCode = 400;
                throw error;
            }

            const requesterId = req.user ? req.user.userId : null;
            if (userId !== requesterId) {
                const error = new Error(
                    "No tienes permiso para consultar estos datos",
                );
                error.statusCode = 403;
                throw error;
            }

            const sets = await statisticsService.getMonthlySets(
                userId,
                parseInt(year),
                parseInt(month),
            );

            res.status(200).json({
                success: true,
                data: sets,
            });
        } catch (error) {
            next(error);
        }
    }
    async getLastCompletedSets(req, res, next) {
        try {
            const { userId, exerciseIds } = req.query;
            if (!userId || !exerciseIds) {
                const error = new Error("userId y exerciseIds son requeridos");
                error.statusCode = 400;
                throw error;
            }
            const ids = exerciseIds
                .split(",")
                .map((id) => parseInt(id))
                .filter(Boolean);

            const requesterId = req.user ? req.user.userId : null;
            if (userId !== requesterId) {
                const error = new Error(
                    "No tienes permiso para consultar estos sets previos",
                );
                error.statusCode = 403;
                throw error;
            }

            const sets = await statisticsService.getLastCompletedSets(
                userId,
                ids,
            );

            res.status(200).json({
                success: true,
                data: sets,
            });
        } catch (error) {
            next(error);
        }
    }

    async getMonthsWithWorkouts(req, res, next) {
        try {
            const { userId } = req.query;

            if (!userId) {
                const error = new Error("userId es requerido");
                error.statusCode = 400;
                throw error;
            }

            const requesterId = req.user ? req.user.userId : null;
            if (userId !== requesterId) {
                const error = new Error(
                    "No tienes permiso para consultar estos datos",
                );
                error.statusCode = 403;
                throw error;
            }

            const months =
                await statisticsService.getMonthsWithWorkouts(userId);

            res.status(200).json({
                success: true,
                data: months,
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllCompletedRoutines(req, res, next) {
        try {
            const { userId } = req.query;

            if (!userId) {
                const error = new Error("userId es requerido");
                error.statusCode = 400;
                throw error;
            }

            const requesterId = req.user ? req.user.userId : null;
            if (userId !== requesterId) {
                const error = new Error(
                    "No tienes permiso para consultar estos datos",
                );
                error.statusCode = 403;
                throw error;
            }

            const routines =
                await statisticsService.getAllCompletedRoutines(userId);

            res.status(200).json({
                success: true,
                data: routines,
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllExercises(req, res, next) {
        try {
            const exercises = await statisticsService.getAllExercises();

            res.status(200).json({
                success: true,
                data: exercises,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new StatisticsController();
