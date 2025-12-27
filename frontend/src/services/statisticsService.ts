import type { EffectiveSet } from "../types/muscleStimulus.types";

const API_URL = "http://localhost:3000/api";

interface ActiveRoutineSetResponse {
    id: number;
    exerciseId: number;
    targetWeight: string | null;
    targetRepsMin: number;
    targetRepsMax: number;
    actualWeight: string | null;
    actualReps: number | null;
    completed: boolean;
}

interface WeeklySetsResponse {
    success: boolean;
    data: ActiveRoutineSetResponse[];
}

export const statisticsService = {
    async getWeeklySets(
        userId: string,
        token: string
    ): Promise<EffectiveSet[]> {
        const today = new Date();
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);

        const response = await fetch(
            `${API_URL}/statistics/weekly-sets?userId=${userId}&startDate=${weekAgo.toISOString()}&endDate=${today.toISOString()}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error("Error al obtener sets semanales");
        }

        const data: WeeklySetsResponse = await response.json();

        return data.data.map((set) => ({
            exerciseId: set.exerciseId,
            weight: parseFloat(set.actualWeight || "0"),
            actualReps: set.actualReps || 0,
            targetRepsMin: set.targetRepsMin,
            completed: set.completed,
        }));
    },

    async getExercises(token: string) {
        const response = await fetch(`${API_URL}/exercises`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error al obtener ejercicios");
        }

        const data = await response.json();
        return data.data;
    },
};
