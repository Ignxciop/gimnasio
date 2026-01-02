import express from "express";
import activeRoutineController from "../controllers/activeRoutineController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
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

router.get("/active", authenticate, activeRoutineController.getActive);

router.post(
    "/",
    authenticate,
    createActiveRoutineValidation,
    handleValidationErrors,
    activeRoutineController.create
);

router.put(
    "/sets/:setId",
    authenticate,
    updateSetValidation,
    handleValidationErrors,
    activeRoutineController.updateSet
);

router.put(
    "/reorder",
    authenticate,
    reorderSetsValidation,
    handleValidationErrors,
    activeRoutineController.reorderSets
);

router.post("/:id/complete", authenticate, activeRoutineController.complete);

router.delete("/:id/cancel", authenticate, activeRoutineController.cancel);

router.delete(
    "/completed/:id",
    authenticate,
    activeRoutineController.deleteCompleted
);

router.post(
    "/sets",
    authenticate,
    addSetValidation,
    handleValidationErrors,
    activeRoutineController.addSet
);

router.delete("/sets/:setId", authenticate, activeRoutineController.removeSet);

router.get(
    "/completed/dates",
    authenticate,
    activeRoutineController.getCompletedDates
);

router.get(
    "/completed/recent",
    authenticate,
    activeRoutineController.getRecentCompleted
);

router.get(
    "/completed/by-date",
    authenticate,
    activeRoutineController.getCompletedByDate
);

router.get(
    "/streak/weekly",
    authenticate,
    activeRoutineController.getWeeklyStreak
);

router.get(
    "/stats/monthly",
    authenticate,
    activeRoutineController.getMonthlyStats
);

export default router;
