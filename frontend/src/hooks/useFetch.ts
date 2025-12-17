import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

interface UseFetchOptions<T> {
    fetchFn: (token: string) => Promise<T>;
    requiresAuth?: boolean;
}

export function useFetch<T>(options: UseFetchOptions<T>) {
    const { fetchFn, requiresAuth = true } = options;
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const execute = useCallback(async () => {
        if (requiresAuth) {
            const token = authService.getToken();
            if (!token) {
                navigate("/login");
                return;
            }
        }

        try {
            setLoading(true);
            setError(null);
            const token = authService.getToken();
            const result = await fetchFn(token!);
            setData(result);
            return result;
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : "Error al cargar datos";
            setError(errorMessage);
            console.error(errorMessage, err);
        } finally {
            setLoading(false);
        }
    }, [fetchFn, requiresAuth, navigate]);

    return { data, loading, error, execute, setData };
}
