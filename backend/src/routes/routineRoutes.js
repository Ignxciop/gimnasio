import { Router } from "express";
import routineController from "../controllers/routineController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { readLimiter, writeLimiter } from "../config/rateLimiter.js";
import {
    createRoutineValidation,
    updateRoutineValidation,
    moveRoutineValidation,
    reorderRoutineValidation,
} from "../validators/routineValidator.js";
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

router.get("/", readLimiter, authenticate, routineController.getAll);
router.get("/:id", readLimiter, authenticate, routineController.getById);
router.post(
    "/",
    writeLimiter,
    authenticate,
    createRoutineValidation,
    handleValidationErrors,
    routineController.create
);
router.put(
    "/:id",
    writeLimiter,
    authenticate,
    updateRoutineValidation,
    handleValidationErrors,
    routineController.update
);
router.patch(
    "/:id/move",
    writeLimiter,
    authenticate,
    moveRoutineValidation,
    handleValidationErrors,
    routineController.move
);
router.patch(
    "/reorder",
    writeLimiter,
    authenticate,
    reorderRoutineValidation,
    handleValidationErrors,
    routineController.reorder
);
router.delete("/:id", writeLimiter, authenticate, routineController.delete);

export default router;
