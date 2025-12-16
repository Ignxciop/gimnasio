import express from "express";
import authController from "../controllers/authController.js";
import { registerValidation, validate } from "../validators/userValidator.js";

const router = express.Router();

router.post("/register", registerValidation, validate, authController.register);

export default router;
