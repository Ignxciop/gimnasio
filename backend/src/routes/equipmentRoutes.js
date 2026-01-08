import { Router } from "express";
import equipmentController from "../controllers/equipmentController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import { readLimiter, writeLimiter } from "../config/rateLimiter.js";
import {
    createEquipmentValidation,
    updateEquipmentValidation,
    deleteEquipmentValidation,
    getEquipmentByIdValidation,
} from "../validators/equipmentValidator.js";
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
    equipmentController.getAll
);

router.get(
    "/:id",
    readLimiter,
    authenticate,
    authorize("administrador", "manager"),
    getEquipmentByIdValidation,
    handleValidationErrors,
    equipmentController.getById
);

router.post(
    "/",
    writeLimiter,
    authenticate,
    authorize("administrador", "manager"),
    createEquipmentValidation,
    handleValidationErrors,
    equipmentController.create
);

router.put(
    "/:id",
    writeLimiter,
    authenticate,
    authorize("administrador", "manager"),
    updateEquipmentValidation,
    handleValidationErrors,
    equipmentController.update
);

router.delete(
    "/:id",
    writeLimiter,
    authenticate,
    authorize("administrador", "manager"),
    deleteEquipmentValidation,
    handleValidationErrors,
    equipmentController.delete
);

export default router;
