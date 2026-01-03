import React from "react";
import type { LigaConfig } from "../../types/muscleLiga.types";

interface FemaleBackMapProps {
    espaldaColor: string;
    hombrosColor: string;
    brazosColor: string;
    piernasColor: string;
    espaldaLiga: LigaConfig;
    hombrosLiga: LigaConfig;
    brazosLiga: LigaConfig;
    piernasLiga: LigaConfig;
    espaldaValue: number;
    hombrosValue: number;
    brazosValue: number;
    piernasValue: number;
}

export const FemaleBackMap: React.FC<FemaleBackMapProps> = ({
    espaldaColor,
    hombrosColor,
    brazosColor,
    piernasColor,
    espaldaLiga,
    hombrosLiga,
    brazosLiga,
    piernasLiga,
    espaldaValue,
    hombrosValue,
    brazosValue,
    piernasValue,
}) => {
    return (
        <svg
            viewBox="0 0 200 500"
            className="muscle-map__svg"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                {espaldaLiga.gradient && (
                    <linearGradient
                        id="espaldaGradientFemaleBack"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                    >
                        <stop
                            offset="0%"
                            stopColor={espaldaLiga.gradient.from}
                        />
                        <stop
                            offset="100%"
                            stopColor={espaldaLiga.gradient.to}
                        />
                    </linearGradient>
                )}
                {hombrosLiga.gradient && (
                    <linearGradient
                        id="hombrosGradientFemaleBack"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                    >
                        <stop
                            offset="0%"
                            stopColor={hombrosLiga.gradient.from}
                        />
                        <stop
                            offset="100%"
                            stopColor={hombrosLiga.gradient.to}
                        />
                    </linearGradient>
                )}
                {piernasLiga.gradient && (
                    <linearGradient
                        id="piernasFemaleBackGradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                    >
                        <stop
                            offset="0%"
                            stopColor={piernasLiga.gradient.from}
                        />
                        <stop
                            offset="100%"
                            stopColor={piernasLiga.gradient.to}
                        />
                    </linearGradient>
                )}
                {brazosLiga.gradient && (
                    <linearGradient
                        id="brazosFemaleBackGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                    >
                        <stop
                            offset="0%"
                            stopColor={brazosLiga.gradient.from}
                        />
                        <stop
                            offset="100%"
                            stopColor={brazosLiga.gradient.to}
                        />
                    </linearGradient>
                )}

                <radialGradient id="femaleVolumeBack" cx="50%" cy="40%">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.18" />
                    <stop offset="70%" stopColor="#fff" stopOpacity="0.04" />
                    <stop offset="100%" stopColor="#000" stopOpacity="0.22" />
                </radialGradient>

                <radialGradient id="femaleHighlightBack" cx="45%" cy="35%">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                </radialGradient>
            </defs>

            <g className="muscle-group" data-muscle="cabeza">
                <ellipse
                    cx="100"
                    cy="33"
                    rx="23"
                    ry="29"
                    fill="#1a1a1a"
                    stroke="#2a2a2a"
                    strokeWidth="1.5"
                />
                <ellipse
                    cx="100"
                    cy="31"
                    rx="22"
                    ry="27"
                    fill="url(#femaleVolumeBack)"
                />
            </g>

            <g className="muscle-group" data-muscle="cuello">
                <path
                    d="M 92 60 L 91 73 L 109 73 L 108 60 Z"
                    fill="#1a1a1a"
                    stroke="#2a2a2a"
                    strokeWidth="1.1"
                />
            </g>

            <g
                className="muscle-group"
                data-muscle="hombros"
                data-liga={hombrosLiga.liga}
            >
                <ellipse
                    cx="71"
                    cy="86"
                    rx="19"
                    ry="18"
                    fill={
                        hombrosLiga.gradient
                            ? "url(#hombrosGradientFemaleBack)"
                            : hombrosColor
                    }
                    stroke="#000"
                    strokeWidth="1.2"
                    opacity="0.95"
                />
                <ellipse
                    cx="70"
                    cy="84"
                    rx="17"
                    ry="16"
                    fill="url(#femaleVolumeBack)"
                />
                <ellipse
                    cx="68"
                    cy="82"
                    rx="10"
                    ry="9"
                    fill="url(#femaleHighlightBack)"
                />

                <ellipse
                    cx="129"
                    cy="86"
                    rx="19"
                    ry="18"
                    fill={
                        hombrosLiga.gradient
                            ? "url(#hombrosGradientFemaleBack)"
                            : hombrosColor
                    }
                    stroke="#000"
                    strokeWidth="1.2"
                    opacity="0.95"
                />
                <ellipse
                    cx="130"
                    cy="84"
                    rx="17"
                    ry="16"
                    fill="url(#femaleVolumeBack)"
                />
                <ellipse
                    cx="132"
                    cy="82"
                    rx="10"
                    ry="9"
                    fill="url(#femaleHighlightBack)"
                />
                <title>
                    Hombros: {hombrosValue}% - {hombrosLiga.liga}
                </title>
            </g>

            <g
                className="muscle-group"
                data-muscle="espalda"
                data-liga={espaldaLiga.liga}
            >
                <path
                    d="M 74 75 Q 100 69 126 75 L 125 98 Q 123 118 121 138 L 118 166 Q 116 182 113 192 Q 107 201 100 203 Q 93 201 87 192 Q 84 182 82 166 L 79 138 Q 77 118 75 98 Z"
                    fill={
                        espaldaLiga.gradient
                            ? "url(#espaldaGradientFemaleBack)"
                            : espaldaColor
                    }
                    stroke="#000"
                    strokeWidth="1.2"
                    opacity="0.95"
                />
                <ellipse
                    cx="100"
                    cy="132"
                    rx="21"
                    ry="54"
                    fill="url(#femaleVolumeBack)"
                />
                <ellipse
                    cx="100"
                    cy="118"
                    rx="16"
                    ry="35"
                    fill="url(#femaleHighlightBack)"
                />
                <path
                    d="M 80 82 Q 90 79 98 83 L 94 122 Q 92 136 89 150"
                    fill="none"
                    stroke="#000"
                    strokeWidth="0.8"
                    opacity="0.28"
                />
                <path
                    d="M 120 82 Q 110 79 102 83 L 106 122 Q 108 136 111 150"
                    fill="none"
                    stroke="#000"
                    strokeWidth="0.8"
                    opacity="0.28"
                />
                <path
                    d="M 88 88 Q 95 86 100 88 L 98 126 Q 96 140 94 155"
                    fill="#000"
                    opacity="0.16"
                />
                <path
                    d="M 112 88 Q 105 86 100 88 L 102 126 Q 104 140 106 155"
                    fill="#000"
                    opacity="0.16"
                />
                <line
                    x1="100"
                    y1="75"
                    x2="100"
                    y2="192"
                    stroke="#000"
                    strokeWidth="1"
                    opacity="0.32"
                />
                <title>
                    Espalda: {espaldaValue}% - {espaldaLiga.liga}
                </title>
            </g>

            <g
                className="muscle-group"
                data-muscle="brazos"
                data-liga={brazosLiga.liga}
            >
                <ellipse
                    cx="50"
                    cy="112"
                    rx="11"
                    ry="30"
                    fill={
                        brazosLiga.gradient
                            ? "url(#brazosFemaleBackGradient)"
                            : brazosColor
                    }
                    stroke="#000"
                    strokeWidth="1.2"
                    opacity="0.95"
                />
                <ellipse
                    cx="49"
                    cy="110"
                    rx="9"
                    ry="26"
                    fill="url(#femaleVolumeBack)"
                />
                <ellipse
                    cx="48"
                    cy="106"
                    rx="6"
                    ry="16"
                    fill="url(#femaleHighlightBack)"
                />

                <path
                    d="M 44 142 Q 41 150 41 164 L 43 189 L 46 191 L 50 191 L 54 189 L 56 164 Q 56 150 53 142 Z"
                    fill={
                        brazosLiga.gradient
                            ? "url(#brazosFemaleBackGradient)"
                            : brazosColor
                    }
                    stroke="#000"
                    strokeWidth="1.2"
                    opacity="0.95"
                />
                <ellipse
                    cx="49"
                    cy="167"
                    rx="6"
                    ry="21"
                    fill="url(#femaleVolumeBack)"
                />

                <ellipse
                    cx="50"
                    cy="205"
                    rx="10"
                    ry="15"
                    fill={
                        brazosLiga.gradient
                            ? "url(#brazosFemaleBackGradient)"
                            : brazosColor
                    }
                    stroke="#000"
                    strokeWidth="1"
                    opacity="0.95"
                />
                <ellipse
                    cx="49"
                    cy="204"
                    rx="8"
                    ry="12"
                    fill="url(#femaleVolumeBack)"
                />

                <ellipse
                    cx="150"
                    cy="112"
                    rx="11"
                    ry="30"
                    fill={
                        brazosLiga.gradient
                            ? "url(#brazosFemaleBackGradient)"
                            : brazosColor
                    }
                    stroke="#000"
                    strokeWidth="1.2"
                    opacity="0.95"
                />
                <ellipse
                    cx="151"
                    cy="110"
                    rx="9"
                    ry="26"
                    fill="url(#femaleVolumeBack)"
                />
                <ellipse
                    cx="152"
                    cy="106"
                    rx="6"
                    ry="16"
                    fill="url(#femaleHighlightBack)"
                />

                <path
                    d="M 156 142 Q 159 150 159 164 L 157 189 L 154 191 L 150 191 L 146 189 L 144 164 Q 144 150 147 142 Z"
                    fill={
                        brazosLiga.gradient
                            ? "url(#brazosFemaleBackGradient)"
                            : brazosColor
                    }
                    stroke="#000"
                    strokeWidth="1.2"
                    opacity="0.95"
                />
                <ellipse
                    cx="151"
                    cy="167"
                    rx="6"
                    ry="21"
                    fill="url(#femaleVolumeBack)"
                />

                <ellipse
                    cx="150"
                    cy="205"
                    rx="10"
                    ry="15"
                    fill={
                        brazosLiga.gradient
                            ? "url(#brazosFemaleBackGradient)"
                            : brazosColor
                    }
                    stroke="#000"
                    strokeWidth="1"
                    opacity="0.95"
                />
                <ellipse
                    cx="151"
                    cy="204"
                    rx="8"
                    ry="12"
                    fill="url(#femaleVolumeBack)"
                />
                <title>
                    Brazos: {brazosValue}% - {brazosLiga.liga}
                </title>
            </g>

            <g className="muscle-group" data-muscle="zona-lumbar">
                <path
                    d="M 80 198 Q 78 205 78 212 Q 78 220 82 226 L 118 226 Q 122 220 122 212 Q 122 205 120 198 Z"
                    fill="#1a1a1a"
                    stroke="#2a2a2a"
                    strokeWidth="1.1"
                    opacity="0.7"
                />
                <ellipse
                    cx="100"
                    cy="210"
                    rx="19"
                    ry="14"
                    fill="url(#femaleVolumeBack)"
                />
            </g>

            <g
                className="muscle-group"
                data-muscle="gluteos"
                data-liga={piernasLiga.liga}
            >
                <ellipse
                    cx="86"
                    cy="240"
                    rx="13"
                    ry="20"
                    fill={
                        piernasLiga.gradient
                            ? "url(#piernasFemaleBackGradient)"
                            : piernasColor
                    }
                    stroke="#000"
                    strokeWidth="1.2"
                    opacity="0.95"
                />
                <ellipse
                    cx="85"
                    cy="238"
                    rx="11"
                    ry="17"
                    fill="url(#femaleVolumeBack)"
                />
                <ellipse
                    cx="84"
                    cy="233"
                    rx="7"
                    ry="11"
                    fill="url(#femaleHighlightBack)"
                />

                <ellipse
                    cx="114"
                    cy="240"
                    rx="13"
                    ry="20"
                    fill={
                        piernasLiga.gradient
                            ? "url(#piernasFemaleBackGradient)"
                            : piernasColor
                    }
                    stroke="#000"
                    strokeWidth="1.2"
                    opacity="0.95"
                />
                <ellipse
                    cx="115"
                    cy="238"
                    rx="11"
                    ry="17"
                    fill="url(#femaleVolumeBack)"
                />
                <ellipse
                    cx="116"
                    cy="233"
                    rx="7"
                    ry="11"
                    fill="url(#femaleHighlightBack)"
                />
                <title>
                    Piernas: {piernasValue}% - {piernasLiga.liga}
                </title>
            </g>

            <g
                className="muscle-group"
                data-muscle="piernas"
                data-liga={piernasLiga.liga}
            >
                <path
                    d="M 82 260 L 79 318 Q 77 350 79 382 L 82 422 Q 83 452 85 479 L 90 482 L 95 482 L 97 479 Q 98 452 99 422 L 99 382 Q 100 350 98 318 L 96 260 Z"
                    fill={
                        piernasLiga.gradient
                            ? "url(#piernasFemaleBackGradient)"
                            : piernasColor
                    }
                    stroke="#000"
                    strokeWidth="1.2"
                    opacity="0.95"
                />
                <ellipse
                    cx="89"
                    cy="300"
                    rx="7"
                    ry="13"
                    fill="#000"
                    opacity="0.23"
                />
                <ellipse
                    cx="90"
                    cy="335"
                    rx="8"
                    ry="30"
                    fill="url(#femaleVolumeBack)"
                />
                <ellipse
                    cx="89"
                    cy="430"
                    rx="7"
                    ry="20"
                    fill="url(#femaleVolumeBack)"
                />

                <path
                    d="M 118 260 L 121 318 Q 123 350 121 382 L 118 422 Q 117 452 115 479 L 110 482 L 105 482 L 103 479 Q 102 452 101 422 L 101 382 Q 100 350 102 318 L 104 260 Z"
                    fill={
                        piernasLiga.gradient
                            ? "url(#piernasFemaleBackGradient)"
                            : piernasColor
                    }
                    stroke="#000"
                    strokeWidth="1.2"
                    opacity="0.95"
                />
                <ellipse
                    cx="111"
                    cy="300"
                    rx="7"
                    ry="13"
                    fill="#000"
                    opacity="0.23"
                />
                <ellipse
                    cx="110"
                    cy="335"
                    rx="8"
                    ry="30"
                    fill="url(#femaleVolumeBack)"
                />
                <ellipse
                    cx="111"
                    cy="430"
                    rx="7"
                    ry="20"
                    fill="url(#femaleVolumeBack)"
                />
                <title>
                    Piernas: {piernasValue}% - {piernasLiga.liga}
                </title>
            </g>
        </svg>
    );
};
