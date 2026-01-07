// Runtime config injected by env.sh in Docker container
// @ts-ignore - window.__ENV__ is injected at runtime
const runtimeConfig =
    typeof window !== "undefined" ? window.__ENV__ : undefined;

// Priority: runtime config > build-time env > error
const getApiUrl = (): string => {
    if (runtimeConfig?.API_URL) {
        return runtimeConfig.API_URL;
    }

    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }

    // Development fallback
    if (import.meta.env.DEV) {
        return "http://localhost:3000";
    }

    throw new Error(
        "API_BASE_URL not configured. Set API_URL environment variable in docker-compose.yml"
    );
};

export const API_BASE_URL = getApiUrl();

export const PATHS = {
    RESOURCES: "/resources/examples_exercises",
    API: "/api",
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
    return `${API_BASE_URL}${PATHS.API}${path}`;
};
