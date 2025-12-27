import {
    MuscleGroup,
    type ExerciseMuscleMapping,
    PARTICIPATION_FACTORS,
} from "../types/muscleStimulus.types";

export const DEFAULT_EXERCISE_MAPPINGS: ExerciseMuscleMapping[] = [
    {
        exerciseId: 1,
        primary: MuscleGroup.PECHO,
        secondaries: [
            {
                muscleGroup: MuscleGroup.HOMBROS,
                factor: PARTICIPATION_FACTORS.SECONDARY_MEDIUM,
            },
            {
                muscleGroup: MuscleGroup.BRAZOS,
                factor: PARTICIPATION_FACTORS.SECONDARY_LOW,
            },
        ],
    },
    {
        exerciseId: 2,
        primary: MuscleGroup.ESPALDA,
        secondaries: [
            {
                muscleGroup: MuscleGroup.BRAZOS,
                factor: PARTICIPATION_FACTORS.SECONDARY_MEDIUM,
            },
            {
                muscleGroup: MuscleGroup.HOMBROS,
                factor: PARTICIPATION_FACTORS.SECONDARY_LOW,
            },
        ],
    },
    {
        exerciseId: 3,
        primary: MuscleGroup.HOMBROS,
        secondaries: [
            {
                muscleGroup: MuscleGroup.BRAZOS,
                factor: PARTICIPATION_FACTORS.SECONDARY_LOW,
            },
        ],
    },
    {
        exerciseId: 4,
        primary: MuscleGroup.BRAZOS,
        secondaries: [],
    },
    {
        exerciseId: 5,
        primary: MuscleGroup.PIERNAS,
        secondaries: [
            {
                muscleGroup: MuscleGroup.ABDOMEN,
                factor: PARTICIPATION_FACTORS.SECONDARY_LOW,
            },
        ],
    },
    {
        exerciseId: 6,
        primary: MuscleGroup.ABDOMEN,
        secondaries: [],
    },
];

export function mapMuscleGroupNameToEnum(name: string): MuscleGroup | null {
    const normalized = name.toLowerCase().trim();

    const mapping: Record<string, MuscleGroup> = {
        pecho: MuscleGroup.PECHO,
        espalda: MuscleGroup.ESPALDA,
        hombros: MuscleGroup.HOMBROS,
        hombro: MuscleGroup.HOMBROS,
        brazos: MuscleGroup.BRAZOS,
        brazo: MuscleGroup.BRAZOS,
        bíceps: MuscleGroup.BRAZOS,
        tríceps: MuscleGroup.BRAZOS,
        piernas: MuscleGroup.PIERNAS,
        pierna: MuscleGroup.PIERNAS,
        cuádriceps: MuscleGroup.PIERNAS,
        femoral: MuscleGroup.PIERNAS,
        glúteos: MuscleGroup.PIERNAS,
        abdomen: MuscleGroup.ABDOMEN,
        abdominal: MuscleGroup.ABDOMEN,
        core: MuscleGroup.ABDOMEN,
    };

    return mapping[normalized] || null;
}

export function buildExerciseMappingsFromBackend(
    exercises: Array<{
        id: number;
        muscleGroup: { name: string };
        secondaryMuscleGroups?: Array<{ muscleGroup: { name: string } }>;
    }>
): ExerciseMuscleMapping[] {
    return exercises
        .map((exercise) => {
            const primaryMuscle = mapMuscleGroupNameToEnum(
                exercise.muscleGroup.name
            );

            if (!primaryMuscle) return null;

            const secondaries = (exercise.secondaryMuscleGroups || [])
                .map((secondary) => {
                    const muscle = mapMuscleGroupNameToEnum(
                        secondary.muscleGroup.name
                    );
                    if (!muscle) return null;

                    return {
                        muscleGroup: muscle,
                        factor: PARTICIPATION_FACTORS.SECONDARY_MEDIUM,
                    };
                })
                .filter((s) => s !== null);

            return {
                exerciseId: exercise.id,
                primary: primaryMuscle,
                secondaries,
            };
        })
        .filter((m) => m !== null) as ExerciseMuscleMapping[];
}
