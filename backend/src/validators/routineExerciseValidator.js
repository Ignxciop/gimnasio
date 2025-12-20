import { body, param } from "express-validator";

export const createRoutineExerciseValidation = [
    param("routineId")
        .isInt({ min: 1 })
        .withMessage("El ID de rutina debe ser un número entero positivo"),
    body("exerciseId")
        .isInt({ min: 1 })
        .withMessage("El ID de ejercicio debe ser un número entero positivo"),
    body("sets")
        .isInt({ min: 1, max: 100 })
        .withMessage("Las series deben ser un número entre 1 y 100"),
    body("reps")
        .isInt({ min: 1, max: 1000 })
        .withMessage("Las repeticiones deben ser un número entre 1 y 1000"),
    body("weight")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("El peso debe ser un número positivo"),
    body("restTime")
        .isInt({ min: 0, max: 600 })
        .withMessage(
            "El tiempo de descanso debe ser un número entre 0 y 600 segundos"
        ),
];

export const updateRoutineExerciseValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("El ID debe ser un número entero positivo"),
    body("sets")
        .isInt({ min: 1, max: 100 })
        .withMessage("Las series deben ser un número entre 1 y 100"),
    body("reps")
        .isInt({ min: 1, max: 1000 })
        .withMessage("Las repeticiones deben ser un número entre 1 y 1000"),
    body("weight")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("El peso debe ser un número positivo"),
    body("restTime")
        .isInt({ min: 0, max: 600 })
        .withMessage(
            "El tiempo de descanso debe ser un número entre 0 y 600 segundos"
        ),
];

export const deleteRoutineExerciseValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("El ID debe ser un número entero positivo"),
];

export const reorderRoutineExerciseValidation = [
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
