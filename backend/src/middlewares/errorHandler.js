export const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Error interno del servidor";

    if (err.code === "P2002") {
        return res.status(409).json({
            success: false,
            message: "El registro ya existe (email o username duplicado)",
        });
    }

    if (err.code === "P2003") {
        return res.status(400).json({
            success: false,
            message: "Referencia inválida en la base de datos",
        });
    }

    res.status(statusCode).json({
        success: false,
        message: message,
    });
};
