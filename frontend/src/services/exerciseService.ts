import { api } from "./api";

export interface Exercise {
    id: number;
    name: string;
    equipmentId: number;
    muscleGroupId: number;
    videoPath?: string | null;
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
        token: string,
        videoFile?: File | null
    ): Promise<Exercise> {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("equipmentId", equipmentId.toString());
        formData.append("muscleGroupId", muscleGroupId.toString());
        formData.append(
            "secondaryMuscleGroupIds",
            JSON.stringify(secondaryMuscleGroupIds)
        );
        if (videoFile) {
            formData.append("video", videoFile);
        }

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/exercises`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al crear el ejercicio");
        }

        const data = await response.json();
        return data.data as Exercise;
    },

    async update(
        id: number,
        name: string,
        equipmentId: number,
        muscleGroupId: number,
        secondaryMuscleGroupIds: number[],
        token: string,
        videoFile?: File | null
    ): Promise<Exercise> {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("equipmentId", equipmentId.toString());
        formData.append("muscleGroupId", muscleGroupId.toString());
        formData.append(
            "secondaryMuscleGroupIds",
            JSON.stringify(secondaryMuscleGroupIds)
        );
        if (videoFile) {
            formData.append("video", videoFile);
        }

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/exercises/${id}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                errorData.message || "Error al actualizar el ejercicio"
            );
        }

        const data = await response.json();
        return data.data as Exercise;
    },

    async delete(id: number, token: string): Promise<void> {
        await api.delete(`/exercises/${id}`, token);
    },
};
