export enum MuscleGroup {
    PECHO = "Pecho",
    ESPALDA = "Espalda",
    HOMBROS = "Hombros",
    BRAZOS = "Brazos",
    PIERNAS = "Piernas",
    ABDOMEN = "Abdomen",
}

export interface MuscleParticipation {
    muscleGroup: MuscleGroup;
    factor: number;
}

export interface ExerciseMuscleMapping {
    exerciseId: number;
    primary: MuscleGroup;
    secondaries: MuscleParticipation[];
}

export interface EffectiveSet {
    exerciseId: number;
    weight: number;
    actualReps: number;
    targetRepsMin: number;
    completed: boolean;
}

export interface WeeklyMuscleVolume {
    muscle: MuscleGroup;
    totalVolume: number;
    effectiveSets: number;
}

export interface MonthlyMuscleVolume {
    muscle: MuscleGroup;
    totalVolume: number;
    effectiveSets: number;
}

export interface MuscleRadarData {
    muscle: string;
    value: number;
    rawVolume: number;
    targetVolume: number;
}

export const MUSCLE_TARGET_VOLUMES: Record<MuscleGroup, number> = {
    [MuscleGroup.PECHO]: 10000,
    [MuscleGroup.ESPALDA]: 12000,
    [MuscleGroup.HOMBROS]: 7000,
    [MuscleGroup.BRAZOS]: 6000,
    [MuscleGroup.PIERNAS]: 18000,
    [MuscleGroup.ABDOMEN]: 4000,
};

export const PARTICIPATION_FACTORS = {
    PRIMARY: 1.0,
    SECONDARY_HIGH: 0.7,
    SECONDARY_MEDIUM: 0.5,
    SECONDARY_LOW: 0.3,
};
