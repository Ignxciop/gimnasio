import type { Folder, FolderFormData } from "../types/routine";

const API_URL = "http://localhost:3000/api";

const handleError = (error: any, defaultMessage: string): never => {
    if (error.message) {
        throw new Error(error.message);
    }
    throw new Error(defaultMessage);
};

export const folderService = {
    async getAll(token: string): Promise<Folder[]> {
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

    async getById(id: number, token: string): Promise<Folder> {
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

    async create(folderData: FolderFormData, token: string): Promise<Folder> {
        try {
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
                handleError(error, "No se pudo crear la carpeta");
            }

            const data = await response.json();
            return data.data;
        } catch (error: any) {
            if (error.message) {
                throw error;
            }
            throw new Error("No se pudo crear la carpeta. Intenta nuevamente");
        }
    },

    async update(
        id: number,
        folderData: FolderFormData,
        token: string
    ): Promise<Folder> {
        try {
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
                handleError(error, "No se pudo actualizar la carpeta");
            }

            const data = await response.json();
            return data.data;
        } catch (error: any) {
            if (error.message) {
                throw error;
            }
            throw new Error(
                "No se pudo actualizar la carpeta. Intenta nuevamente"
            );
        }
    },

    async delete(id: number, token: string): Promise<void> {
        try {
            const response = await fetch(`${API_URL}/folders/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const error = await response.json();
                handleError(error, "No se pudo eliminar la carpeta");
            }
        } catch (error: any) {
            if (error.message) {
                throw error;
            }
            throw new Error(
                "No se pudo eliminar la carpeta. Intenta nuevamente"
            );
        }
    },

    async reorder(
        items: Array<{ id: number; order: number }>,
        token: string
    ): Promise<void> {
        try {
            const response = await fetch(`${API_URL}/folders/reorder`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ items }),
            });

            if (!response.ok) {
                const error = await response.json();
                handleError(error, "No se pudo actualizar el orden");
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
