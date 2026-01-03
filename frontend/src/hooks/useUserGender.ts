import { useState, useEffect } from "react";
import { profileService } from "../services/profileService";
import { authService } from "../services/authService";
import { GENDERS } from "../config/constants";

export const useUserGender = (): "male" | "female" => {
    const [gender, setGender] = useState<"male" | "female">(GENDERS.MALE);

    useEffect(() => {
        const fetchGender = async () => {
            try {
                const token = authService.getToken();
                if (!token) return;

                const profile = await profileService.getProfile();
                if (profile.gender) {
                    setGender(profile.gender);
                }
            } catch (error) {
                console.error("Error loading user gender:", error);
            }
        };

        fetchGender();
    }, []);

    return gender;
};
