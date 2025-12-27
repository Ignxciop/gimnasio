import type {
    MuscleGroup,
    EffectiveSet,
    ExerciseMuscleMapping,
    WeeklyMuscleVolume,
    MuscleRadarData,
    MUSCLE_TARGET_VOLUMES,
} from "../types/muscleStimulus.types";
import { MUSCLE_TARGET_VOLUMES as TARGET_VOLUMES } from "../types/muscleStimulus.types";

export class MuscleGrowthCalculator {
    private exerciseMappings: Map<number, ExerciseMuscleMapping>;

    constructor(exerciseMappings: ExerciseMuscleMapping[] = []) {
        this.exerciseMappings = new Map(
            exerciseMappings.map((mapping) => [mapping.exerciseId, mapping])
        );
    }

    setExerciseMappings(mappings: ExerciseMuscleMapping[]): void {
        this.exerciseMappings = new Map(
            mappings.map((mapping) => [mapping.exerciseId, mapping])
        );
    }

    isSetEffective(set: EffectiveSet): boolean {
        if (!set.completed) return false;
        return set.actualReps >= set.targetRepsMin;
    }

    calculateSetVolume(set: EffectiveSet): number {
        if (!this.isSetEffective(set)) return 0;
        return set.weight * set.actualReps;
    }

    calculateWeeklyMuscleVolumes(
        weeklySets: EffectiveSet[]
    ): WeeklyMuscleVolume[] {
        const muscleVolumes = new Map<MuscleGroup, WeeklyMuscleVolume>();

        for (const set of weeklySets) {
            if (!this.isSetEffective(set)) continue;

            const mapping = this.exerciseMappings.get(set.exerciseId);
            if (!mapping) continue;

            const setVolume = this.calculateSetVolume(set);

            this.addVolumeToMuscle(
                muscleVolumes,
                mapping.primary,
                setVolume * 1.0,
                1
            );

            for (const secondary of mapping.secondaries) {
                this.addVolumeToMuscle(
                    muscleVolumes,
                    secondary.muscleGroup,
                    setVolume * secondary.factor,
                    1
                );
            }
        }

        return Array.from(muscleVolumes.values());
    }

    private addVolumeToMuscle(
        muscleVolumes: Map<MuscleGroup, WeeklyMuscleVolume>,
        muscle: MuscleGroup,
        volume: number,
        setCount: number
    ): void {
        const existing = muscleVolumes.get(muscle);
        if (existing) {
            existing.totalVolume += volume;
            existing.effectiveSets += setCount;
        } else {
            muscleVolumes.set(muscle, {
                muscle,
                totalVolume: volume,
                effectiveSets: setCount,
            });
        }
    }

    normalizeForRadarChart(
        muscleVolumes: WeeklyMuscleVolume[]
    ): MuscleRadarData[] {
        const radarData: MuscleRadarData[] = [];

        for (const [muscleKey, targetVolume] of Object.entries(
            TARGET_VOLUMES
        )) {
            const muscle = muscleKey as MuscleGroup;
            const volumeData = muscleVolumes.find((v) => v.muscle === muscle);

            const rawVolume = volumeData?.totalVolume || 0;
            const normalizedValue = (rawVolume / targetVolume) * 100;
            const cappedValue = Math.min(normalizedValue, 120);

            radarData.push({
                muscle: muscle,
                value: Math.round(cappedValue),
                rawVolume: Math.round(rawVolume),
                targetVolume: targetVolume,
            });
        }

        return radarData;
    }

    calculateWeeklyStimulus(weeklySets: EffectiveSet[]): MuscleRadarData[] {
        const muscleVolumes = this.calculateWeeklyMuscleVolumes(weeklySets);
        return this.normalizeForRadarChart(muscleVolumes);
    }
}

export const muscleGrowthCalculator = new MuscleGrowthCalculator();
