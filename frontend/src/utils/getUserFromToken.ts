import { authService } from "../services/authService";
import type { User } from "../types/auth.types";

export const getUserFromToken = (): User | null => {
    const token = authService.getToken();
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.user || null;
    } catch {
        return null;
    }
};
