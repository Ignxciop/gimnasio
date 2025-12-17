import express from "express";
import profileController from "../controllers/profileController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", authenticate, profileController.getProfile);

export default router;
