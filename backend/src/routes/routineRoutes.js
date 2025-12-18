import { Router } from "express";
import routineController from "../controllers/routineController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
    createRoutineValidation,
    updateRoutineValidation,
    moveRoutineValidation,
} from "../validators/routineValidator.js";

const router = Router();

router.get("/", authMiddleware, routineController.getAll);
router.get("/:id", authMiddleware, routineController.getById);
router.post(
    "/",
    authMiddleware,
    createRoutineValidation,
    routineController.create
);
router.put(
    "/:id",
    authMiddleware,
    updateRoutineValidation,
    routineController.update
);
router.patch(
    "/:id/move",
    authMiddleware,
    moveRoutineValidation,
    routineController.move
);
router.delete("/:id", authMiddleware, routineController.delete);

export default router;
