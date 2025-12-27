export const MuscleLiga = {
    BRONCE: "Bronce",
    PLATA: "Plata",
    ORO: "Oro",
    PLATINO: "Platino",
    DIAMANTE: "Diamante",
    MAESTRO: "Maestro",
    GRAN_MAESTRO: "Gran Maestro",
    RETADOR: "Retador",
} as const;

export type MuscleLiga = (typeof MuscleLiga)[keyof typeof MuscleLiga];

export interface LigaConfig {
    liga: MuscleLiga;
    minValue: number;
    maxValue: number;
    color: string;
    gradient?: {
        from: string;
        to: string;
    };
}

export const LIGA_CONFIGS: LigaConfig[] = [
    {
        liga: MuscleLiga.BRONCE,
        minValue: 0,
        maxValue: 30,
        color: "#8B4513",
    },
    {
        liga: MuscleLiga.PLATA,
        minValue: 31,
        maxValue: 50,
        color: "#C0C0C0",
    },
    {
        liga: MuscleLiga.ORO,
        minValue: 51,
        maxValue: 70,
        color: "#FFD700",
    },
    {
        liga: MuscleLiga.PLATINO,
        minValue: 71,
        maxValue: 85,
        color: "#20B2AA",
    },
    {
        liga: MuscleLiga.DIAMANTE,
        minValue: 86,
        maxValue: 100,
        color: "#87CEEB",
    },
    {
        liga: MuscleLiga.MAESTRO,
        minValue: 101,
        maxValue: 110,
        color: "#9370DB",
    },
    {
        liga: MuscleLiga.GRAN_MAESTRO,
        minValue: 111,
        maxValue: 120,
        color: "#DC143C",
    },
    {
        liga: MuscleLiga.RETADOR,
        minValue: 121,
        maxValue: Infinity,
        color: "#FFD700",
        gradient: {
            from: "#E8E8E8",
            to: "#FFD700",
        },
    },
];

export function getStimulusLiga(normalizedValue: number): LigaConfig {
    return (
        LIGA_CONFIGS.find(
            (config) =>
                normalizedValue >= config.minValue &&
                normalizedValue <= config.maxValue
        ) || LIGA_CONFIGS[0]
    );
}

export function getMuscleColor(normalizedValue: number): string {
    const liga = getStimulusLiga(normalizedValue);
    return liga.color;
}
