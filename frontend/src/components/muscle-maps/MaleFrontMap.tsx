import React from "react";
import type { LigaConfig } from "../../types/muscleLiga.types";

interface MaleFrontMapProps {
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

export const MaleFrontMap: React.FC<MaleFrontMapProps> = ({
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
                        id="pechoGradientFront"
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
                        id="hombrosGradientFront"
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
                        id="brazosFrontGradient"
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
                        id="abdomenGradientFront"
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
                        id="piernasFrontGradient"
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

                <radialGradient id="muscleVolume" cx="50%" cy="40%">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.2" />
                    <stop offset="70%" stopColor="#fff" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="#000" stopOpacity="0.25" />
                </radialGradient>

                <radialGradient id="muscleHighlight" cx="40%" cy="35%">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                </radialGradient>
            </defs>

            <g className="muscle-group" data-muscle="cabeza">
                <ellipse
                    cx="100"
                    cy="34"
                    rx="25"
                    ry="31"
                    fill="#1a1a1a"
                    stroke="#2a2a2a"
                    strokeWidth="1.5"
                />
                <ellipse
                    cx="100"
                    cy="32"
                    rx="24"
                    ry="29"
                    fill="url(#muscleVolume)"
                />
                <path
                    d="M 88 54 Q 90 60 92 62 L 108 62 Q 110 60 112 54"
                    fill="none"
                    stroke="#2a2a2a"
                    strokeWidth="1.2"
                    opacity="0.5"
                />
            </g>

            <g className="muscle-group" data-muscle="cuello">
                <path
                    d="M 91 62 L 90 75 L 110 75 L 109 62 Z"
                    fill="#1a1a1a"
                    stroke="#2a2a2a"
                    strokeWidth="1.2"
                />
                <line
                    x1="100"
                    y1="62"
                    x2="100"
                    y2="75"
                    stroke="#2a2a2a"
                    strokeWidth="0.6"
                    opacity="0.4"
                />
            </g>

            <g
                className="muscle-group"
                data-muscle="hombros"
                data-liga={hombrosLiga.liga}
            >
                <ellipse
                    cx="68"
                    cy="88"
                    rx="24"
                    ry="20"
                    fill={
                        hombrosLiga.gradient
                            ? "url(#hombrosGradientFront)"
                            : hombrosColor
                    }
                    stroke="#000"
                    strokeWidth="1.3"
                    opacity="0.95"
                />
                <ellipse
                    cx="66"
                    cy="86"
                    rx="22"
                    ry="18"
                    fill="url(#muscleVolume)"
                />
                <ellipse
                    cx="64"
                    cy="84"
                    rx="12"
                    ry="10"
                    fill="url(#muscleHighlight)"
                />
                <path
                    d="M 55 82 Q 51 86 49 92 L 54 89 Q 58 85 61 82 Z"
                    fill={
                        hombrosLiga.gradient
                            ? "url(#hombrosGradientFront)"
                            : hombrosColor
                    }
                    stroke="#000"
                    strokeWidth="1"
                    opacity="0.9"
                />

                <ellipse
                    cx="132"
                    cy="88"
                    rx="24"
                    ry="20"
                    fill={
                        hombrosLiga.gradient
                            ? "url(#hombrosGradientFront)"
                            : hombrosColor
                    }
                    stroke="#000"
                    strokeWidth="1.3"
                    opacity="0.95"
                />
                <ellipse
                    cx="134"
                    cy="86"
                    rx="22"
                    ry="18"
                    fill="url(#muscleVolume)"
                />
                <ellipse
                    cx="136"
                    cy="84"
                    rx="12"
                    ry="10"
                    fill="url(#muscleHighlight)"
                />
                <path
                    d="M 145 82 Q 149 86 151 92 L 146 89 Q 142 85 139 82 Z"
                    fill={
                        hombrosLiga.gradient
                            ? "url(#hombrosGradientFront)"
                            : hombrosColor
                    }
                    stroke="#000"
                    strokeWidth="1"
                    opacity="0.9"
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
                    d="M 82 78 Q 87 75 92 77 L 96 98 Q 98 112 100 120 Q 102 112 104 98 L 108 77 Q 113 75 118 78 L 117 122 Q 115 133 111 140 Q 105 148 100 150 Q 95 148 89 140 Q 85 133 83 122 Z"
                    fill={
                        pechoLiga.gradient
                            ? "url(#pechoGradientFront)"
                            : pechoColor
                    }
                    stroke="#000"
                    strokeWidth="1.3"
                    opacity="0.95"
                />
                <ellipse
                    cx="100"
                    cy="110"
                    rx="17"
                    ry="32"
                    fill="url(#muscleVolume)"
                />
                <ellipse
                    cx="100"
                    cy="100"
                    rx="12"
                    ry="22"
                    fill="url(#muscleHighlight)"
                />
                <path
                    d="M 84 82 Q 92 79 98 84 L 96 115 Q 93 125 90 133"
                    fill="none"
                    stroke="#000"
                    strokeWidth="0.9"
                    opacity="0.3"
                />
                <path
                    d="M 116 82 Q 108 79 102 84 L 104 115 Q 107 125 110 133"
                    fill="none"
                    stroke="#000"
                    strokeWidth="0.9"
                    opacity="0.3"
                />
                <line
                    x1="100"
                    y1="82"
                    x2="100"
                    y2="140"
                    stroke="#000"
                    strokeWidth="1.1"
                    opacity="0.35"
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
                    cx="47"
                    cy="115"
                    rx="14"
                    ry="34"
                    fill={
                        brazosLiga.gradient
                            ? "url(#brazosFrontGradient)"
                            : brazosColor
                    }
                    stroke="#000"
                    strokeWidth="1.3"
                    opacity="0.95"
                />
                <ellipse
                    cx="45"
                    cy="113"
                    rx="12"
                    ry="30"
                    fill="url(#muscleVolume)"
                />
                <ellipse
                    cx="44"
                    cy="108"
                    rx="8"
                    ry="18"
                    fill="url(#muscleHighlight)"
                />
                <line
                    x1="47"
                    y1="88"
                    x2="47"
                    y2="142"
                    stroke="#000"
                    strokeWidth="0.7"
                    opacity="0.25"
                />

                <path
                    d="M 41 149 Q 37 158 37 172 L 39 198 L 43 201 L 48 201 L 53 198 L 55 172 Q 55 158 51 149 Z"
                    fill={
                        brazosLiga.gradient
                            ? "url(#brazosFrontGradient)"
                            : brazosColor
                    }
                    stroke="#000"
                    strokeWidth="1.3"
                    opacity="0.95"
                />
                <ellipse
                    cx="46"
                    cy="175"
                    rx="7"
                    ry="24"
                    fill="url(#muscleVolume)"
                />
                <path
                    d="M 41 160 Q 44 158 47 160 L 47 190 Q 45 192 42 190 Z"
                    fill="none"
                    stroke="#000"
                    strokeWidth="0.6"
                    opacity="0.25"
                />

                <ellipse
                    cx="47"
                    cy="215"
                    rx="11"
                    ry="17"
                    fill={
                        brazosLiga.gradient
                            ? "url(#brazosFrontGradient)"
                            : brazosColor
                    }
                    stroke="#000"
                    strokeWidth="1.1"
                    opacity="0.95"
                />
                <ellipse
                    cx="46"
                    cy="214"
                    rx="9"
                    ry="14"
                    fill="url(#muscleVolume)"
                />

                <ellipse
                    cx="153"
                    cy="115"
                    rx="14"
                    ry="34"
                    fill={
                        brazosLiga.gradient
                            ? "url(#brazosFrontGradient)"
                            : brazosColor
                    }
                    stroke="#000"
                    strokeWidth="1.3"
                    opacity="0.95"
                />
                <ellipse
                    cx="155"
                    cy="113"
                    rx="12"
                    ry="30"
                    fill="url(#muscleVolume)"
                />
                <ellipse
                    cx="156"
                    cy="108"
                    rx="8"
                    ry="18"
                    fill="url(#muscleHighlight)"
                />
                <line
                    x1="153"
                    y1="88"
                    x2="153"
                    y2="142"
                    stroke="#000"
                    strokeWidth="0.7"
                    opacity="0.25"
                />

                <path
                    d="M 159 149 Q 163 158 163 172 L 161 198 L 157 201 L 152 201 L 147 198 L 145 172 Q 145 158 149 149 Z"
                    fill={
                        brazosLiga.gradient
                            ? "url(#brazosFrontGradient)"
                            : brazosColor
                    }
                    stroke="#000"
                    strokeWidth="1.3"
                    opacity="0.95"
                />
                <ellipse
                    cx="154"
                    cy="175"
                    rx="7"
                    ry="24"
                    fill="url(#muscleVolume)"
                />
                <path
                    d="M 159 160 Q 156 158 153 160 L 153 190 Q 155 192 158 190 Z"
                    fill="none"
                    stroke="#000"
                    strokeWidth="0.6"
                    opacity="0.25"
                />

                <ellipse
                    cx="153"
                    cy="215"
                    rx="11"
                    ry="17"
                    fill={
                        brazosLiga.gradient
                            ? "url(#brazosFrontGradient)"
                            : brazosColor
                    }
                    stroke="#000"
                    strokeWidth="1.1"
                    opacity="0.95"
                />
                <ellipse
                    cx="154"
                    cy="214"
                    rx="9"
                    ry="14"
                    fill="url(#muscleVolume)"
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
                    d="M 84 145 L 80 192 Q 79 206 82 217 L 88 220 Q 92 208 93 192 L 93 145 Z"
                    fill={
                        abdomenLiga.gradient
                            ? "url(#abdomenGradientFront)"
                            : abdomenColor
                    }
                    stroke="#000"
                    strokeWidth="1.3"
                    opacity="0.95"
                />
                <path
                    d="M 116 145 L 120 192 Q 121 206 118 217 L 112 220 Q 108 208 107 192 L 107 145 Z"
                    fill={
                        abdomenLiga.gradient
                            ? "url(#abdomenGradientFront)"
                            : abdomenColor
                    }
                    stroke="#000"
                    strokeWidth="1.3"
                    opacity="0.95"
                />
                <rect
                    x="93"
                    y="145"
                    width="14"
                    height="75"
                    rx="2"
                    fill={
                        abdomenLiga.gradient
                            ? "url(#abdomenGradientFront)"
                            : abdomenColor
                    }
                    stroke="#000"
                    strokeWidth="1.3"
                    opacity="0.95"
                />
                <ellipse
                    cx="100"
                    cy="182"
                    rx="9"
                    ry="32"
                    fill="url(#muscleVolume)"
                />
                <ellipse
                    cx="100"
                    cy="170"
                    rx="6"
                    ry="20"
                    fill="url(#muscleHighlight)"
                />
                <line
                    x1="93"
                    y1="163"
                    x2="107"
                    y2="163"
                    stroke="#000"
                    strokeWidth="0.9"
                    opacity="0.35"
                />
                <line
                    x1="93"
                    y1="181"
                    x2="107"
                    y2="181"
                    stroke="#000"
                    strokeWidth="0.9"
                    opacity="0.35"
                />
                <line
                    x1="93"
                    y1="199"
                    x2="107"
                    y2="199"
                    stroke="#000"
                    strokeWidth="0.9"
                    opacity="0.35"
                />
                <line
                    x1="100"
                    y1="145"
                    x2="100"
                    y2="220"
                    stroke="#000"
                    strokeWidth="0.9"
                    opacity="0.35"
                />
                <title>
                    Abdomen: {abdomenValue}% - {abdomenLiga.liga}
                </title>
            </g>

            <g className="muscle-group" data-muscle="cadera">
                <path
                    d="M 80 217 Q 78 228 80 236 L 87 240 L 93 236 L 93 217 Z"
                    fill="#1a1a1a"
                    stroke="#2a2a2a"
                    strokeWidth="1.1"
                    opacity="0.7"
                />
                <path
                    d="M 120 217 Q 122 228 120 236 L 113 240 L 107 236 L 107 217 Z"
                    fill="#1a1a1a"
                    stroke="#2a2a2a"
                    strokeWidth="1.1"
                    opacity="0.7"
                />
            </g>

            <g
                className="muscle-group"
                data-muscle="piernas"
                data-liga={piernasLiga.liga}
            >
                <path
                    d="M 82 240 L 78 298 Q 76 326 78 352 L 81 390 Q 82 418 84 445 L 90 475 L 95 475 L 96 445 Q 97 418 98 390 L 98 352 Q 99 326 97 298 L 95 240 Z"
                    fill={
                        piernasLiga.gradient
                            ? "url(#piernasFrontGradient)"
                            : piernasColor
                    }
                    stroke="#000"
                    strokeWidth="1.3"
                    opacity="0.95"
                />
                <ellipse
                    cx="89"
                    cy="270"
                    rx="9"
                    ry="28"
                    fill="url(#muscleVolume)"
                />
                <ellipse
                    cx="88"
                    cy="260"
                    rx="6"
                    ry="18"
                    fill="url(#muscleHighlight)"
                />
                <path
                    d="M 84 255 Q 87 253 90 255 L 90 310 Q 88 312 85 310 Z"
                    fill="none"
                    stroke="#000"
                    strokeWidth="0.7"
                    opacity="0.25"
                />
                <ellipse
                    cx="87"
                    cy="290"
                    rx="9"
                    ry="15"
                    fill="#0d0d0d"
                    opacity="0.35"
                />
                <ellipse
                    cx="89"
                    cy="400"
                    rx="8"
                    ry="22"
                    fill="url(#muscleVolume)"
                />

                <path
                    d="M 118 240 L 122 298 Q 124 326 122 352 L 119 390 Q 118 418 116 445 L 110 475 L 105 475 L 104 445 Q 103 418 102 390 L 102 352 Q 101 326 103 298 L 105 240 Z"
                    fill={
                        piernasLiga.gradient
                            ? "url(#piernasFrontGradient)"
                            : piernasColor
                    }
                    stroke="#000"
                    strokeWidth="1.3"
                    opacity="0.95"
                />
                <ellipse
                    cx="111"
                    cy="270"
                    rx="9"
                    ry="28"
                    fill="url(#muscleVolume)"
                />
                <ellipse
                    cx="112"
                    cy="260"
                    rx="6"
                    ry="18"
                    fill="url(#muscleHighlight)"
                />
                <path
                    d="M 116 255 Q 113 253 110 255 L 110 310 Q 112 312 115 310 Z"
                    fill="none"
                    stroke="#000"
                    strokeWidth="0.7"
                    opacity="0.25"
                />
                <ellipse
                    cx="113"
                    cy="290"
                    rx="9"
                    ry="15"
                    fill="#0d0d0d"
                    opacity="0.35"
                />
                <ellipse
                    cx="111"
                    cy="400"
                    rx="8"
                    ry="22"
                    fill="url(#muscleVolume)"
                />
                <title>
                    Piernas: {piernasValue}% - {piernasLiga.liga}
                </title>
            </g>
        </svg>
    );
};
