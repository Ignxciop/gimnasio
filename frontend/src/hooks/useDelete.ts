import { useState, useCallback } from "react";
import { authService } from "../services/authService";

interface UseDeleteOptions {
    deleteFn: (id: number, token: string) => Promise<void>;
    onSuccess?: () => void;
    confirmMessage?: string;
}

export function useDelete(options: UseDeleteOptions) {
    const {
        deleteFn,
        onSuccess,
        confirmMessage = "¿Estás seguro de eliminar este elemento?",
    } = options;
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const deleteItem = useCallback(
        async (id: number) => {
            if (!confirm(confirmMessage)) return;

            const token = authService.getToken();
            if (!token) return;

            try {
                setDeletingId(id);
                await deleteFn(id, token);
                if (onSuccess) onSuccess();
            } catch (error) {
                console.error("Error al eliminar:", error);
            } finally {
                setDeletingId(null);
            }
        },
        [deleteFn, onSuccess, confirmMessage]
    );

    return { deleteItem, deletingId };
}
