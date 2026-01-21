import { api } from "./api";
import { tokenStorage } from "./tokenStorage";
import { API_BASE_URL } from "../config/constants";
import type {
    LoginCredentials,
    LoginResponse,
    RegisterData,
    RegisterResponse,
} from "../types/auth.types";

let isRefreshing = false;
let refreshPromise: Promise<{ accessToken: string }> | null = null;

export const authService = {
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>(
            "/auth/login",
            credentials,
        );
        if (response.data.accessToken) {
            this.saveToken(response.data.accessToken);
        }
        return response;
    },

    async register(data: RegisterData): Promise<RegisterResponse> {
        return api.post<RegisterResponse>("/auth/register", data);
    },

    async refresh(): Promise<{ accessToken: string }> {
        if (isRefreshing && refreshPromise) {
            return refreshPromise;
        }

        isRefreshing = true;
        refreshPromise = (async () => {
            try {
                const csrfResponse = await fetch(
                    `${API_BASE_URL}/auth/csrf-token`,
                    {
                        method: "GET",
                        credentials: "include", // Necesario para CSRF
                    },
                );

                if (!csrfResponse.ok) {
                    throw new Error("Failed to get CSRF token");
                }

                const { csrfToken } = await csrfResponse.json();

                const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "x-csrf-token": csrfToken,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to refresh token");
                }

                const data = await response.json();
                if (data.data.accessToken) {
                    this.saveToken(data.data.accessToken);
                }
                return data.data;
            } finally {
                isRefreshing = false;
                refreshPromise = null;
            }
        })();

        return refreshPromise;
    },

    async logout(): Promise<void> {
        const csrfResponse = await fetch(`${API_BASE_URL}/auth/csrf-token`, {
            method: "GET",
            credentials: "include",
        });

        if (csrfResponse.ok) {
            const { csrfToken } = await csrfResponse.json();
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "x-csrf-token": csrfToken,
                },
            });
        }

        this.clearAuth();
    },

    saveToken(token: string): void {
        tokenStorage.setToken(token);
    },

    getToken(): string | null {
        return tokenStorage.getToken();
    },

    removeToken(): void {
        tokenStorage.removeToken();
    },

    clearAuth(): void {
        this.removeToken();
        const currentPath = window.location.pathname;
        if (currentPath !== "/login" && currentPath !== "/register") {
            window.location.href = "/login";
        }
    },

    async initializeAuth(): Promise<boolean> {
        const currentPath = window.location.pathname;
        const isPublicRoute =
            currentPath === "/login" ||
            currentPath === "/register" ||
            currentPath === "/";

        if (isPublicRoute) {
            return false;
        }

        const token = this.getToken();

        if (token && this.isTokenValid()) {
            return true;
        }

        try {
            await this.refresh();
            return true;
        } catch (error) {
            this.removeToken();
            return false;
        }
    },

    isTokenValid(): boolean {
        const token = this.getToken();
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const expirationTime = payload.exp * 1000;
            return Date.now() < expirationTime;
        } catch (error) {
            return false;
        }
    },

    getUserIdFromToken(): string | null {
        const token = this.getToken();
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.userId || null;
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    },
};
