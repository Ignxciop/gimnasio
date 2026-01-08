import express from "express";
import activeRoutineController from "../controllers/activeRoutineController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { readLimiter, writeLimiter } from "../config/rateLimiter.js";
import { validationResult } from "express-validator";
import {
    createActiveRoutineValidation,
    updateSetValidation,
    reorderSetsValidation,
    addSetValidation,
} from "../validators/activeRoutineValidator.js";

const router = express.Router();

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map((error) => ({
                field: error.path,
                message: error.msg,
            })),
        });
    }
    next();
};

router.get(
    "/active",
    readLimiter,
    authenticate,
    activeRoutineController.getActive
);

router.post(
    "/",
    writeLimiter,
    authenticate,
    createActiveRoutineValidation,
    handleValidationErrors,
    activeRoutineController.create
);

router.put(
    "/sets/:setId",
    writeLimiter,
    authenticate,
    updateSetValidation,
    handleValidationErrors,
    activeRoutineController.updateSet
);

router.delete(
    "/sets/:setId/complete",
    writeLimiter,
    authenticate,
    activeRoutineController.uncompleteSet
);

router.put(
    "/reorder",
    writeLimiter,
    authenticate,
    reorderSetsValidation,
    handleValidationErrors,
    activeRoutineController.reorderSets
);

router.post(
    "/:id/complete",
    writeLimiter,
    authenticate,
    activeRoutineController.complete
);

router.delete(
    "/:id/cancel",
    writeLimiter,
    authenticate,
    activeRoutineController.cancel
);

router.delete(
    "/completed/:id",
    writeLimiter,
    authenticate,
    activeRoutineController.deleteCompleted
);

router.post(
    "/sets",
    writeLimiter,
    authenticate,
    addSetValidation,
    handleValidationErrors,
    activeRoutineController.addSet
);

router.delete(
    "/sets/:setId",
    writeLimiter,
    authenticate,
    activeRoutineController.removeSet
);

router.get(
    "/completed/dates",
    readLimiter,
    authenticate,
    activeRoutineController.getCompletedDates
);

router.get(
    "/completed/recent",
    readLimiter,
    authenticate,
    activeRoutineController.getRecentCompleted
);

router.get(
    "/completed/by-date",
    readLimiter,
    authenticate,
    activeRoutineController.getCompletedByDate
);

router.get(
    "/streak/weekly",
    readLimiter,
    authenticate,
    activeRoutineController.getWeeklyStreak
);

router.get(
    "/stats/monthly",
    readLimiter,
    authenticate,
    activeRoutineController.getMonthlyStats
);

export default router;
