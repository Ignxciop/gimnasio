import { api } from "./api";

export interface Exercise {
    id: number;
    name: string;
    equipmentId: number;
    muscleGroupId: number;
    equipment: {
        id: number;
        name: string;
    };
    muscleGroup: {
        id: number;
        name: string;
    };
    secondaryMuscleGroups?: {
        muscleGroupId: number;
        muscleGroup: {
            id: number;
            name: string;
        };
    }[];
    createdAt: string;
    updatedAt: string;
}

interface ExerciseResponse {
    success: boolean;
    data: Exercise[] | Exercise;
    message?: string;
}

export const exerciseService = {
    async getAll(token: string): Promise<Exercise[]> {
        const response = await api.get<ExerciseResponse>("/exercises", token);
        return Array.isArray(response.data) ? response.data : [response.data];
    },

    async getById(id: number, token: string): Promise<Exercise> {
        const response = await api.get<ExerciseResponse>(
            `/exercises/${id}`,
            token
        );
        return response.data as Exercise;
    },

    async create(
        name: string,
        equipmentId: number,
        muscleGroupId: number,
        secondaryMuscleGroupIds: number[],
        token: string
    ): Promise<Exercise> {
        const response = await api.post<ExerciseResponse>(
            "/exercises",
            { name, equipmentId, muscleGroupId, secondaryMuscleGroupIds },
            token
        );
        return response.data as Exercise;
    },

    async update(
        id: number,
        name: string,
        equipmentId: number,
        muscleGroupId: number,
        secondaryMuscleGroupIds: number[],
        token: string
    ): Promise<Exercise> {
        const response = await api.put<ExerciseResponse>(
            `/exercises/${id}`,
            { name, equipmentId, muscleGroupId, secondaryMuscleGroupIds },
            token
        );
        return response.data as Exercise;
    },

    async delete(id: number, token: string): Promise<void> {
        await api.delete(`/exercises/${id}`, token);
    },
};
