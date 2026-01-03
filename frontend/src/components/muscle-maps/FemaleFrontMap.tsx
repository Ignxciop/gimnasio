import React from "react";
import type { LigaConfig } from "../../types/muscleLiga.types";

interface FemaleFrontMapProps {
    pechoColor: string;
    hombrosColor: string;
    brazosColor: string;
    abdomenColor: string;
    piernasColor: string;
    pechoLiga: LigaConfig;
    hombrosLiga: LigaConfig;
    brazosLiga: LigaConfig;
    abdomenLiga: LigaConfig;
    piernasLiga: LigaConfig;
    pechoValue: number;
    hombrosValue: number;
    brazosValue: number;
    abdomenValue: number;
    piernasValue: number;
}

export const FemaleFrontMap: React.FC<FemaleFrontMapProps> = ({
    pechoColor,
    hombrosColor,
    brazosColor,
    abdomenColor,
    piernasColor,
    pechoLiga,
    hombrosLiga,
    brazosLiga,
    abdomenLiga,
    piernasLiga,
    pechoValue,
    hombrosValue,
    brazosValue,
    abdomenValue,
    piernasValue,
}) => {
    return (
        <svg
            viewBox="0 0 200 500"
            className="muscle-map__svg"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                {pechoLiga.gradient && (
                    <linearGradient
                        id="pechoGradientFemaleFront"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                    >
                        <stop offset="0%" stopColor={pechoLiga.gradient.from} />
                        <stop offset="100%" stopColor={pechoLiga.gradient.to} />
                    </linearGradient>
                )}
                {hombrosLiga.gradient && (
                    <linearGradient
                        id="hombrosGradientFemaleFront"
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
                {brazosLiga.gradient && (
                    <linearGradient
                        id="brazosFemaleFrontGradient"
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
                {abdomenLiga.gradient && (
                    <linearGradient
                        id="abdomenGradientFemaleFront"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                    >
                        <stop
                            offset="0%"
                            stopColor={abdomenLiga.gradient.from}
                        />
                        <stop
                            offset="100%"
                            stopColor={abdomenLiga.gradient.to}
                        />
                    </linearGradient>
                )}
                {piernasLiga.gradient && (
                    <linearGradient
                        id="piernasFemaleFrontGradient"
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

                <radialGradient id="femaleVolume" cx="50%" cy="40%">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.18" />
                    <stop offset="70%" stopColor="#fff" stopOpacity="0.04" />
                    <stop offset="100%" stopColor="#000" stopOpacity="0.22" />
                </radialGradient>

                <radialGradient id="femaleHighlight" cx="45%" cy="35%">
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
                    fill="url(#femaleVolume)"
                />
                <path
                    d="M 89 52 Q 91 58 93 60 L 107 60 Q 109 58 111 52"
                    fill="none"
                    stroke="#2a2a2a"
                    strokeWidth="1.1"
                    opacity="0.5"
                />
            </g>

            <g className="muscle-group" data-muscle="cuello">
                <path
                    d="M 92 60 L 91 73 L 109 73 L 108 60 Z"
                    fill="#1a1a1a"
                    stroke="#2a2a2a"
                    strokeWidth="1.1"
                />
                <line
                    x1="100"
                    y1="60"
                    x2="100"
                    y2="73"
                    stroke="#2a2a2a"
                    strokeWidth="0.5"
                    opacity="0.4"
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
                            ? "url(#hombrosGradientFemaleFront)"
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
                    fill="url(#femaleVolume)"
                />
                <ellipse
                    cx="68"
                    cy="82"
                    rx="10"
                    ry="9"
                    fill="url(#femaleHighlight)"
                />

                <ellipse
                    cx="129"
                    cy="86"
                    rx="19"
                    ry="18"
                    fill={
                        hombrosLiga.gradient
                            ? "url(#hombrosGradientFemaleFront)"
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
                    fill="url(#femaleVolume)"
                />
                <ellipse
                    cx="132"
                    cy="82"
                    rx="10"
                    ry="9"
                    fill="url(#femaleHighlight)"
                />
                <title>
                    Hombros: {hombrosValue}% - {hombrosLiga.liga}
                </title>
            </g>

            <g
                className="muscle-group"
                data-muscle="pecho"
                data-liga={pechoLiga.liga}
            >
                <path
                    d="M 84 76 Q 88 74 92 76 L 96 96 Q 98 108 100 116 Q 102 108 104 96 L 108 76 Q 112 74 116 76 L 115 118 Q 113 128 110 135 Q 106 142 100 144 Q 94 142 90 135 Q 87 128 85 118 Z"
                    fill={
                        pechoLiga.gradient
                            ? "url(#pechoGradientFemaleFront)"
                            : pechoColor
                    }
                    stroke="#000"
                    strokeWidth="1.2"
                    opacity="0.95"
                />
                <ellipse
                    cx="100"
                    cy="106"
                    rx="15"
                    ry="28"
                    fill="url(#femaleVolume)"
                />
                <ellipse
                    cx="100"
                    cy="98"
                    rx="11"
                    ry="19"
                    fill="url(#femaleHighlight)"
                />
                <path
                    d="M 86 80 Q 93 78 98 82 L 96 112 Q 94 121 91 129"
                    fill="none"
                    stroke="#000"
                    strokeWidth="0.8"
                    opacity="0.28"
                />
                <path
                    d="M 114 80 Q 107 78 102 82 L 104 112 Q 106 121 109 129"
                    fill="none"
                    stroke="#000"
                    strokeWidth="0.8"
                    opacity="0.28"
                />
                <line
                    x1="100"
                    y1="80"
                    x2="100"
                    y2="135"
                    stroke="#000"
                    strokeWidth="1"
                    opacity="0.32"
                />
                <title>
                    Pecho: {pechoValue}% - {pechoLiga.liga}
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
                            ? "url(#brazosFemaleFrontGradient)"
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
                    fill="url(#femaleVolume)"
                />
                <ellipse
                    cx="48"
                    cy="106"
                    rx="6"
                    ry="16"
                    fill="url(#femaleHighlight)"
                />

                <path
                    d="M 44 142 Q 41 150 41 164 L 43 189 L 46 191 L 50 191 L 54 189 L 56 164 Q 56 150 53 142 Z"
                    fill={
                        brazosLiga.gradient
                            ? "url(#brazosFemaleFrontGradient)"
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
                    fill="url(#femaleVolume)"
                />

                <ellipse
                    cx="50"
                    cy="205"
                    rx="10"
                    ry="15"
                    fill={
                        brazosLiga.gradient
                            ? "url(#brazosFemaleFrontGradient)"
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
                    fill="url(#femaleVolume)"
                />

                <ellipse
                    cx="150"
                    cy="112"
                    rx="11"
                    ry="30"
                    fill={
                        brazosLiga.gradient
                            ? "url(#brazosFemaleFrontGradient)"
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
                    fill="url(#femaleVolume)"
                />
                <ellipse
                    cx="152"
                    cy="106"
                    rx="6"
                    ry="16"
                    fill="url(#femaleHighlight)"
                />

                <path
                    d="M 156 142 Q 159 150 159 164 L 157 189 L 154 191 L 150 191 L 146 189 L 144 164 Q 144 150 147 142 Z"
                    fill={
                        brazosLiga.gradient
                            ? "url(#brazosFemaleFrontGradient)"
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
                    fill="url(#femaleVolume)"
                />

                <ellipse
                    cx="150"
                    cy="205"
                    rx="10"
                    ry="15"
                    fill={
                        brazosLiga.gradient
                            ? "url(#brazosFemaleFrontGradient)"
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
                    fill="url(#femaleVolume)"
                />
                <title>
                    Brazos: {brazosValue}% - {brazosLiga.liga}
                </title>
            </g>

            <g
                className="muscle-group"
                data-muscle="abdomen"
                data-liga={abdomenLiga.liga}
            >
                <path
                    d="M 86 140 Q 84 150 82 175 L 80 195 Q 79 208 82 220 L 88 224 Q 91 210 92 195 L 93 175 Q 94 150 93 140 Z"
                    fill={
                        abdomenLiga.gradient
                            ? "url(#abdomenGradientFemaleFront)"
                            : abdomenColor
                    }
                    stroke="#000"
                    strokeWidth="1.2"
                    opacity="0.95"
                />
                <path
                    d="M 114 140 Q 116 150 118 175 L 120 195 Q 121 208 118 220 L 112 224 Q 109 210 108 195 L 107 175 Q 106 150 107 140 Z"
                    fill={
                        abdomenLiga.gradient
                            ? "url(#abdomenGradientFemaleFront)"
                            : abdomenColor
                    }
                    stroke="#000"
                    strokeWidth="1.2"
                    opacity="0.95"
                />
                <path
                    d="M 93 140 Q 92 155 92 175 L 92 200 Q 92 215 94 224 L 106 224 Q 108 215 108 200 L 108 175 Q 108 155 107 140 Z"
                    fill={
                        abdomenLiga.gradient
                            ? "url(#abdomenGradientFemaleFront)"
                            : abdomenColor
                    }
                    stroke="#000"
                    strokeWidth="1.2"
                    opacity="0.95"
                />
                <ellipse
                    cx="100"
                    cy="180"
                    rx="8"
                    ry="28"
                    fill="url(#femaleVolume)"
                />
                <ellipse
                    cx="100"
                    cy="170"
                    rx="5"
                    ry="18"
                    fill="url(#femaleHighlight)"
                />
                <line
                    x1="93"
                    y1="165"
                    x2="107"
                    y2="165"
                    stroke="#000"
                    strokeWidth="0.8"
                    opacity="0.3"
                />
                <line
                    x1="93"
                    y1="190"
                    x2="107"
                    y2="190"
                    stroke="#000"
                    strokeWidth="0.8"
                    opacity="0.3"
                />
                <line
                    x1="100"
                    y1="140"
                    x2="100"
                    y2="224"
                    stroke="#000"
                    strokeWidth="0.8"
                    opacity="0.32"
                />
                <title>
                    Abdomen: {abdomenValue}% - {abdomenLiga.liga}
                </title>
            </g>

            <g className="muscle-group" data-muscle="cadera">
                <path
                    d="M 82 220 Q 78 236 82 245 L 90 250 L 94 245 L 94 220 Z"
                    fill="#1a1a1a"
                    stroke="#2a2a2a"
                    strokeWidth="1"
                    opacity="0.7"
                />
                <path
                    d="M 118 220 Q 122 236 118 245 L 110 250 L 106 245 L 106 220 Z"
                    fill="#1a1a1a"
                    stroke="#2a2a2a"
                    strokeWidth="1"
                    opacity="0.7"
                />
            </g>

            <g
                className="muscle-group"
                data-muscle="piernas"
                data-liga={piernasLiga.liga}
            >
                <path
                    d="M 85 250 Q 82 260 80 305 Q 78 335 80 365 L 82 405 Q 83 435 85 465 L 90 480 L 95 480 L 97 465 Q 98 435 99 405 L 99 365 Q 100 335 98 305 Q 96 260 94 250 Z"
                    fill={
                        piernasLiga.gradient
                            ? "url(#piernasFemaleFrontGradient)"
                            : piernasColor
                    }
                    stroke="#000"
                    strokeWidth="1.2"
                    opacity="0.95"
                />
                <ellipse
                    cx="90"
                    cy="285"
                    rx="8"
                    ry="30"
                    fill="url(#femaleVolume)"
                />
                <ellipse
                    cx="89"
                    cy="272"
                    rx="5"
                    ry="18"
                    fill="url(#femaleHighlight)"
                />
                <path
                    d="M 86 270 L 86 330"
                    stroke="#000"
                    strokeWidth="0.6"
                    opacity="0.22"
                />
                <ellipse
                    cx="88"
                    cy="310"
                    rx="8"
                    ry="14"
                    fill="#0d0d0d"
                    opacity="0.32"
                />
                <ellipse
                    cx="90"
                    cy="420"
                    rx="7"
                    ry="20"
                    fill="url(#femaleVolume)"
                />

                <path
                    d="M 115 250 Q 118 260 120 305 Q 122 335 120 365 L 118 405 Q 117 435 115 465 L 110 480 L 105 480 L 103 465 Q 102 435 101 405 L 101 365 Q 100 335 102 305 Q 104 260 106 250 Z"
                    fill={
                        piernasLiga.gradient
                            ? "url(#piernasFemaleFrontGradient)"
                            : piernasColor
                    }
                    stroke="#000"
                    strokeWidth="1.2"
                    opacity="0.95"
                />
                <ellipse
                    cx="110"
                    cy="285"
                    rx="8"
                    ry="30"
                    fill="url(#femaleVolume)"
                />
                <ellipse
                    cx="111"
                    cy="272"
                    rx="5"
                    ry="18"
                    fill="url(#femaleHighlight)"
                />
                <path
                    d="M 114 270 L 114 330"
                    stroke="#000"
                    strokeWidth="0.6"
                    opacity="0.22"
                />
                <ellipse
                    cx="112"
                    cy="310"
                    rx="8"
                    ry="14"
                    fill="#0d0d0d"
                    opacity="0.32"
                />
                <ellipse
                    cx="110"
                    cy="420"
                    rx="7"
                    ry="20"
                    fill="url(#femaleVolume)"
                />
                <title>
                    Piernas: {piernasValue}% - {piernasLiga.liga}
                </title>
            </g>
        </svg>
    );
};
