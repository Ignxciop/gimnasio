import { body, validationResult } from "express-validator";

export const createFeedbackValidation = [
    body("type")
        .notEmpty()
        .withMessage("El tipo de feedback es requerido")
        .isIn(["suggestion", "bug_report"])
        .withMessage('El tipo debe ser "suggestion" o "bug_report"'),
    body("title")
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage("El título no puede exceder 200 caracteres"),
    body("description")
        .notEmpty()
        .withMessage("La descripción es requerida")
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage("La descripción debe tener entre 10 y 2000 caracteres"),
    (req, res, next) => {
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
    },
];
