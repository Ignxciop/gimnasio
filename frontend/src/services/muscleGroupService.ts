import { api } from "./api";

export interface MuscleGroup {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
}

interface MuscleGroupResponse {
    success: boolean;
    data: MuscleGroup[] | MuscleGroup;
    message?: string;
}

export const muscleGroupService = {
    async getAll(token: string): Promise<MuscleGroup[]> {
        const response = await api.get<MuscleGroupResponse>(
            "/muscle-groups",
            token
        );
        return Array.isArray(response.data) ? response.data : [response.data];
    },

    async getById(id: number, token: string): Promise<MuscleGroup> {
        const response = await api.get<MuscleGroupResponse>(
            `/muscle-groups/${id}`,
            token
        );
        return response.data as MuscleGroup;
    },

    async create(name: string, token: string): Promise<MuscleGroup> {
        const response = await api.post<MuscleGroupResponse>(
            "/muscle-groups",
            { name },
            token
        );
        return response.data as MuscleGroup;
    },

    async update(
        id: number,
        name: string,
        token: string
    ): Promise<MuscleGroup> {
        const response = await api.put<MuscleGroupResponse>(
            `/muscle-groups/${id}`,
            { name },
            token
        );
        return response.data as MuscleGroup;
    },

    async delete(id: number, token: string): Promise<void> {
        await api.delete(`/muscle-groups/${id}`, token);
    },
};
