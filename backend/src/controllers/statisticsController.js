import statisticsService from "../services/statisticsService.js";

class StatisticsController {
    async getWeeklySets(req, res, next) {
        try {
            const { userId, startDate, endDate } = req.query;

            if (!userId || !startDate || !endDate) {
                const error = new Error(
                    "userId, startDate y endDate son requeridos"
                );
                error.statusCode = 400;
                throw error;
            }

            const sets = await statisticsService.getWeeklySets(
                userId,
                startDate,
                endDate
            );

            res.status(200).json({
                success: true,
                data: sets,
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
