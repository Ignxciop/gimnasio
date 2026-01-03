import { api } from "./api";
import { authService } from "./authService";
import type { User } from "../types/auth.types";

interface ProfileResponse {
    success: boolean;
    message: string;
    data: User;
}

interface ProfileData {
    id: string;
    name: string;
    lastname: string;
    username: string;
    email?: string;
    gender: "male" | "female";
    isProfilePublic: boolean;
    role: {
        role: string;
    };
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

    async getProfileByUsername(
        username: string,
        token: string | null
    ): Promise<ProfileData> {
        const headers: HeadersInit = {};
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/profile/${username}`,
            {
                headers,
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al obtener perfil");
        }

        const data = await response.json();
        return data.data;
    },

    async updatePrivacy(
        isPublic: boolean,
        token: string
    ): Promise<ProfileData> {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/profile/privacy`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ isPublic }),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(
                error.message || "Error al actualizar privacidad del perfil"
            );
        }

        const data = await response.json();
        return data.data;
    },
};

export type { ProfileData };
