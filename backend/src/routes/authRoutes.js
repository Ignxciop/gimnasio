import express from "express";
import authController from "../controllers/authController.js";
import {
    registerValidation,
    validate as validateRegister,
} from "../validators/userValidator.js";
import {
    loginValidation,
    validate as validateLogin,
} from "../validators/authValidator.js";
import {
    loginLimiter,
    refreshLimiter,
    registerLimiter,
} from "../config/rateLimiter.js";
import { doubleCsrfProtection } from "../config/csrf.js";

const router = express.Router();

router.post(
    "/register",
    registerLimiter,
    registerValidation,
    validateRegister,
    authController.register
);

router.post(
    "/login",
    loginLimiter,
    loginValidation,
    validateLogin,
    authController.login
);

router.post(
    "/refresh",
    refreshLimiter,
    doubleCsrfProtection,
    authController.refresh
);

router.post("/logout", doubleCsrfProtection, authController.logout);

export default router;
