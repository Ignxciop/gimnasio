import express from "express";
import profileController from "../controllers/profileController.js";
import { authenticate, optionalAuth } from "../middlewares/authMiddleware.js";
import {
    updateUsernameValidation,
    checkUsernameValidation,
    updatePrivacyValidation,
    validate,
} from "../validators/userValidator.js";

const router = express.Router();

router.get("/me", authenticate, profileController.getProfile);

router.get(
    "/check-username",
    authenticate,
    checkUsernameValidation,
    validate,
    profileController.checkUsername
);

router.patch(
    "/username",
    authenticate,
    updateUsernameValidation,
    validate,
    profileController.updateUsername
);

router.patch(
    "/privacy",
    authenticate,
    updatePrivacyValidation,
    validate,
    profileController.updatePrivacy
);

router.get("/:username", optionalAuth, profileController.getProfileByUsername);

export default router;
