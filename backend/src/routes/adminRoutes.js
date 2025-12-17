import express from "express";
import adminController from "../controllers/adminController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import {
    updateRoleValidation,
    updateStatusValidation,
} from "../validators/adminValidator.js";
import { validationResult } from "express-validator";

const router = express.Router();

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map((err) => ({
                field: err.path,
                message: err.msg,
            })),
        });
    }
    next();
};

router.get(
    "/users",
    authenticate,
    authorize("administrador"),
    adminController.getUsers
);

router.put(
    "/users/:id/role",
    authenticate,
    authorize("administrador"),
    updateRoleValidation,
    validateRequest,
    adminController.updateUserRole
);

router.put(
    "/users/:id/status",
    authenticate,
    authorize("administrador"),
    updateStatusValidation,
    validateRequest,
    adminController.updateUserStatus
);

export default router;
