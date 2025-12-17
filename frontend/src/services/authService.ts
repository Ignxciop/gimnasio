import { api } from "./api";
import type {
    LoginCredentials,
    LoginResponse,
    RegisterData,
    RegisterResponse,
} from "../types/auth.types";

export const authService = {
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        return api.post<LoginResponse>("/auth/login", credentials);
    },

    async register(data: RegisterData): Promise<RegisterResponse> {
        return api.post<RegisterResponse>("/auth/register", data);
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
