import { useState, useEffect } from "react";
import { profileService } from "../services/profileService";
import { authService } from "../services/authService";
import type { User } from "../types/auth.types";

export function useAuthUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = authService.getToken();
            if (!token || !authService.isTokenValid()) {
                setLoading(false);
                return;
            }

            try {
                const userData = await profileService.getProfile();
                setUser(userData);
            } catch (err) {
                console.error("Error fetching user profile:", err);
                setError("Error al cargar información del usuario");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const hasRole = (requiredRole: string): boolean => {
        if (!user) return false;
        return user.role.role === requiredRole;
    };

    const hasAnyRole = (requiredRoles: string[]): boolean => {
        if (!user) return false;
        return requiredRoles.includes(user.role.role);
    };

    const isAdmin = (): boolean => hasRole("administrador");
    const isGestion = (): boolean => hasRole("manager");
    const isUser = (): boolean => hasRole("usuario");

    return {
        user,
        loading,
        error,
        hasRole,
        hasAnyRole,
        isAdmin,
        isGestion,
        isUser,
    };
}
