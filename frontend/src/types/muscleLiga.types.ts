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
        color: "#8B5A3C",
    },
    {
        liga: MuscleLiga.PLATA,
        minValue: 31,
        maxValue: 50,
        color: "#95B8C8",
    },
    {
        liga: MuscleLiga.ORO,
        minValue: 51,
        maxValue: 70,
        color: "#F4C542",
    },
    {
        liga: MuscleLiga.PLATINO,
        minValue: 71,
        maxValue: 85,
        color: "#4ECDC4",
    },
    {
        liga: MuscleLiga.DIAMANTE,
        minValue: 86,
        maxValue: 100,
        color: "#5B8FE0",
    },
    {
        liga: MuscleLiga.MAESTRO,
        minValue: 101,
        maxValue: 110,
        color: "#9D4DDD",
    },
    {
        liga: MuscleLiga.GRAN_MAESTRO,
        minValue: 111,
        maxValue: 120,
        color: "#E74C3C",
    },
    {
        liga: MuscleLiga.RETADOR,
        minValue: 121,
        maxValue: Infinity,
        color: "#F4C542",
        gradient: {
            from: "#4ECDC4",
            to: "#F4C542",
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
