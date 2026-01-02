import { api } from "./api";
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
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
            {
                method: "POST",
                credentials: "include",
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
        await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
            method: "POST",
            credentials: "include",
        });
        this.removeToken();
    },

    saveToken(token: string): void {
        sessionStorage.setItem("access_token", token);
    },

    getToken(): string | null {
        return sessionStorage.getItem("access_token");
    },

    removeToken(): void {
        sessionStorage.removeItem("access_token");
    },
};
