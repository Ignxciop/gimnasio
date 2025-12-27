import express from "express";
import statisticsController from "../controllers/statisticsController.js";
import { authenticate, optionalAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/monthly-sets", optionalAuth, statisticsController.getMonthlySets);
router.get(
    "/months-with-workouts",
    optionalAuth,
    statisticsController.getMonthsWithWorkouts
);
router.get(
    "/all-completed-routines",
    optionalAuth,
    statisticsController.getAllCompletedRoutines
);
router.get("/exercises", authenticate, statisticsController.getAllExercises);

export default router;
