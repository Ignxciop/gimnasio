import { Router } from "express";
import folderController from "../controllers/folderController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
    createFolderValidation,
    updateFolderValidation,
} from "../validators/folderValidator.js";

const router = Router();

router.get("/", authenticate, folderController.getAll);
router.get("/:id", authenticate, folderController.getById);
router.post("/", authenticate, createFolderValidation, folderController.create);
router.put(
    "/:id",
    authenticate,
    updateFolderValidation,
    folderController.update
);
router.delete("/:id", authenticate, folderController.delete);

export default router;
