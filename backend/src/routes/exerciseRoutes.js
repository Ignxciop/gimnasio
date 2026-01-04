import { Router } from "express";
import exerciseController from "../controllers/exerciseController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import { upload } from "../config/multer.js";
import { uploadLimiter } from "../config/rateLimiter.js";
import {
    createExerciseValidation,
    updateExerciseValidation,
    deleteExerciseValidation,
    getExerciseByIdValidation,
} from "../validators/exerciseValidator.js";
import { validationResult } from "express-validator";

const router = Router();

const parseFormData = (req, res, next) => {
    if (req.body.equipmentId) {
        req.body.equipmentId = parseInt(req.body.equipmentId);
    }
    if (req.body.muscleGroupId) {
        req.body.muscleGroupId = parseInt(req.body.muscleGroupId);
    }
    if (req.body.secondaryMuscleGroupIds) {
        try {
            req.body.secondaryMuscleGroupIds = JSON.parse(
                req.body.secondaryMuscleGroupIds
            );
        } catch (e) {
            req.body.secondaryMuscleGroupIds = [];
        }
    }
    next();
};

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

router.get("/", authenticate, exerciseController.getAll);

router.get(
    "/:id",
    authenticate,
    getExerciseByIdValidation,
    handleValidationErrors,
    exerciseController.getById
);

router.post(
    "/",
    authenticate,
    authorize("administrador", "manager"),
    uploadLimiter,
    upload.single("video"),
    parseFormData,
    createExerciseValidation,
    handleValidationErrors,
    exerciseController.create
);

router.put(
    "/:id",
    authenticate,
    authorize("administrador", "manager"),
    uploadLimiter,
    upload.single("video"),
    parseFormData,
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
