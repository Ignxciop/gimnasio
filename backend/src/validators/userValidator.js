import { body, validationResult } from "express-validator";

export const registerValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("El nombre es requerido")
        .isLength({ min: 2, max: 50 })
        .withMessage("El nombre debe tener entre 2 y 50 caracteres"),

    body("lastname")
        .trim()
        .notEmpty()
        .withMessage("El apellido es requerido")
        .isLength({ min: 2, max: 50 })
        .withMessage("El apellido debe tener entre 2 y 50 caracteres"),

    body("username")
        .trim()
        .notEmpty()
        .withMessage("El nombre de usuario es requerido")
        .isLength({ min: 3, max: 30 })
        .withMessage("El username debe tener entre 3 y 30 caracteres")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage(
            "El username solo puede contener letras, números y guión bajo"
        ),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("El email es requerido")
        .isEmail()
        .withMessage("Debe ser un email válido")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("La contraseña es requerida")
        .isLength({ min: 4 })
        .withMessage("La contraseña debe tener al menos 4 caracteres")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage(
            "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
        ),

    body("roleId")
        .notEmpty()
        .withMessage("El rol es requerido")
        .isInt({ min: 1 })
        .withMessage("El rol debe ser un número válido"),
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
