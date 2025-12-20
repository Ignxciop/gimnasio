import { Exercise } from "./exercise";

export interface RoutineExercise {
    id: number;
    routineId: number;
    exerciseId: number;
    sets: number;
    reps: number;
    weight: number | null;
    restTime: number;
    order: number;
    exercise?: Exercise;
    createdAt: string;
    updatedAt: string;
}

export interface RoutineExerciseFormData {
    exerciseId: number;
    sets: number;
    reps: number;
    weight?: number;
    restTime: number;
}
