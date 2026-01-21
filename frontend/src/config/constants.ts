// Runtime config injected by env.sh in Docker container
// @ts-ignore - window.__ENV__ is injected at runtime
const runtimeConfig =
    typeof window !== "undefined" ? window.__ENV__ : undefined;

// Normalize API URL - remove trailing slash, validate format
const normalizeApiUrl = (url: string): string => {
    const normalized = url.replace(/\/+$/, ""); // Remove trailing slashes

    // Defensive validation
    if (normalized.includes("/api/api")) {
        throw new Error(
            "❌ API_BASE_URL mal configurada: contiene doble /api. " +
                "La variable debe ser: https://gimnasio-api.josenunez.cl/api",
        );
    }

    if (!import.meta.env.DEV && normalized.includes("localhost")) {
        console.warn(
            "⚠️ WARNING: API_BASE_URL contiene localhost en producción",
        );
    }

    return normalized;
};

// Priority: runtime config > build-time env > development fallback
const getApiUrl = (): string => {
    if (runtimeConfig?.API_URL) {
        return normalizeApiUrl(runtimeConfig.API_URL);
    }

    if (import.meta.env.VITE_API_URL) {
        return normalizeApiUrl(import.meta.env.VITE_API_URL);
    }

    // Development fallback includes /api
    if (import.meta.env.DEV) {
        // Detectar IP local para desarrollo móvil
        const hostname = window.location.hostname;
        if (hostname !== "localhost" && hostname !== "127.0.0.1") {
            // Si estamos accediendo desde una IP, usar esa misma IP para la API
            return `http://${hostname}:3000/api`;
        }
        return "http://localhost:3000/api";
    }

    throw new Error(
        "API_BASE_URL not configured. Set API_URL environment variable with full path (e.g., https://gimnasio-api.josenunez.cl/api)",
    );
};

export const API_BASE_URL = getApiUrl();

export const PATHS = {
    RESOURCES: "/resources/examples_exercises",
} as const;

export const ROLES = {
    ADMIN: { id: 1, label: "Administrador" },
    MANAGER: { id: 2, label: "Manager" },
    USER: { id: 3, label: "Usuario" },
} as const;

export const ROLE_OPTIONS = Object.values(ROLES).map((role) => ({
    value: role.id,
    label: role.label,
}));

export const GENDERS = {
    MALE: "male" as const,
    FEMALE: "female" as const,
};

export const FEEDBACK_TYPES = {
    SUGGESTION: "suggestion" as const,
    BUG_REPORT: "bug_report" as const,
};

export const STATUS = {
    ACTIVE: true,
    INACTIVE: false,
} as const;

export const getVideoUrl = (videoPath: string | null): string | null => {
    if (!videoPath) return null;
    return `${API_BASE_URL}${PATHS.RESOURCES}/${videoPath}#t=0.1`;
};

export const getApiEndpoint = (path: string): string => {
    return `${API_BASE_URL}${path}`;
};
