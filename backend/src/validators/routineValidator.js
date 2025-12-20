import { body, param } from "express-validator";

export const createRoutineValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("El nombre de la rutina es requerido")
        .isLength({ min: 2, max: 100 })
        .withMessage("El nombre debe tener entre 2 y 100 caracteres"),
    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("La descripción no puede superar los 500 caracteres"),
    body("folderId")
        .optional({ nullable: true })
        .custom((value) => {
            if (value === null || value === undefined || value === "") {
                return true;
            }
            if (Number.isInteger(value) && value > 0) {
                return true;
            }
            throw new Error(
                "El ID de la carpeta debe ser null o un número entero positivo"
            );
        }),
];

export const updateRoutineValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("El ID debe ser un número entero positivo"),
    body("name")
        .trim()
        .notEmpty()
        .withMessage("El nombre de la rutina es requerido")
        .isLength({ min: 2, max: 100 })
        .withMessage("El nombre debe tener entre 2 y 100 caracteres"),
    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("La descripción no puede superar los 500 caracteres"),
    body("folderId")
        .optional()
        .custom(
            (value) => value === null || (Number.isInteger(value) && value > 0)
        )
        .withMessage(
            "El ID de la carpeta debe ser null o un número entero positivo"
        ),
];

export const deleteRoutineValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("El ID debe ser un número entero positivo"),
];

export const getRoutineByIdValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("El ID debe ser un número entero positivo"),
];

export const moveRoutineValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("El ID debe ser un número entero positivo"),
    body("folderId")
        .optional()
        .custom(
            (value) => value === null || (Number.isInteger(value) && value > 0)
        )
        .withMessage(
            "El ID de la carpeta debe ser null o un número entero positivo"
        ),
];

export const reorderRoutineValidation = [
    body("items")
        .isArray({ min: 1 })
        .withMessage("Se requiere un array de items"),
    body("items.*.id")
        .isInt({ min: 1 })
        .withMessage("El ID debe ser un número entero positivo"),
    body("items.*.order")
        .isInt({ min: 0 })
        .withMessage("El orden debe ser un número entero no negativo"),
    body("items.*.folderId")
        .optional()
        .custom(
            (value) => value === null || (Number.isInteger(value) && value > 0)
        )
        .withMessage(
            "El ID de la carpeta debe ser null o un número entero positivo"
        ),
];
