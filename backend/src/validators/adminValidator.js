import { body, param } from "express-validator";

export const updateRoleValidation = [
    param("id").isUUID().withMessage("ID de usuario inválido"),
    body("roleId")
        .notEmpty()
        .withMessage("El rol es requerido")
        .isInt()
        .withMessage("ID de rol inválido")
        .isIn([1, 2, 3])
        .withMessage("Rol no válido"),
];

export const updateStatusValidation = [
    param("id").isUUID().withMessage("ID de usuario inválido"),
    body("isActive")
        .notEmpty()
        .withMessage("El estado es requerido")
        .isBoolean()
        .withMessage("El estado debe ser verdadero o falso"),
];
