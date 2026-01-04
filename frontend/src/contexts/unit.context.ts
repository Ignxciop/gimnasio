import { createContext } from "react";

export type Unit = "kg" | "lbs";

export interface UnitContextType {
    unit: Unit;
    setUnit: (unit: Unit) => void;
}

export const UnitContext = createContext<UnitContextType | undefined>(
    undefined
);
