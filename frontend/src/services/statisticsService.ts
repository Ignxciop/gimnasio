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

interface MonthlySetsResponse {
    success: boolean;
    data: ActiveRoutineSetResponse[];
}

interface MonthsResponse {
    success: boolean;
    data: string[];
}

export const statisticsService = {
    async getMonthlySets(
        userId: string,
        year: number,
        month: number,
        token: string | null
    ): Promise<EffectiveSet[]> {
        const headers: HeadersInit = {};
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(
            `${API_URL}/statistics/monthly-sets?userId=${userId}&year=${year}&month=${month}`,
            {
                headers,
            }
        );

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error("Este perfil es privado");
            }
            throw new Error("Error al obtener sets mensuales");
        }

        const data: MonthlySetsResponse = await response.json();

        return data.data.map((set) => ({
            exerciseId: set.exerciseId,
            weight: parseFloat(set.actualWeight || "0"),
            actualReps: set.actualReps || 0,
            targetRepsMin: set.targetRepsMin,
            completed: set.completed,
        }));
    },

    async getMonthsWithWorkouts(
        userId: string,
        token: string | null
    ): Promise<string[]> {
        const headers: HeadersInit = {};
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(
            `${API_URL}/statistics/months-with-workouts?userId=${userId}`,
            {
                headers,
            }
        );

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error("Este perfil es privado");
            }
            throw new Error("Error al obtener meses con entrenamientos");
        }

        const data: MonthsResponse = await response.json();
        return data.data;
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
