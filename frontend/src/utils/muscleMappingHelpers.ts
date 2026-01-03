import type { MuscleRadarData } from "../types/muscleStimulus.types";
import { getMuscleColor, getStimulusLiga } from "../types/muscleLiga.types";

interface MuscleDataResult {
    pechoValue: number;
    espaldaValue: number;
    hombrosValue: number;
    brazosValue: number;
    piernasValue: number;
    abdomenValue: number;
    pechoColor: string;
    espaldaColor: string;
    hombrosColor: string;
    brazosColor: string;
    piernasColor: string;
    abdomenColor: string;
    pechoLiga: ReturnType<typeof getStimulusLiga>;
    espaldaLiga: ReturnType<typeof getStimulusLiga>;
    hombrosLiga: ReturnType<typeof getStimulusLiga>;
    brazosLiga: ReturnType<typeof getStimulusLiga>;
    piernasLiga: ReturnType<typeof getStimulusLiga>;
    abdomenLiga: ReturnType<typeof getStimulusLiga>;
}

export const processMuscleData = (
    muscleData: MuscleRadarData[]
): MuscleDataResult => {
    const getMuscleValue = (muscleName: string): number => {
        const muscle = muscleData.find((m) => m.muscle === muscleName);
        return muscle?.value || 0;
    };

    const pechoValue = getMuscleValue("Pecho");
    const espaldaValue = getMuscleValue("Espalda");
    const hombrosValue = getMuscleValue("Hombros");
    const brazosValue = getMuscleValue("Brazos");
    const piernasValue = getMuscleValue("Piernas");
    const abdomenValue = getMuscleValue("Abdomen");

    const pechoColor = getMuscleColor(pechoValue);
    const espaldaColor = getMuscleColor(espaldaValue);
    const hombrosColor = getMuscleColor(hombrosValue);
    const brazosColor = getMuscleColor(brazosValue);
    const piernasColor = getMuscleColor(piernasValue);
    const abdomenColor = getMuscleColor(abdomenValue);

    const pechoLiga = getStimulusLiga(pechoValue);
    const espaldaLiga = getStimulusLiga(espaldaValue);
    const hombrosLiga = getStimulusLiga(hombrosValue);
    const brazosLiga = getStimulusLiga(brazosValue);
    const piernasLiga = getStimulusLiga(piernasValue);
    const abdomenLiga = getStimulusLiga(abdomenValue);

    return {
        pechoValue,
        espaldaValue,
        hombrosValue,
        brazosValue,
        piernasValue,
        abdomenValue,
        pechoColor,
        espaldaColor,
        hombrosColor,
        brazosColor,
        piernasColor,
        abdomenColor,
        pechoLiga,
        espaldaLiga,
        hombrosLiga,
        brazosLiga,
        piernasLiga,
        abdomenLiga,
    };
};
