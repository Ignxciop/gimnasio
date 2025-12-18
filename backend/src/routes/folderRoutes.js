import { Router } from "express";
import folderController from "../controllers/folderController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
    createFolderValidation,
    updateFolderValidation,
} from "../validators/folderValidator.js";

const router = Router();

router.get("/", authMiddleware, folderController.getAll);
router.get("/:id", authMiddleware, folderController.getById);
router.post(
    "/",
    authMiddleware,
    createFolderValidation,
    folderController.create
);
router.put(
    "/:id",
    authMiddleware,
    updateFolderValidation,
    folderController.update
);
router.delete("/:id", authMiddleware, folderController.delete);

export default router;
