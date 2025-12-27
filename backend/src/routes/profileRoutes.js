import express from "express";
import profileController from "../controllers/profileController.js";
import { authenticate, optionalAuth } from "../middlewares/authMiddleware.js";
import {
    updatePrivacyValidation,
    validate,
} from "../validators/userValidator.js";

const router = express.Router();

router.get("/me", authenticate, profileController.getProfile);

router.patch(
    "/privacy",
    authenticate,
    updatePrivacyValidation,
    validate,
    profileController.updatePrivacy
);

router.get("/:username", optionalAuth, profileController.getProfileByUsername);

export default router;
