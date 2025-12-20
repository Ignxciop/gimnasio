import { body, param } from "express-validator";

export const createFolderValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("El nombre de la carpeta es requerido")
        .isLength({ min: 2, max: 50 })
        .withMessage("El nombre debe tener entre 2 y 50 caracteres"),
    body("description")
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage("La descripción no puede superar los 200 caracteres"),
];

export const updateFolderValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("El ID debe ser un número entero positivo"),
    body("name")
        .trim()
        .notEmpty()
        .withMessage("El nombre de la carpeta es requerido")
        .isLength({ min: 2, max: 50 })
        .withMessage("El nombre debe tener entre 2 y 50 caracteres"),
    body("description")
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage("La descripción no puede superar los 200 caracteres"),
];

export const deleteFolderValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("El ID debe ser un número entero positivo"),
];

export const getFolderByIdValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("El ID debe ser un número entero positivo"),
];

export const reorderFolderValidation = [
    body("items")
        .isArray({ min: 1 })
        .withMessage("Se requiere un array de items"),
    body("items.*.id")
        .isInt({ min: 1 })
        .withMessage("El ID debe ser un número entero positivo"),
    body("items.*.order")
        .isInt({ min: 0 })
        .withMessage("El orden debe ser un número entero no negativo"),
];
