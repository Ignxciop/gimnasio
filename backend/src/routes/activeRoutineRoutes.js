import express from "express";
import activeRoutineController from "../controllers/activeRoutineController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
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

export default router;
