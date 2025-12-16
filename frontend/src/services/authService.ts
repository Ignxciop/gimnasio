import { api } from "./api";
import type { LoginCredentials, LoginResponse } from "../types/auth.types";

export const authService = {
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        return api.post<LoginResponse>("/api/auth/login", credentials);
    },

    saveToken(token: string): void {
        localStorage.setItem("auth_token", token);
    },

    getToken(): string | null {
        return localStorage.getItem("auth_token");
    },

    removeToken(): void {
        localStorage.removeItem("auth_token");
    },
};
