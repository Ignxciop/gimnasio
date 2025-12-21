import api from "./api";

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

export const activeRoutineService = {
    async getActive(token: string): Promise<ActiveRoutine | null> {
        const response = await api.get("/active-routines/active", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.data;
    },

    async create(routineId: number, token: string): Promise<ActiveRoutine> {
        const response = await api.post(
            "/active-routines",
            { routineId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data.data;
    },

    async updateSet(
        setId: number,
        actualWeight: number | null,
        actualReps: number | null,
        token: string
    ): Promise<ActiveRoutineSet> {
        const response = await api.put(
            `/active-routines/sets/${setId}`,
            { actualWeight, actualReps },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data.data;
    },

    async reorderSets(setIds: number[], token: string): Promise<void> {
        await api.put(
            "/active-routines/reorder",
            { setIds },
            { headers: { Authorization: `Bearer ${token}` } }
        );
    },

    async complete(activeRoutineId: number, token: string): Promise<void> {
        await api.post(
            `/active-routines/${activeRoutineId}/complete`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
    },
};
