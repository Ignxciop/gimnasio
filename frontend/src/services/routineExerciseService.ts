import type {
    RoutineExercise,
    RoutineExerciseFormData,
} from "../types/routineExercise";
import { API_BASE_URL } from "../config/constants";

const handleError = (error: any, defaultMessage: string) => {
    if (error.errors && Array.isArray(error.errors)) {
        throw new Error(
            error.errors.map((e: any) => e.message).join(", ") ||
                defaultMessage,
        );
    }
    throw new Error(error.message || defaultMessage);
};

export const routineExerciseService = {
    async getAllByRoutine(
        routineId: number,
        token: string,
    ): Promise<RoutineExercise[]> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/routines/${routineId}/exercises`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (!response.ok) {
                const error = await response.json();
                handleError(error, "No se pudieron cargar los ejercicios");
            }

            const data = await response.json();
            return data.data;
        } catch (error: any) {
            if (error.message) {
                throw error;
            }
            throw new Error(
                "No se pudieron cargar los ejercicios. Intenta nuevamente",
            );
        }
    },

    async create(
        routineId: number,
        data: RoutineExerciseFormData,
        token: string,
    ): Promise<RoutineExercise> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/routines/${routineId}/exercises`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(data),
                },
            );

            if (!response.ok) {
                const error = await response.json();
                handleError(error, "No se pudo agregar el ejercicio");
            }

            const result = await response.json();
            return result.data;
        } catch (error: any) {
            if (error.message) {
                throw error;
            }
            throw new Error(
                "No se pudo agregar el ejercicio. Intenta nuevamente",
            );
        }
    },

    async update(
        id: number,
        data: Omit<RoutineExerciseFormData, "exerciseId"> & {
            exerciseId?: number;
        },
        token: string,
    ): Promise<RoutineExercise> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/routine-exercises/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(data),
                },
            );

            if (!response.ok) {
                const error = await response.json();
                handleError(error, "No se pudo actualizar el ejercicio");
            }

            const result = await response.json();
            return result.data;
        } catch (error: any) {
            if (error.message) {
                throw error;
            }
            throw new Error(
                "No se pudo actualizar el ejercicio. Intenta nuevamente",
            );
        }
    },

    async delete(id: number, token: string): Promise<void> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/routine-exercises/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (!response.ok) {
                const error = await response.json();
                handleError(error, "No se pudo eliminar el ejercicio");
            }
        } catch (error: any) {
            if (error.message) {
                throw error;
            }
            throw new Error(
                "No se pudo eliminar el ejercicio. Intenta nuevamente",
            );
        }
    },

    async reorder(
        items: Array<{ id: number; order: number }>,
        token: string,
    ): Promise<void> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/routine-exercises/reorder`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ items }),
                },
            );

            if (!response.ok) {
                const error = await response.json();
                handleError(error, "No se pudo actualizar el orden");
            }
        } catch (error: any) {
            if (error.message) {
                throw error;
            }
            throw new Error(
                "No se pudo actualizar el orden. Intenta nuevamente",
            );
        }
    },
};
