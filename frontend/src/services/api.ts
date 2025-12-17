const API_BASE_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
    statusCode: number;
    errors?: Array<{ field: string; message: string }>;

    constructor(
        message: string,
        statusCode: number,
        errors?: Array<{ field: string; message: string }>
    ) {
        super(message);
        this.name = "ApiError";
        this.statusCode = statusCode;
        this.errors = errors;
    }
}

export const api = {
    async post<T>(endpoint: string, data: unknown): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const json = await response.json();

        if (!response.ok) {
            throw new ApiError(
                json.error || "Error en la petición",
                response.status,
                json.errors
            );
        }

        return json;
    },

    async get<T>(endpoint: string, token?: string): Promise<T> {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "GET",
            headers,
        });

        const json = await response.json();

        if (!response.ok) {
            throw new ApiError(
                json.error || "Error en la petición",
                response.status,
                json.errors
            );
        }

        return json;
    },

    async put<T, D = unknown>(
        endpoint: string,
        data: D,
        token?: string
    ): Promise<T> {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(data),
        });

        const json = await response.json();

        if (!response.ok) {
            throw new ApiError(
                json.error || "Error en la petición",
                response.status,
                json.errors
            );
        }

        return json;
    },

    async delete<T>(endpoint: string, token?: string): Promise<T> {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "DELETE",
            headers,
        });

        const json = await response.json();

        if (!response.ok) {
            throw new ApiError(
                json.error || "Error en la petición",
                response.status,
                json.errors
            );
        }

        return json;
    },
};
