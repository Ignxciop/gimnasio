import React, { useState, useEffect } from "react";
import { UnitContext, type Unit } from "./unit.context";
import { profileService } from "../services/profileService";
import { authService } from "../services/authService";

export const UnitProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [unit, setUnit] = useState<Unit>("kg");

    useEffect(() => {
        const fetchUnit = async () => {
            try {
                const token = authService.getToken();
                if (!token) return;

                const profile = await profileService.getProfile();
                if (profile.preferredUnit) {
                    setUnit(profile.preferredUnit);
                }
            } catch (error) {
                console.error("Error loading user unit:", error);
            }
        };

        fetchUnit();
    }, []);

    return (
        <UnitContext.Provider value={{ unit, setUnit }}>
            {children}
        </UnitContext.Provider>
    );
};
