import { useState, useCallback } from "react";
import { authService } from "../services/authService";

interface UseDeleteOptions {
    deleteFn: (id: number, token: string) => Promise<void>;
    onSuccess?: () => void;
    onError?: (error: any) => void;
    confirmTitle?: string;
    confirmMessage?: string;
}

export function useDelete(options: UseDeleteOptions) {
    const {
        deleteFn,
        onSuccess,
        onError,
        confirmTitle = "Confirmar eliminación",
        confirmMessage = "¿Estás seguro de eliminar este elemento?",
    } = options;
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingId, setPendingId] = useState<number | null>(null);

    const startDelete = useCallback((id: number) => {
        setPendingId(id);
        setShowConfirm(true);
    }, []);

    const confirmDelete = useCallback(async () => {
        if (pendingId === null) return;

        const token = authService.getToken();
        if (!token) return;

        try {
            setDeletingId(pendingId);
            setShowConfirm(false);
            await deleteFn(pendingId, token);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error al eliminar:", error);
            if (onError) onError(error);
        } finally {
            setDeletingId(null);
            setPendingId(null);
        }
    }, [pendingId, deleteFn, onSuccess, onError]);

    const cancelDelete = useCallback(() => {
        setShowConfirm(false);
        setPendingId(null);
    }, []);

    return {
        deleteItem: startDelete,
        confirmDelete,
        cancelDelete,
        deletingId,
        showConfirm,
        confirmTitle,
        confirmMessage,
    };
}
