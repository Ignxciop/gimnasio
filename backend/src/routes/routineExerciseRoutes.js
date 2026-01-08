import { Router } from "express";
import routineExerciseController from "../controllers/routineExerciseController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { readLimiter, writeLimiter } from "../config/rateLimiter.js";
import {
    createRoutineExerciseValidation,
    updateRoutineExerciseValidation,
    deleteRoutineExerciseValidation,
    reorderRoutineExerciseValidation,
} from "../validators/routineExerciseValidator.js";
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
    "/routines/:routineId/exercises",
    readLimiter,
    authenticate,
    routineExerciseController.getAllByRoutine
);

router.post(
    "/routines/:routineId/exercises",
    writeLimiter,
    authenticate,
    createRoutineExerciseValidation,
    handleValidationErrors,
    routineExerciseController.create
);

router.put(
    "/routine-exercises/:id",
    writeLimiter,
    authenticate,
    updateRoutineExerciseValidation,
    handleValidationErrors,
    routineExerciseController.update
);

router.delete(
    "/routine-exercises/:id",
    writeLimiter,
    authenticate,
    deleteRoutineExerciseValidation,
    handleValidationErrors,
    routineExerciseController.delete
);

router.patch(
    "/routine-exercises/reorder",
    writeLimiter,
    authenticate,
    reorderRoutineExerciseValidation,
    handleValidationErrors,
    routineExerciseController.reorder
);

export default router;
