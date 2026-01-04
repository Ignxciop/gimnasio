import { body } from "express-validator";

export const createActiveRoutineValidation = [
    body("routineId")
        .notEmpty()
        .withMessage("El ID de la rutina es requerido")
        .isInt({ min: 1 })
        .withMessage("El ID de la rutina debe ser un número entero positivo"),
];

export const updateSetValidation = [
    body("actualWeight")
        .optional({ values: "null" })
        .isFloat({ min: 0, max: 1000 })
        .withMessage("El peso debe estar entre 0 y 1000 kg"),
    body("actualReps")
        .optional({ values: "null" })
        .isInt({ min: 1, max: 1000 })
        .withMessage("Las repeticiones deben estar entre 1 y 1000"),
];

export const reorderSetsValidation = [
    body("sets")
        .isArray({ min: 1 })
        .withMessage("Se requiere un array de series")
        .custom((value) => {
            if (
                !value.every(
                    (item) =>
                        item.id &&
                        Number.isInteger(item.id) &&
                        item.id > 0 &&
                        item.order !== undefined &&
                        Number.isInteger(item.order) &&
                        item.order >= 0
                )
            ) {
                throw new Error(
                    "Cada serie debe tener id (entero positivo) y order (entero no negativo)"
                );
            }
            return true;
        }),
];

export const addSetValidation = [
    body("exerciseId")
        .notEmpty()
        .withMessage("El ID del ejercicio es requerido")
        .isInt({ min: 1 })
        .withMessage("El ID del ejercicio debe ser un número entero positivo"),
];
