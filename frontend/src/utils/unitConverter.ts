const LBS_PER_KG = 2.20462;

export function kgToLbs(kg: number): number {
    return kg * LBS_PER_KG;
}

export function lbsToKg(lbs: number): number {
    return lbs / LBS_PER_KG;
}

export function formatWeight(weight: number, decimals: number = 2): number {
    return Number(weight.toFixed(decimals));
}
