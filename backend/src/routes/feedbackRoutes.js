import express from "express";
import feedbackController from "../controllers/feedbackController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import { createFeedbackValidation } from "../validators/feedbackValidator.js";
import {
    feedbackLimiter,
    readLimiter,
    writeLimiter,
} from "../config/rateLimiter.js";

const router = express.Router();

router.post(
    "/",
    authenticate,
    feedbackLimiter,
    createFeedbackValidation,
    feedbackController.createFeedback
);

router.get(
    "/my-feedbacks",
    readLimiter,
    authenticate,
    feedbackController.getUserFeedbacks
);

router.get(
    "/all",
    readLimiter,
    authenticate,
    authorize("administrador"),
    feedbackController.getAllFeedbacks
);

router.patch(
    "/:id/status",
    writeLimiter,
    authenticate,
    authorize("administrador"),
    feedbackController.updateFeedbackStatus
);

export default router;
