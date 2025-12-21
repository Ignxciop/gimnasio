import express from "express";
import activeRoutineController from "../controllers/activeRoutineController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validationResult } from "express-validator";
import {
    createActiveRoutineValidation,
    updateSetValidation,
    reorderSetsValidation,
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

router.get("/active", authMiddleware, activeRoutineController.getActive);

router.post(
    "/",
    authMiddleware,
    createActiveRoutineValidation,
    handleValidationErrors,
    activeRoutineController.create
);

router.put(
    "/sets/:setId",
    authMiddleware,
    updateSetValidation,
    handleValidationErrors,
    activeRoutineController.updateSet
);

router.put(
    "/reorder",
    authMiddleware,
    reorderSetsValidation,
    handleValidationErrors,
    activeRoutineController.reorderSets
);

router.post("/:id/complete", authMiddleware, activeRoutineController.complete);

export default router;
