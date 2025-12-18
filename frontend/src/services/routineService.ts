import type { Routine, RoutineFormData } from "../types/routine";

const API_URL = "http://localhost:3000/api";

export const routineService = {
    async getAll(): Promise<Routine[]> {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/routines`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al obtener rutinas");
        }

        const data = await response.json();
        return data.data;
    },

    async getById(id: number): Promise<Routine> {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/routines/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al obtener rutina");
        }

        const data = await response.json();
        return data.data;
    },

    async create(routineData: RoutineFormData): Promise<Routine> {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/routines`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(routineData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al crear rutina");
        }

        const data = await response.json();
        return data.data;
    },

    async update(id: number, routineData: RoutineFormData): Promise<Routine> {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/routines/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(routineData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al actualizar rutina");
        }

        const data = await response.json();
        return data.data;
    },

    async move(id: number, folderId: number | null): Promise<Routine> {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/routines/${id}/move`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ folderId }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al mover rutina");
        }

        const data = await response.json();
        return data.data;
    },

    async delete(id: number): Promise<void> {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/routines/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al eliminar rutina");
        }
    },
};
