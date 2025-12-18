import type { Folder, FolderFormData } from "../types/routine";

const API_URL = "http://localhost:3000/api";

export const folderService = {
    async getAll(): Promise<Folder[]> {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/folders`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al obtener carpetas");
        }

        const data = await response.json();
        return data.data;
    },

    async getById(id: number): Promise<Folder> {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/folders/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al obtener carpeta");
        }

        const data = await response.json();
        return data.data;
    },

    async create(folderData: FolderFormData): Promise<Folder> {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/folders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(folderData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al crear carpeta");
        }

        const data = await response.json();
        return data.data;
    },

    async update(id: number, folderData: FolderFormData): Promise<Folder> {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/folders/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(folderData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al actualizar carpeta");
        }

        const data = await response.json();
        return data.data;
    },

    async delete(id: number): Promise<void> {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/folders/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al eliminar carpeta");
        }
    },
};
