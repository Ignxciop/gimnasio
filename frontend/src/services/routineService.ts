import type { Routine, RoutineFormData } from "../types/routine";

const handleError = (error: any, defaultMessage: string): never => {
    if (error.message) {
        throw new Error(error.message);
    }
    throw new Error(defaultMessage);
};

export const routineService = {
    async getAll(token: string): Promise<Routine[]> {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/routines`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al obtener rutinas");
        }

        const data = await response.json();
        return data.data;
    },

    async getById(id: number, token: string): Promise<Routine> {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/routines/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al obtener rutina");
        }

        const data = await response.json();
        return data.data;
    },

    async create(
        routineData: RoutineFormData,
        token: string
    ): Promise<Routine> {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/routines`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(routineData),
                }
            );

            if (!response.ok) {
                const error = await response.json();
                handleError(error, "No se pudo crear la rutina");
            }

            const data = await response.json();
            return data.data;
        } catch (error: any) {
            if (error.message) {
                throw error;
            }
            throw new Error("No se pudo crear la rutina. Intenta nuevamente");
        }
    },

    async update(
        id: number,
        routineData: RoutineFormData,
        token: string
    ): Promise<Routine> {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/routines/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(routineData),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al actualizar rutina");
        }

        const data = await response.json();
        return data.data;
    },

    async move(
        id: number,
        folderId: number | null,
        token: string
    ): Promise<Routine> {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/routines/${id}/move`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ folderId }),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al mover rutina");
        }

        const data = await response.json();
        return data.data;
    },

    async delete(id: number, token: string): Promise<void> {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/routines/${id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al eliminar rutina");
        }
    },

    async reorder(
        items: Array<{ id: number; order: number; folderId: number | null }>,
        token: string
    ): Promise<void> {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/routines/reorder`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ items }),
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(
                    error.message || "No se pudo actualizar el orden"
                );
            }
        } catch (error: any) {
            if (error.message) {
                throw error;
            }
            throw new Error(
                "No se pudo actualizar el orden. Intenta nuevamente"
            );
        }
    },
};
