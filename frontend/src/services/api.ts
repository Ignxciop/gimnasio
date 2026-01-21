import { fetchWithAuth } from "./apiInterceptor";
import { API_BASE_URL } from "../config/constants";

export class ApiError extends Error {
    statusCode: number;
    errors?: Array<{ field: string; message: string }>;
    response: {
        status: number;
        data: {
            message: string;
            errors?: Array<{ field: string; message: string }>;
        };
    };

    constructor(
        message: string,
        statusCode: number,
        errors?: Array<{ field: string; message: string }>,
    ) {
        super(message);
        this.name = "ApiError";
        this.statusCode = statusCode;
        this.errors = errors;
        this.response = {
            status: statusCode,
            data: {
                message,
                errors,
            },
        };
    }
}

export const api = {
    async post<T>(endpoint: string, data: unknown, token?: string): Promise<T> {
        try {
            const headers: HeadersInit = {
                "Content-Type": "application/json",
            };

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
                method: "POST",
                headers,
                body: JSON.stringify(data),
            });

            const json = await response.json();

            if (!response.ok) {
                throw new ApiError(
                    json.message || json.error || "Error en la petición",
                    response.status,
                    json.errors,
                );
            }

            return json;
        } catch (error) {
            // Si es un error de fetch (CORS, network, etc.), convertirlo en ApiError
            if (error instanceof TypeError) {
                if (
                    error.message.includes("fetch") ||
                    error.message.includes("NetworkError") ||
                    error.message.includes("Load failed") ||
                    error.message.includes("Failed to fetch")
                ) {
                    throw new ApiError(
                        "Error de conexión. Verifica que el servidor esté funcionando y que no haya problemas de red o CORS.",
                        0,
                        undefined,
                    );
                }
                throw new ApiError(
                    `Error de conexión: ${error.message}`,
                    0,
                    undefined,
                );
            }

            // Si es un error de respuesta HTTP
            if (error instanceof Error && error.message.includes("HTTP")) {
                throw new ApiError(
                    "Error del servidor. Inténtalo de nuevo.",
                    0,
                    undefined,
                );
            }

            // Si ya es ApiError, relanzarlo
            if (error instanceof ApiError) {
                throw error;
            }

            // Cualquier otro error, convertirlo en ApiError genérico con más info
            const errorMessage =
                error instanceof Error ? error.message : "Error desconocido";
            throw new ApiError(
                `Error en la petición: ${errorMessage}`,
                0,
                undefined,
            );
        }
    },

    async get<T>(endpoint: string, token?: string): Promise<T> {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
            method: "GET",
            headers,
        });

        const json = await response.json();

        if (!response.ok) {
            throw new ApiError(
                json.message || json.error || "Error en la petición",
                response.status,
                json.errors,
            );
        }

        return json;
    },

    async put<T, D = unknown>(
        endpoint: string,
        data: D,
        token?: string,
    ): Promise<T> {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(data),
        });

        const json = await response.json();

        if (!response.ok) {
            throw new ApiError(
                json.message || json.error || "Error en la petición",
                response.status,
                json.errors,
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

        const response = await fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
            method: "DELETE",
            headers,
        });

        const json = await response.json();

        if (!response.ok) {
            throw new ApiError(
                json.message || json.error || "Error en la petición",
                response.status,
                json.errors,
            );
        }

        return json;
    },
};
