import express from "express";
import feedbackController from "../controllers/feedbackController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { createFeedbackValidation } from "../validators/feedbackValidator.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    createFeedbackValidation,
    feedbackController.createFeedback
);

router.get(
    "/my-feedbacks",
    authMiddleware,
    feedbackController.getUserFeedbacks
);

router.get("/all", authMiddleware, feedbackController.getAllFeedbacks);

router.patch(
    "/:id/status",
    authMiddleware,
    feedbackController.updateFeedbackStatus
);

export default router;
