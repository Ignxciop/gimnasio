import React from "react";
import { GENDERS } from "../../config/constants";

interface GenderAwareUserIconProps {
    gender: "male" | "female";
    size?: number;
    className?: string;
}

export const GenderAwareUserIcon: React.FC<GenderAwareUserIconProps> = ({
    gender,
    size = 24,
    className,
}) => {
    if (gender === GENDERS.FEMALE) {
        return (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={className}
            >
                <circle cx="12" cy="8" r="4" />
                <path d="M8 14c-1.5.5-3 1.5-3 3.5V20h14v-2.5c0-2-1.5-3-3-3.5" />
                <path d="M8 8c0-1.5.5-3 1-4 .5-.8 1-1 1.5-1.5" />
                <path d="M16 8c0-1.5-.5-3-1-4-.5-.8-1-1-1.5-1.5" />
            </svg>
        );
    }

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="12" cy="7" r="4" />
            <path d="M5.5 20v-1a7.5 7.5 0 0 1 13 0v1" />
        </svg>
    );
};
