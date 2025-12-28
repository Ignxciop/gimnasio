import { useState, useCallback } from "react";
import { authService } from "../services/authService";
import { useToast } from "./useToast";

interface UseDeleteOptions {
    deleteFn: (id: number, token: string) => Promise<void>;
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
    confirmTitle?: string;
    confirmMessage?: string;
    successMessage?: string;
    errorMessage?: string;
}

export function useDelete(options: UseDeleteOptions) {
    const {
        deleteFn,
        onSuccess,
        onError,
        confirmTitle = "Confirmar eliminación",
        confirmMessage = "¿Estás seguro de eliminar este elemento?",
        successMessage,
        errorMessage,
    } = options;
    const { showToast } = useToast();
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
            if (successMessage) {
                showToast("success", successMessage);
            }
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error al eliminar:", error);
            if (errorMessage) {
                showToast("error", errorMessage);
            }
            if (onError) onError(error);
        } finally {
            setDeletingId(null);
            setPendingId(null);
        }
    }, [
        pendingId,
        deleteFn,
        onSuccess,
        onError,
        successMessage,
        errorMessage,
        showToast,
    ]);

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
