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
    verifyEmailValidation,
    resendCodeValidation,
} from "../validators/emailVerificationValidator.js";
import {
    loginLimiter,
    refreshLimiter,
    registerLimiter,
} from "../config/rateLimiter.js";
import { doubleCsrfProtection } from "../config/csrf.js";
import { validationResult } from "express-validator";

const router = express.Router();

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map((error) => ({
                field: error.path,
                message: error.msg,
            })),
        });
    }
    next();
};

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

router.post(
    "/verify-email",
    verifyEmailValidation,
    handleValidationErrors,
    authController.verifyEmail
);

router.post(
    "/resend-code",
    resendCodeValidation,
    handleValidationErrors,
    authController.resendCode
);

export default router;
