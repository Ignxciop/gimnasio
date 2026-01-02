interface RecentWorkout {
    id: number;
    routineName: string;
    date: string;
    duration: number;
    completedSets: number;
}

interface WorkoutSet {
    id: number;
    exerciseId: number;
    setNumber: number;
    targetWeight: number | null;
    targetRepsMin: number;
    targetRepsMax: number;
    actualWeight: number | null;
    actualReps: number | null;
    completed: boolean;
    isPR: boolean;
    order: number;
    exercise: {
        id: number;
        name: string;
        videoPath: string | null;
        equipment: {
            id: number;
            name: string;
        };
        muscleGroup: {
            id: number;
            name: string;
        };
    };
}

interface DayWorkout {
    id: number;
    userId: string;
    routineId: number;
    routineName: string;
    startTime: string;
    endTime: string;
    duration: number;
    sets: WorkoutSet[];
}

interface WeeklyStreak {
    currentStreak: number;
}

interface MonthlyStats {
    current: {
        totalWorkouts: number;
        totalTime: number;
        totalVolume: number;
    };
    comparison: {
        workouts: number;
        time: number;
        volume: number;
    };
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

    async getWorkoutsByDate(
        year: number,
        month: number,
        day: number,
        token: string
    ): Promise<DayWorkout[]> {
        const response = await fetch(
            `${API_URL}/active-routines/completed/by-date?year=${year}&month=${month}&day=${day}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(
                error.message || "Error al obtener entrenamientos del día"
            );
        }

        const data = await response.json();
        return data.data;
    },

    async getWeeklyStreak(token: string): Promise<WeeklyStreak> {
        const response = await fetch(
            `${API_URL}/active-routines/streak/weekly`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al obtener streak semanal");
        }

        const data = await response.json();
        return data.data;
    },

    async getMonthlyStats(
        year: number,
        month: number,
        token: string
    ): Promise<MonthlyStats> {
        const response = await fetch(
            `${API_URL}/active-routines/stats/monthly?year=${year}&month=${month}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(
                error.message || "Error al obtener estadísticas mensuales"
            );
        }

        const data = await response.json();
        return data.data;
    },
};

export type {
    RecentWorkout,
    DayWorkout,
    WorkoutSet,
    WeeklyStreak,
    MonthlyStats,
};
