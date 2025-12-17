import { Router } from "express";
import exerciseController from "../controllers/exerciseController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import {
    createExerciseValidation,
    updateExerciseValidation,
    deleteExerciseValidation,
    getExerciseByIdValidation,
} from "../validators/exerciseValidator.js";
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
    authenticate,
    authorize("administrador", "manager"),
    exerciseController.getAll
);

router.get(
    "/:id",
    authenticate,
    authorize("administrador", "manager"),
    getExerciseByIdValidation,
    handleValidationErrors,
    exerciseController.getById
);

router.post(
    "/",
    authenticate,
    authorize("administrador", "manager"),
    createExerciseValidation,
    handleValidationErrors,
    exerciseController.create
);

router.put(
    "/:id",
    authenticate,
    authorize("administrador", "manager"),
    updateExerciseValidation,
    handleValidationErrors,
    exerciseController.update
);

router.delete(
    "/:id",
    authenticate,
    authorize("administrador", "manager"),
    deleteExerciseValidation,
    handleValidationErrors,
    exerciseController.delete
);

export default router;
