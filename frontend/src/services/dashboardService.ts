interface RecentWorkout {
    id: number;
    routineName: string;
    date: string;
    duration: number;
    completedSets: number;
}

const API_URL = "http://localhost:3000/api";

export const dashboardService = {
    async getCompletedDates(
        year: number,
        month: number,
        token: string
    ): Promise<number[]> {
        const response = await fetch(
            `${API_URL}/active-routines/completed/dates?year=${year}&month=${month}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(
                error.message || "Error al obtener fechas completadas"
            );
        }

        const data = await response.json();
        return data.data;
    },

    async getRecentWorkouts(
        token: string,
        limit: number = 3
    ): Promise<RecentWorkout[]> {
        const response = await fetch(
            `${API_URL}/active-routines/completed/recent?limit=${limit}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(
                error.message || "Error al obtener entrenamientos recientes"
            );
        }

        const data = await response.json();
        return data.data;
    },
};

export type { RecentWorkout };
