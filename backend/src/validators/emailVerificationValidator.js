import { body } from "express-validator";

export const verifyEmailValidation = [
    body("userId")
        .notEmpty()
        .withMessage("El ID de usuario es requerido")
        .isString()
        .withMessage("El ID de usuario debe ser una cadena"),
    body("code")
        .notEmpty()
        .withMessage("El código es requerido")
        .isString()
        .withMessage("El código debe ser una cadena")
        .isLength({ min: 6, max: 6 })
        .withMessage("El código debe tener 6 dígitos"),
];

export const resendCodeValidation = [
    body("userId")
        .notEmpty()
        .withMessage("El ID de usuario es requerido")
        .isString()
        .withMessage("El ID de usuario debe ser una cadena"),
];
