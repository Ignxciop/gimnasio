import { body, param } from "express-validator";

export const createMuscleGroupValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("El nombre del grupo muscular es requerido")
        .isLength({ min: 2, max: 100 })
        .withMessage("El nombre debe tener entre 2 y 100 caracteres"),
];

export const updateMuscleGroupValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("El ID debe ser un número entero positivo"),
    body("name")
        .trim()
        .notEmpty()
        .withMessage("El nombre del grupo muscular es requerido")
        .isLength({ min: 2, max: 100 })
        .withMessage("El nombre debe tener entre 2 y 100 caracteres"),
];

export const deleteMuscleGroupValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("El ID debe ser un número entero positivo"),
];

export const getMuscleGroupByIdValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("El ID debe ser un número entero positivo"),
];
