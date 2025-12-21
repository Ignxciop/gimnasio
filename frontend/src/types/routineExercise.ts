import { Exercise } from "./exercise";

export interface RoutineExercise {
    id: number;
    routineId: number;
    exerciseId: number;
    sets: number;
    repsMin: number;
    repsMax: number;
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
    repsMin: number;
    repsMax: number;
    weight?: number;
    restTime: number;
}
