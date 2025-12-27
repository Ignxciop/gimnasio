import express from "express";
import statisticsController from "../controllers/statisticsController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/weekly-sets", authenticate, statisticsController.getWeeklySets);
router.get("/exercises", authenticate, statisticsController.getAllExercises);

export default router;
