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

const router = express.Router();

router.post(
    "/register",
    registerValidation,
    validateRegister,
    authController.register
);

router.post("/login", loginValidation, validateLogin, authController.login);

export default router;
