import React from "react";
import type { LigaConfig } from "../../types/muscleLiga.types";

interface MaleBackMapProps {
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

export const MaleBackMap: React.FC<MaleBackMapProps> = ({
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
                        id="espaldaGradientBack"
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
                        id="hombrosGradientBack"
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
                        id="piernasBackGradient"
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
                        id="brazosBackGradient"
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

                <radialGradient id="muscleVolumeBack" cx="50%" cy="40%">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.2" />
                    <stop offset="70%" stopColor="#fff" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="#000" stopOpacity="0.25" />
                </radialGradient>

                <radialGradient id="muscleHighlightBack" cx="40%" cy="35%">
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
                    fill="url(#muscleVolumeBack)"
                />
            </g>

            <g className="muscle-group" data-muscle="cuello">
                <path
                    d="M 91 62 L 90 75 L 110 75 L 109 62 Z"
                    fill="#1a1a1a"
                    stroke="#2a2a2a"
                    strokeWidth="1.2"
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
                            ? "url(#hombrosGradientBack)"
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
                    fill="url(#muscleVolumeBack)"
                />
                <ellipse
                    cx="64"
                    cy="84"
                    rx="12"
                    ry="10"
                    fill="url(#muscleHighlightBack)"
                />
                <path
                    d="M 55 82 Q 51 86 49 92 L 54 89 Q 58 85 61 82 Z"
                    fill={
                        hombrosLiga.gradient
                            ? "url(#hombrosGradientBack)"
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
                            ? "url(#hombrosGradientBack)"
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
                    fill="url(#muscleVolumeBack)"
                />
                <ellipse
                    cx="136"
                    cy="84"
                    rx="12"
                    ry="10"
                    fill="url(#muscleHighlightBack)"
                />
                <path
                    d="M 145 82 Q 149 86 151 92 L 146 89 Q 142 85 139 82 Z"
                    fill={
                        hombrosLiga.gradient
                            ? "url(#hombrosGradientBack)"
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
                data-muscle="espalda"
                data-liga={espaldaLiga.liga}
            >
                <path
                    d="M 70 75 Q 100 68 130 75 L 129 100 Q 127 120 124 140 L 121 168 Q 119 185 115 195 Q 108 205 100 207 Q 92 205 85 195 Q 81 185 79 168 L 76 140 Q 73 120 71 100 Z"
                    fill={
                        espaldaLiga.gradient
                            ? "url(#espaldaGradientBack)"
                            : espaldaColor
                    }
                    stroke="#000"
                    strokeWidth="1.3"
                    opacity="0.95"
                />
                <ellipse
                    cx="100"
                    cy="135"
                    rx="24"
                    ry="58"
                    fill="url(#muscleVolumeBack)"
                />
                <ellipse
                    cx="100"
                    cy="120"
                    rx="18"
                    ry="38"
                    fill="url(#muscleHighlightBack)"
                />
                <path
                    d="M 77 80 Q 87 77 97 82 L 92 125 Q 90 140 87 155"
                    fill="none"
                    stroke="#000"
                    strokeWidth="0.9"
                    opacity="0.3"
                />
                <path
                    d="M 123 80 Q 113 77 103 82 L 108 125 Q 110 140 113 155"
                    fill="none"
                    stroke="#000"
                    strokeWidth="0.9"
                    opacity="0.3"
                />
                <path
                    d="M 85 90 Q 92 88 100 90 L 97 130 Q 95 145 93 160"
                    fill="#000"
                    opacity="0.18"
                />
                <path
                    d="M 115 90 Q 108 88 100 90 L 103 130 Q 105 145 107 160"
                    fill="#000"
                    opacity="0.18"
                />
                <line
                    x1="100"
                    y1="75"
                    x2="100"
                    y2="195"
                    stroke="#000"
                    strokeWidth="1.1"
                    opacity="0.35"
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
                    cx="47"
                    cy="115"
                    rx="14"
                    ry="34"
                    fill={
                        brazosLiga.gradient
                            ? "url(#brazosBackGradient)"
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
                    fill="url(#muscleVolumeBack)"
                />
                <ellipse
                    cx="44"
                    cy="108"
                    rx="8"
                    ry="18"
                    fill="url(#muscleHighlightBack)"
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
                            ? "url(#brazosBackGradient)"
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
                    fill="url(#muscleVolumeBack)"
                />

                <ellipse
                    cx="47"
                    cy="215"
                    rx="11"
                    ry="17"
                    fill={
                        brazosLiga.gradient
                            ? "url(#brazosBackGradient)"
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
                    fill="url(#muscleVolumeBack)"
                />

                <ellipse
                    cx="153"
                    cy="115"
                    rx="14"
                    ry="34"
                    fill={
                        brazosLiga.gradient
                            ? "url(#brazosBackGradient)"
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
                    fill="url(#muscleVolumeBack)"
                />
                <ellipse
                    cx="156"
                    cy="108"
                    rx="8"
                    ry="18"
                    fill="url(#muscleHighlightBack)"
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
                            ? "url(#brazosBackGradient)"
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
                    fill="url(#muscleVolumeBack)"
                />

                <ellipse
                    cx="153"
                    cy="215"
                    rx="11"
                    ry="17"
                    fill={
                        brazosLiga.gradient
                            ? "url(#brazosBackGradient)"
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
                    fill="url(#muscleVolumeBack)"
                />
                <title>
                    Brazos: {brazosValue}% - {brazosLiga.liga}
                </title>
            </g>

            <g className="muscle-group" data-muscle="zona-lumbar">
                <ellipse
                    cx="100"
                    cy="202"
                    rx="24"
                    ry="18"
                    fill="#1a1a1a"
                    stroke="#2a2a2a"
                    strokeWidth="1.2"
                    opacity="0.7"
                />
                <ellipse
                    cx="100"
                    cy="200"
                    rx="22"
                    ry="16"
                    fill="url(#muscleVolumeBack)"
                />
            </g>

            <g
                className="muscle-group"
                data-muscle="gluteos"
                data-liga={piernasLiga.liga}
            >
                <ellipse
                    cx="85"
                    cy="225"
                    rx="14"
                    ry="22"
                    fill={
                        piernasLiga.gradient
                            ? "url(#piernasBackGradient)"
                            : piernasColor
                    }
                    stroke="#000"
                    strokeWidth="1.3"
                    opacity="0.95"
                />
                <ellipse
                    cx="84"
                    cy="223"
                    rx="12"
                    ry="19"
                    fill="url(#muscleVolumeBack)"
                />
                <ellipse
                    cx="83"
                    cy="218"
                    rx="8"
                    ry="12"
                    fill="url(#muscleHighlightBack)"
                />

                <ellipse
                    cx="115"
                    cy="225"
                    rx="14"
                    ry="22"
                    fill={
                        piernasLiga.gradient
                            ? "url(#piernasBackGradient)"
                            : piernasColor
                    }
                    stroke="#000"
                    strokeWidth="1.3"
                    opacity="0.95"
                />
                <ellipse
                    cx="116"
                    cy="223"
                    rx="12"
                    ry="19"
                    fill="url(#muscleVolumeBack)"
                />
                <ellipse
                    cx="117"
                    cy="218"
                    rx="8"
                    ry="12"
                    fill="url(#muscleHighlightBack)"
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
                    d="M 80 247 L 77 303 Q 75 332 77 360 L 80 398 Q 81 426 83 453 L 89 475 L 94 475 L 96 453 Q 97 426 98 398 L 98 360 Q 99 332 97 303 L 95 247 Z"
                    fill={
                        piernasLiga.gradient
                            ? "url(#piernasBackGradient)"
                            : piernasColor
                    }
                    stroke="#000"
                    strokeWidth="1.3"
                    opacity="0.95"
                />
                <ellipse
                    cx="88"
                    cy="285"
                    rx="8"
                    ry="14"
                    fill="#000"
                    opacity="0.25"
                />
                <ellipse
                    cx="89"
                    cy="320"
                    rx="9"
                    ry="32"
                    fill="url(#muscleVolumeBack)"
                />
                <ellipse
                    cx="88"
                    cy="410"
                    rx="8"
                    ry="22"
                    fill="url(#muscleVolumeBack)"
                />

                <path
                    d="M 120 247 L 123 303 Q 125 332 123 360 L 120 398 Q 119 426 117 453 L 111 475 L 106 475 L 104 453 Q 103 426 102 398 L 102 360 Q 101 332 103 303 L 105 247 Z"
                    fill={
                        piernasLiga.gradient
                            ? "url(#piernasBackGradient)"
                            : piernasColor
                    }
                    stroke="#000"
                    strokeWidth="1.3"
                    opacity="0.95"
                />
                <ellipse
                    cx="112"
                    cy="285"
                    rx="8"
                    ry="14"
                    fill="#000"
                    opacity="0.25"
                />
                <ellipse
                    cx="111"
                    cy="320"
                    rx="9"
                    ry="32"
                    fill="url(#muscleVolumeBack)"
                />
                <ellipse
                    cx="112"
                    cy="410"
                    rx="8"
                    ry="22"
                    fill="url(#muscleVolumeBack)"
                />
                <title>
                    Piernas: {piernasValue}% - {piernasLiga.liga}
                </title>
            </g>
        </svg>
    );
};
