import express from "express";
import activeRoutineController from "../controllers/activeRoutineController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validationMiddleware } from "../middlewares/validationMiddleware.js";
import {
    createActiveRoutineValidation,
    updateSetValidation,
    reorderSetsValidation,
} from "../validators/activeRoutineValidator.js";

const router = express.Router();

router.get("/active", authMiddleware, activeRoutineController.getActive);

router.post(
    "/",
    authMiddleware,
    createActiveRoutineValidation,
    validationMiddleware,
    activeRoutineController.create
);

router.put(
    "/sets/:setId",
    authMiddleware,
    updateSetValidation,
    validationMiddleware,
    activeRoutineController.updateSet
);

router.put(
    "/reorder",
    authMiddleware,
    reorderSetsValidation,
    validationMiddleware,
    activeRoutineController.reorderSets
);

router.post("/:id/complete", authMiddleware, activeRoutineController.complete);

export default router;
