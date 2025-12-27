import express from "express";
import statisticsController from "../controllers/statisticsController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/monthly-sets", authenticate, statisticsController.getMonthlySets);
router.get(
    "/months-with-workouts",
    authenticate,
    statisticsController.getMonthsWithWorkouts
);
router.get(
    "/all-completed-routines",
    authenticate,
    statisticsController.getAllCompletedRoutines
);
router.get("/exercises", authenticate, statisticsController.getAllExercises);

export default router;
