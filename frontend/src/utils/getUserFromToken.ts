import { authService } from "../services/authService";

interface TokenPayload {
    userId: number;
    email: string;
    roleId: number;
}

export const getUserFromToken = (): TokenPayload | null => {
    const token = authService.getToken();
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload || null;
    } catch {
        return null;
    }
};
