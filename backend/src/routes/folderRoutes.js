import { Router } from "express";
import folderController from "../controllers/folderController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
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

router.get("/", authenticate, folderController.getAll);
router.get("/:id", authenticate, folderController.getById);
router.post(
    "/",
    authenticate,
    createFolderValidation,
    handleValidationErrors,
    folderController.create
);
router.put(
    "/:id",
    authenticate,
    updateFolderValidation,
    handleValidationErrors,
    folderController.update
);
router.delete("/:id", authenticate, folderController.delete);
router.patch(
    "/reorder",
    authenticate,
    reorderFolderValidation,
    handleValidationErrors,
    folderController.reorder
);

export default router;
