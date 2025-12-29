export const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3000";

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
