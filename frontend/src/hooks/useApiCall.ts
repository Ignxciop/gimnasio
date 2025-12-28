import { useState, useCallback } from "react";
import { useToast } from "./useToast";

interface UseApiCallOptions<T> {
    onSuccess?: (data: T) => void;
    onError?: (error: unknown) => void;
    successMessage?: string;
    errorMessage?: string;
    showSuccessToast?: boolean;
    showErrorToast?: boolean;
}

interface UseApiCallReturn<T, Args extends unknown[]> {
    execute: (...args: Args) => Promise<T | undefined>;
    loading: boolean;
    error: Error | null;
    data: T | null;
}

export function useApiCall<T, Args extends unknown[] = []>(
    apiFunction: (...args: Args) => Promise<T>,
    options: UseApiCallOptions<T> = {}
): UseApiCallReturn<T, Args> {
    const {
        onSuccess,
        onError,
        successMessage,
        errorMessage,
        showSuccessToast = false,
        showErrorToast = true,
    } = options;

    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<T | null>(null);

    const execute = useCallback(
        async (...args: Args): Promise<T | undefined> => {
            setLoading(true);
            setError(null);

            try {
                const result = await apiFunction(...args);
                setData(result);

                if (showSuccessToast && successMessage) {
                    showToast("success", successMessage);
                }

                if (onSuccess) {
                    onSuccess(result);
                }

                return result;
            } catch (err) {
                const error =
                    err instanceof Error ? err : new Error("Unknown error");
                setError(error);

                if (showErrorToast) {
                    const message =
                        errorMessage || error.message || "Error desconocido";
                    showToast("error", message);
                }

                if (onError) {
                    onError(err);
                }

                return undefined;
            } finally {
                setLoading(false);
            }
        },
        [
            apiFunction,
            onSuccess,
            onError,
            successMessage,
            errorMessage,
            showSuccessToast,
            showErrorToast,
            showToast,
        ]
    );

    return { execute, loading, error, data };
}
