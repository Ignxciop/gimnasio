export const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Error interno del servidor";

    if (err.code === "P2002" || err.code === "23505") {
        return res.status(409).json({
            success: false,
            message: "El registro ya existe (email o username duplicado)",
        });
    }

    if (err.code === "P2003" || err.code === "23001" || err.code === "23503") {
        return res.status(409).json({
            success: false,
            message:
                "No se puede eliminar este registro porque está siendo usado en otros registros",
        });
    }

    res.status(statusCode).json({
        success: false,
        message: message,
    });
};
