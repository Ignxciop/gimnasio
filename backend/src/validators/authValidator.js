import { body, validationResult } from "express-validator";

export const loginValidation = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("El email es requerido")
        .isEmail()
        .withMessage("Debe ser un email válido")
        .normalizeEmail(),

    body("password").notEmpty().withMessage("La contraseña es requerida"),
];

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map((err) => ({
                field: err.path,
                message: err.msg,
            })),
        });
    }
    next();
};
