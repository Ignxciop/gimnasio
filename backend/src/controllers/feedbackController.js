import feedbackService from "../services/feedbackService.js";

export const createFeedback = async (req, res, next) => {
    try {
        const { type, title, description } = req.body;
        const userId = req.user.userId;

        const feedback = await feedbackService.createFeedback(
            userId,
            type,
            description,
            title
        );

        res.status(201).json({
            success: true,
            message:
                type === "suggestion"
                    ? "Sugerencia enviada correctamente"
                    : "Reporte enviado correctamente",
            data: feedback,
        });
    } catch (error) {
        next(error);
    }
};

export const getUserFeedbacks = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const feedbacks = await feedbackService.getUserFeedbacks(userId);

        res.status(200).json({
            success: true,
            data: feedbacks,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllFeedbacks = async (req, res, next) => {
    try {
        const { type, status } = req.query;
        const feedbacks = await feedbackService.getAllFeedbacks(type, status);

        res.status(200).json({
            success: true,
            data: feedbacks,
        });
    } catch (error) {
        next(error);
    }
};

export const updateFeedbackStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const feedback = await feedbackService.updateFeedbackStatus(
            parseInt(id),
            status
        );

        res.status(200).json({
            success: true,
            message: "Estado actualizado correctamente",
            data: feedback,
        });
    } catch (error) {
        next(error);
    }
};

export default {
    createFeedback,
    getUserFeedbacks,
    getAllFeedbacks,
    updateFeedbackStatus,
};
