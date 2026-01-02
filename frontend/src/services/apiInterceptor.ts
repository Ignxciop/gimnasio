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

export const refreshAccessToken = async (): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    return data.data.accessToken;
};

export const fetchWithAuth = async (
    url: string,
    options: RequestInit = {}
): Promise<Response> => {
    const token = sessionStorage.getItem("access_token");

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

    if (response.status === 401) {
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
            const newToken = await refreshAccessToken();
            sessionStorage.setItem("access_token", newToken);
            processQueue(null, newToken);

            headers.set("Authorization", `Bearer ${newToken}`);
            return fetch(url, {
                ...options,
                headers,
                credentials: "include",
            });
        } catch (error) {
            processQueue(error as Error, null);
            sessionStorage.removeItem("access_token");
            window.location.href = "/login";
            throw error;
        } finally {
            isRefreshing = false;
        }
    }

    return response;
};
