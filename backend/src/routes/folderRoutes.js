import { Router } from "express";
import folderController from "../controllers/folderController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { readLimiter, writeLimiter } from "../config/rateLimiter.js";
import {
    createFolderValidation,
    updateFolderValidation,
    reorderFolderValidation,
} from "../validators/folderValidator.js";
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

router.get("/", readLimiter, authenticate, folderController.getAll);
router.get("/:id", readLimiter, authenticate, folderController.getById);
router.post(
    "/",
    writeLimiter,
    authenticate,
    createFolderValidation,
    handleValidationErrors,
    folderController.create
);
router.put(
    "/:id",
    writeLimiter,
    authenticate,
    updateFolderValidation,
    handleValidationErrors,
    folderController.update
);
router.delete("/:id", writeLimiter, authenticate, folderController.delete);
router.patch(
    "/reorder",
    writeLimiter,
    authenticate,
    reorderFolderValidation,
    handleValidationErrors,
    folderController.reorder
);

export default router;
