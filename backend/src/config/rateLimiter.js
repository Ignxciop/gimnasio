import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        error: "Demasiados intentos de inicio de sesión. Por favor, intenta nuevamente en 15 minutos.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
});

export const refreshLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: {
        success: false,
        error: "Demasiadas solicitudes de renovación de token. Por favor, intenta nuevamente en 15 minutos.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        error: "Demasiados intentos de registro. Por favor, intenta nuevamente en 1 hora.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: {
        success: false,
        error: "Demasiadas solicitudes. Por favor, intenta nuevamente en 15 minutos.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 50,
    message: {
        success: false,
        error: "Demasiados archivos subidos. Por favor, intenta nuevamente en 1 hora.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const crudLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: {
        success: false,
        error: "Demasiadas operaciones. Por favor, intenta nuevamente en 15 minutos.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const feedbackLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        error: "Demasiados mensajes de feedback. Por favor, intenta nuevamente en 1 hora.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
