import { tokenStorage } from "./tokenStorage";
import { authService } from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_URL;

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else if (token) {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

export const fetchWithAuth = async (
    url: string,
    options: RequestInit = {}
): Promise<Response> => {
    const token = tokenStorage.getToken();

    const headers = new Headers(options.headers);
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
    });

    if (response.status === 401 || response.status === 403) {
        const isAuthEndpoint =
            url.includes("/auth/login") ||
            url.includes("/auth/register") ||
            url.includes("/auth/refresh");

        const isPublicRoute =
            window.location.pathname === "/login" ||
            window.location.pathname === "/register" ||
            window.location.pathname === "/";

        if (isAuthEndpoint || isPublicRoute) {
            return response;
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve: (newToken: string) => {
                        headers.set("Authorization", `Bearer ${newToken}`);
                        resolve(
                            fetch(url, {
                                ...options,
                                headers,
                                credentials: "include",
                            })
                        );
                    },
                    reject,
                });
            });
        }

        isRefreshing = true;

        try {
            const result = await authService.refresh();
            const newToken = result.accessToken;
            processQueue(null, newToken);

            headers.set("Authorization", `Bearer ${newToken}`);
            return fetch(url, {
                ...options,
                headers,
                credentials: "include",
            });
        } catch (error) {
            processQueue(error as Error, null);
            authService.clearAuth();
            throw error;
        } finally {
            isRefreshing = false;
        }
    }

    return response;
};
