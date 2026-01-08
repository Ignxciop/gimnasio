import rateLimit from "express-rate-limit";

const createKeyGenerator = (useAuth = false) => {
    if (!useAuth) {
        return undefined;
    }
    return (req, res) => {
        if (req.user?.id) {
            return `user_${req.user.id}`;
        }
        return req.ip;
    };
};

export const strictAuthLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        error: "Demasiados intentos de inicio de sesión. Por favor, intenta nuevamente en 15 minutos.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    validate: { trustProxy: false, keyGeneratorIpFallback: false },
    keyGenerator: createKeyGenerator(false),
});

export const refreshLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        error: "Demasiadas solicitudes de renovación de token. Por favor, intenta nuevamente en 15 minutos.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: false, keyGeneratorIpFallback: false },
    keyGenerator: createKeyGenerator(false),
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
    validate: { trustProxy: false, keyGeneratorIpFallback: false },
    keyGenerator: createKeyGenerator(false),
});

export const readLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 2000,
    message: {
        success: false,
        error: "Demasiadas solicitudes de lectura. Por favor, intenta nuevamente en 15 minutos.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: false, keyGeneratorIpFallback: false },
    keyGenerator: createKeyGenerator(true),
});

export const writeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: {
        success: false,
        error: "Demasiadas operaciones de escritura. Por favor, intenta nuevamente en 15 minutos.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: false, keyGeneratorIpFallback: false },
    keyGenerator: createKeyGenerator(true),
});

export const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        error: "Demasiados archivos subidos. Por favor, intenta nuevamente en 1 hora.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: false, keyGeneratorIpFallback: false },
    keyGenerator: createKeyGenerator(true),
});

export const feedbackLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: {
        success: false,
        error: "Demasiados mensajes de feedback. Por favor, intenta nuevamente en 1 hora.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: false, keyGeneratorIpFallback: false },
    keyGenerator: createKeyGenerator(true),
});

export const loginLimiter = strictAuthLimiter;
export const generalLimiter = readLimiter;
export const crudLimiter = writeLimiter;
