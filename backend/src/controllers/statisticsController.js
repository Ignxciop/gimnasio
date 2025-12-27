import statisticsService from "../services/statisticsService.js";

class StatisticsController {
    async getMonthlySets(req, res, next) {
        try {
            const { userId, year, month } = req.query;

            if (!userId || !year || !month) {
                const error = new Error("userId, year y month son requeridos");
                error.statusCode = 400;
                throw error;
            }

            const sets = await statisticsService.getMonthlySets(
                userId,
                parseInt(year),
                parseInt(month)
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

            const months = await statisticsService.getMonthsWithWorkouts(
                userId
            );

            res.status(200).json({
                success: true,
                data: months,
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
