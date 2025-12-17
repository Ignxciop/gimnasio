import { body, param } from "express-validator";

export const createExerciseValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("El nombre del ejercicio es requerido")
        .isLength({ min: 2, max: 100 })
        .withMessage("El nombre debe tener entre 2 y 100 caracteres"),
    body("equipmentId")
        .isInt({ min: 1 })
        .withMessage("El equipamiento es requerido"),
    body("muscleGroupId")
        .isInt({ min: 1 })
        .withMessage("El grupo muscular es requerido"),
];

export const updateExerciseValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("El ID debe ser un número entero positivo"),
    body("name")
        .trim()
        .notEmpty()
        .withMessage("El nombre del ejercicio es requerido")
        .isLength({ min: 2, max: 100 })
        .withMessage("El nombre debe tener entre 2 y 100 caracteres"),
    body("equipmentId")
        .isInt({ min: 1 })
        .withMessage("El equipamiento es requerido"),
    body("muscleGroupId")
        .isInt({ min: 1 })
        .withMessage("El grupo muscular es requerido"),
];

export const deleteExerciseValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("El ID debe ser un número entero positivo"),
];

export const getExerciseByIdValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("El ID debe ser un número entero positivo"),
];
