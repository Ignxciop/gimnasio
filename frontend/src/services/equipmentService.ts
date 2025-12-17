import { api } from "./api";

export interface Equipment {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
}

interface EquipmentResponse {
    success: boolean;
    data: Equipment[] | Equipment;
    message?: string;
}

export const equipmentService = {
    async getAll(token: string): Promise<Equipment[]> {
        const response = await api.get<EquipmentResponse>("/equipment", token);
        return Array.isArray(response.data) ? response.data : [response.data];
    },

    async getById(id: number, token: string): Promise<Equipment> {
        const response = await api.get<EquipmentResponse>(
            `/equipment/${id}`,
            token
        );
        return response.data as Equipment;
    },

    async create(name: string, token: string): Promise<Equipment> {
        const response = await api.post<EquipmentResponse>(
            "/equipment",
            { name },
            token
        );
        return response.data as Equipment;
    },

    async update(id: number, name: string, token: string): Promise<Equipment> {
        const response = await api.put<EquipmentResponse>(
            `/equipment/${id}`,
            { name },
            token
        );
        return response.data as Equipment;
    },

    async delete(id: number, token: string): Promise<void> {
        await api.delete(`/equipment/${id}`, token);
    },
};
