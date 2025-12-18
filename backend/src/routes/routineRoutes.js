import { Router } from "express";
import routineController from "../controllers/routineController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
    createRoutineValidation,
    updateRoutineValidation,
    moveRoutineValidation,
} from "../validators/routineValidator.js";

const router = Router();

router.get("/", authenticate, routineController.getAll);
router.get("/:id", authenticate, routineController.getById);
router.post(
    "/",
    authenticate,
    createRoutineValidation,
    routineController.create
);
router.put(
    "/:id",
    authenticate,
    updateRoutineValidation,
    routineController.update
);
router.patch(
    "/:id/move",
    authenticate,
    moveRoutineValidation,
    routineController.move
);
router.delete("/:id", authenticate, routineController.delete);

export default router;
