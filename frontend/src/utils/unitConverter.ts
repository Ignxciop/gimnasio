const LBS_PER_KG = 2.20462;

export function kgToLbs(kg: number | string): number {
    const numKg = typeof kg === "string" ? parseFloat(kg) : kg;
    if (typeof numKg !== "number" || isNaN(numKg)) {
        return 0;
    }
    return numKg * LBS_PER_KG;
}

export function lbsToKg(lbs: number | string): number {
    const numLbs = typeof lbs === "string" ? parseFloat(lbs) : lbs;
    if (typeof numLbs !== "number" || isNaN(numLbs)) {
        return 0;
    }
    return numLbs / LBS_PER_KG;
}

export function formatWeight(
    weight: number | string | null | undefined,
    decimals: number = 2
): number {
    if (weight === null || weight === undefined) {
        return 0;
    }

    const numWeight = typeof weight === "string" ? parseFloat(weight) : weight;

    if (typeof numWeight !== "number" || isNaN(numWeight)) {
        return 0;
    }

    return Number(numWeight.toFixed(decimals));
}
