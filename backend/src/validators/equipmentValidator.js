import { body, param } from "express-validator";

export const createEquipmentValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("El nombre del equipamiento es requerido")
        .isLength({ min: 2, max: 100 })
        .withMessage("El nombre debe tener entre 2 y 100 caracteres"),
];

export const updateEquipmentValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("El ID debe ser un número entero positivo"),
    body("name")
        .trim()
        .notEmpty()
        .withMessage("El nombre del equipamiento es requerido")
        .isLength({ min: 2, max: 100 })
        .withMessage("El nombre debe tener entre 2 y 100 caracteres"),
];

export const deleteEquipmentValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("El ID debe ser un número entero positivo"),
];

export const getEquipmentByIdValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("El ID debe ser un número entero positivo"),
];
