interface ActiveRoutineSet {
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

interface ActiveRoutine {
    id: number;
    userId: number;
    routineId: number;
    startTime: string;
    endTime: string | null;
    status: string;
    routine: {
        id: number;
        name: string;
        description: string | null;
    };
    sets: ActiveRoutineSet[];
}

const API_URL = "http://localhost:3000/api";

export const activeRoutineService = {
    async getActive(token: string): Promise<ActiveRoutine | null> {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/active-routines/active`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al obtener rutina activa");
        }

        const data = await response.json();
        return data.data;
    },

    async create(routineId: number, token: string): Promise<ActiveRoutine> {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/active-routines`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ routineId }),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al crear rutina activa");
        }

        const data = await response.json();
        return data.data;
    },

    async updateSet(
        setId: number,
        actualWeight: number | null,
        actualReps: number | null,
        token: string
    ): Promise<ActiveRoutineSet> {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/active-routines/sets/${setId}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ actualWeight, actualReps }),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al actualizar serie");
        }

        const data = await response.json();
        return data.data;
    },

    async reorderSets(setIds: number[], token: string): Promise<void> {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/active-routines/reorder`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ setIds }),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al reordenar series");
        }
    },

    async complete(activeRoutineId: number, token: string): Promise<void> {
        const response = await fetch(
            `${
                import.meta.env.VITE_API_URL
            }/active-routines/${activeRoutineId}/complete`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al completar rutina");
        }
    },

    async cancel(activeRoutineId: number, token: string): Promise<void> {
        const response = await fetch(
            `${
                import.meta.env.VITE_API_URL
            }/active-routines/${activeRoutineId}/cancel`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al cancelar rutina");
        }
    },

    async addSet(exerciseId: number, token: string): Promise<ActiveRoutineSet> {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/active-routines/sets`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ exerciseId }),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al agregar serie");
        }

        const data = await response.json();
        return data.data;
    },

    async removeSet(setId: number, token: string): Promise<void> {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/active-routines/sets/${setId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al eliminar serie");
        }
    },
};
