import { api } from "./api";
import { tokenStorage } from "./tokenStorage";
import type {
    LoginCredentials,
    LoginResponse,
    RegisterData,
    RegisterResponse,
} from "../types/auth.types";

export const authService = {
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>(
            "/auth/login",
            credentials
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
        const csrfResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/api/auth/csrf-token`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        if (!csrfResponse.ok) {
            throw new Error("Failed to get CSRF token");
        }

        const { csrfToken } = await csrfResponse.json();

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "x-csrf-token": csrfToken,
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to refresh token");
        }

        const data = await response.json();
        if (data.data.accessToken) {
            this.saveToken(data.data.accessToken);
        }
        return data.data;
    },

    async logout(): Promise<void> {
        const csrfResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/api/auth/csrf-token`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        if (csrfResponse.ok) {
            const { csrfToken } = await csrfResponse.json();
            await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
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
        if (
            window.location.pathname !== "/login" &&
            window.location.pathname !== "/register"
        ) {
            window.location.href = "/login";
        }
    },

    async initializeAuth(): Promise<boolean> {
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
