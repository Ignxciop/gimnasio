import { Router } from "express";
import routineController from "../controllers/routineController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
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

router.get("/", authenticate, routineController.getAll);
router.get("/:id", authenticate, routineController.getById);
router.post(
    "/",
    authenticate,
    createRoutineValidation,
    handleValidationErrors,
    routineController.create
);
router.put(
    "/:id",
    authenticate,
    updateRoutineValidation,
    handleValidationErrors,
    routineController.update
);
router.patch(
    "/:id/move",
    authenticate,
    moveRoutineValidation,
    handleValidationErrors,
    routineController.move
);
router.patch(
    "/reorder",
    authenticate,
    reorderRoutineValidation,
    handleValidationErrors,
    routineController.reorder
);
router.delete("/:id", authenticate, routineController.delete);

export default router;
