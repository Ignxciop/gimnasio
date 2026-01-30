import express from "express";
import statisticsController from "../controllers/statisticsController.js";
import { authenticate, optionalAuth } from "../middlewares/authMiddleware.js";
import { readLimiter } from "../config/rateLimiter.js";

const router = express.Router();

router.get(
    "/monthly-sets",
    readLimiter,
    optionalAuth,
    statisticsController.getMonthlySets,
);
router.get(
    "/months-with-workouts",
    readLimiter,
    optionalAuth,
    statisticsController.getMonthsWithWorkouts,
);
router.get(
    "/all-completed-routines",
    readLimiter,
    optionalAuth,
    statisticsController.getAllCompletedRoutines,
);

router.get(
    "/last-completed-sets",
    readLimiter,
    optionalAuth,
    statisticsController.getLastCompletedSets,
);
router.get(
    "/exercises",
    readLimiter,
    authenticate,
    statisticsController.getAllExercises,
);

export default router;
