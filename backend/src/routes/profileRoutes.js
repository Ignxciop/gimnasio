import express from "express";
import profileController from "../controllers/profileController.js";
import { authenticate, optionalAuth } from "../middlewares/authMiddleware.js";
import { readLimiter, writeLimiter } from "../config/rateLimiter.js";
import {
    updatePrivacyValidation,
    validate,
} from "../validators/userValidator.js";

const router = express.Router();

router.get("/me", readLimiter, authenticate, profileController.getProfile);

router.patch(
    "/privacy",
    writeLimiter,
    authenticate,
    updatePrivacyValidation,
    validate,
    profileController.updatePrivacy
);

router.patch("/unit", writeLimiter, authenticate, profileController.updateUnit);

router.get("/export", readLimiter, authenticate, profileController.exportData);

router.get(
    "/:username",
    readLimiter,
    optionalAuth,
    profileController.getProfileByUsername
);

router.delete(
    "/delete-account",
    writeLimiter,
    authenticate,
    profileController.deleteAccount
);

export default router;
