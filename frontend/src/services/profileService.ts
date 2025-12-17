import { api } from "./api";
import { authService } from "./authService";
import type { User } from "../types/auth.types";

interface ProfileResponse {
    success: boolean;
    message: string;
    data: User;
}

export const profileService = {
    async getProfile(): Promise<User> {
        const token = authService.getToken();
        if (!token) {
            throw new Error("No hay token de autenticación");
        }

        const response = await api.get<ProfileResponse>("/profile/me", token);
        return response.data;
    },
};
