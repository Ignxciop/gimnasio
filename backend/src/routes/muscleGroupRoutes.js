import { Router } from "express";
import muscleGroupController from "../controllers/muscleGroupController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import { readLimiter, writeLimiter } from "../config/rateLimiter.js";
import {
    createMuscleGroupValidation,
    updateMuscleGroupValidation,
    deleteMuscleGroupValidation,
    getMuscleGroupByIdValidation,
} from "../validators/muscleGroupValidator.js";
import { validationResult } from "express-validator";

const router = Router();

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
    "/",
    readLimiter,
    authenticate,
    authorize("administrador", "manager"),
    muscleGroupController.getAll
);

router.get(
    "/:id",
    readLimiter,
    authenticate,
    authorize("administrador", "manager"),
    getMuscleGroupByIdValidation,
    handleValidationErrors,
    muscleGroupController.getById
);

router.post(
    "/",
    writeLimiter,
    authenticate,
    authorize("administrador", "manager"),
    createMuscleGroupValidation,
    handleValidationErrors,
    muscleGroupController.create
);

router.put(
    "/:id",
    writeLimiter,
    authenticate,
    authorize("administrador", "manager"),
    updateMuscleGroupValidation,
    handleValidationErrors,
    muscleGroupController.update
);

router.delete(
    "/:id",
    writeLimiter,
    authenticate,
    authorize("administrador", "manager"),
    deleteMuscleGroupValidation,
    handleValidationErrors,
    muscleGroupController.delete
);

export default router;
