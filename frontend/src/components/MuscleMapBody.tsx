import React from "react";
import type { MuscleRadarData } from "../types/muscleStimulus.types";
import { getMuscleColor, getStimulusLiga } from "../types/muscleLiga.types";
import "./muscleMapBody.css";

interface MuscleMapBodyProps {
    muscleData: MuscleRadarData[];
}

export const MuscleMapBody: React.FC<MuscleMapBodyProps> = ({ muscleData }) => {
    const getMuscleValue = (muscleName: string): number => {
        const muscle = muscleData.find((m) => m.muscle === muscleName);
        return muscle?.value || 0;
    };

    const pechoValue = getMuscleValue("Pecho");
    const espaldaValue = getMuscleValue("Espalda");
    const hombrosValue = getMuscleValue("Hombros");
    const brazosValue = getMuscleValue("Brazos");
    const piernasValue = getMuscleValue("Piernas");
    const abdomenValue = getMuscleValue("Abdomen");

    const pechoColor = getMuscleColor(pechoValue);
    const espaldaColor = getMuscleColor(espaldaValue);
    const hombrosColor = getMuscleColor(hombrosValue);
    const brazosColor = getMuscleColor(brazosValue);
    const piernasColor = getMuscleColor(piernasValue);
    const abdomenColor = getMuscleColor(abdomenValue);

    const pechoLiga = getStimulusLiga(pechoValue);
    const espaldaLiga = getStimulusLiga(espaldaValue);
    const hombrosLiga = getStimulusLiga(hombrosValue);
    const brazosLiga = getStimulusLiga(brazosValue);
    const piernasLiga = getStimulusLiga(piernasValue);
    const abdomenLiga = getStimulusLiga(abdomenValue);

    return (
        <div className="muscle-map">
            <div className="muscle-map__bodies">
                <div className="muscle-map__body">
                    <h3 className="muscle-map__title">Vista Frontal</h3>
                    <svg
                        viewBox="0 0 200 400"
                        className="muscle-map__svg"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            {pechoLiga.gradient && (
                                <linearGradient
                                    id="pechoGradient"
                                    x1="0%"
                                    y1="0%"
                                    x2="0%"
                                    y2="100%"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor={pechoLiga.gradient.from}
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor={pechoLiga.gradient.to}
                                    />
                                </linearGradient>
                            )}
                            {hombrosLiga.gradient && (
                                <linearGradient
                                    id="hombrosGradient"
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
                                    id="brazosGradient"
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
                                    id="abdomenGradient"
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
                                    id="piernasGradient"
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
                        </defs>

                        <g className="muscle-group" data-muscle="cabeza">
                            <ellipse
                                cx="100"
                                cy="30"
                                rx="20"
                                ry="25"
                                fill="#2a2a2a"
                                stroke="#fff"
                                strokeWidth="1"
                            />
                        </g>

                        <g
                            className="muscle-group"
                            data-muscle="hombros"
                            data-liga={hombrosLiga.liga}
                        >
                            <ellipse
                                cx="60"
                                cy="75"
                                rx="18"
                                ry="12"
                                fill={
                                    hombrosLiga.gradient
                                        ? "url(#hombrosGradient)"
                                        : hombrosColor
                                }
                                stroke="#fff"
                                strokeWidth="1.5"
                                opacity="0.9"
                            />
                            <ellipse
                                cx="140"
                                cy="75"
                                rx="18"
                                ry="12"
                                fill={
                                    hombrosLiga.gradient
                                        ? "url(#hombrosGradient)"
                                        : hombrosColor
                                }
                                stroke="#fff"
                                strokeWidth="1.5"
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
                                d="M 80 65 Q 100 60 120 65 L 115 105 Q 100 110 85 105 Z"
                                fill={
                                    pechoLiga.gradient
                                        ? "url(#pechoGradient)"
                                        : pechoColor
                                }
                                stroke="#fff"
                                strokeWidth="1.5"
                                opacity="0.9"
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
                                cy="110"
                                rx="10"
                                ry="35"
                                fill={
                                    brazosLiga.gradient
                                        ? "url(#brazosGradient)"
                                        : brazosColor
                                }
                                stroke="#fff"
                                strokeWidth="1.5"
                                opacity="0.9"
                            />
                            <ellipse
                                cx="150"
                                cy="110"
                                rx="10"
                                ry="35"
                                fill={
                                    brazosLiga.gradient
                                        ? "url(#brazosGradient)"
                                        : brazosColor
                                }
                                stroke="#fff"
                                strokeWidth="1.5"
                                opacity="0.9"
                            />
                            <path
                                d="M 45 145 L 40 185 L 50 185 L 55 145 Z"
                                fill={
                                    brazosLiga.gradient
                                        ? "url(#brazosGradient)"
                                        : brazosColor
                                }
                                stroke="#fff"
                                strokeWidth="1.5"
                                opacity="0.9"
                            />
                            <path
                                d="M 155 145 L 160 185 L 150 185 L 145 145 Z"
                                fill={
                                    brazosLiga.gradient
                                        ? "url(#brazosGradient)"
                                        : brazosColor
                                }
                                stroke="#fff"
                                strokeWidth="1.5"
                                opacity="0.9"
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
                            <rect
                                x="80"
                                y="110"
                                width="40"
                                height="60"
                                rx="5"
                                fill={
                                    abdomenLiga.gradient
                                        ? "url(#abdomenGradient)"
                                        : abdomenColor
                                }
                                stroke="#fff"
                                strokeWidth="1.5"
                                opacity="0.9"
                            />
                            <line
                                x1="100"
                                y1="125"
                                x2="100"
                                y2="155"
                                stroke="#fff"
                                strokeWidth="0.5"
                                opacity="0.3"
                            />
                            <line
                                x1="85"
                                y1="140"
                                x2="115"
                                y2="140"
                                stroke="#fff"
                                strokeWidth="0.5"
                                opacity="0.3"
                            />
                            <title>
                                Abdomen: {abdomenValue}% - {abdomenLiga.liga}
                            </title>
                        </g>

                        <g
                            className="muscle-group"
                            data-muscle="piernas"
                            data-liga={piernasLiga.liga}
                        >
                            <path
                                d="M 85 175 L 80 280 Q 82 300 90 300 L 95 180 Z"
                                fill={
                                    piernasLiga.gradient
                                        ? "url(#piernasGradient)"
                                        : piernasColor
                                }
                                stroke="#fff"
                                strokeWidth="1.5"
                                opacity="0.9"
                            />
                            <path
                                d="M 115 175 L 120 280 Q 118 300 110 300 L 105 180 Z"
                                fill={
                                    piernasLiga.gradient
                                        ? "url(#piernasGradient)"
                                        : piernasColor
                                }
                                stroke="#fff"
                                strokeWidth="1.5"
                                opacity="0.9"
                            />
                            <path
                                d="M 85 300 L 82 360 L 92 360 L 90 300 Z"
                                fill={
                                    piernasLiga.gradient
                                        ? "url(#piernasGradient)"
                                        : piernasColor
                                }
                                stroke="#fff"
                                strokeWidth="1.5"
                                opacity="0.9"
                            />
                            <path
                                d="M 115 300 L 118 360 L 108 360 L 110 300 Z"
                                fill={
                                    piernasLiga.gradient
                                        ? "url(#piernasGradient)"
                                        : piernasColor
                                }
                                stroke="#fff"
                                strokeWidth="1.5"
                                opacity="0.9"
                            />
                            <title>
                                Piernas: {piernasValue}% - {piernasLiga.liga}
                            </title>
                        </g>
                    </svg>
                </div>

                <div className="muscle-map__body">
                    <h3 className="muscle-map__title">Vista Posterior</h3>
                    <svg
                        viewBox="0 0 200 400"
                        className="muscle-map__svg"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            {espaldaLiga.gradient && (
                                <linearGradient
                                    id="espaldaGradient"
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
                        </defs>

                        <g className="muscle-group" data-muscle="cabeza">
                            <ellipse
                                cx="100"
                                cy="30"
                                rx="20"
                                ry="25"
                                fill="#2a2a2a"
                                stroke="#fff"
                                strokeWidth="1"
                            />
                        </g>

                        <g
                            className="muscle-group"
                            data-muscle="hombros"
                            data-liga={hombrosLiga.liga}
                        >
                            <ellipse
                                cx="60"
                                cy="75"
                                rx="18"
                                ry="12"
                                fill={
                                    hombrosLiga.gradient
                                        ? "url(#hombrosGradient)"
                                        : hombrosColor
                                }
                                stroke="#fff"
                                strokeWidth="1.5"
                                opacity="0.9"
                            />
                            <ellipse
                                cx="140"
                                cy="75"
                                rx="18"
                                ry="12"
                                fill={
                                    hombrosLiga.gradient
                                        ? "url(#hombrosGradient)"
                                        : hombrosColor
                                }
                                stroke="#fff"
                                strokeWidth="1.5"
                                opacity="0.9"
                            />
                        </g>

                        <g
                            className="muscle-group"
                            data-muscle="espalda"
                            data-liga={espaldaLiga.liga}
                        >
                            <path
                                d="M 70 65 Q 100 60 130 65 L 125 150 Q 100 155 75 150 Z"
                                fill={
                                    espaldaLiga.gradient
                                        ? "url(#espaldaGradient)"
                                        : espaldaColor
                                }
                                stroke="#fff"
                                strokeWidth="1.5"
                                opacity="0.9"
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
                                cy="110"
                                rx="10"
                                ry="35"
                                fill={
                                    brazosLiga.gradient
                                        ? "url(#brazosGradient)"
                                        : brazosColor
                                }
                                stroke="#fff"
                                strokeWidth="1.5"
                                opacity="0.9"
                            />
                            <ellipse
                                cx="150"
                                cy="110"
                                rx="10"
                                ry="35"
                                fill={
                                    brazosLiga.gradient
                                        ? "url(#brazosGradient)"
                                        : brazosColor
                                }
                                stroke="#fff"
                                strokeWidth="1.5"
                                opacity="0.9"
                            />
                            <path
                                d="M 45 145 L 40 185 L 50 185 L 55 145 Z"
                                fill={
                                    brazosLiga.gradient
                                        ? "url(#brazosGradient)"
                                        : brazosColor
                                }
                                stroke="#fff"
                                strokeWidth="1.5"
                                opacity="0.9"
                            />
                            <path
                                d="M 155 145 L 160 185 L 150 185 L 145 145 Z"
                                fill={
                                    brazosLiga.gradient
                                        ? "url(#brazosGradient)"
                                        : brazosColor
                                }
                                stroke="#fff"
                                strokeWidth="1.5"
                                opacity="0.9"
                            />
                        </g>

                        <g className="muscle-group" data-muscle="zona-lumbar">
                            <rect
                                x="80"
                                y="155"
                                width="40"
                                height="20"
                                rx="3"
                                fill="#2a2a2a"
                                stroke="#fff"
                                strokeWidth="1"
                                opacity="0.5"
                            />
                        </g>

                        <g
                            className="muscle-group"
                            data-muscle="piernas"
                            data-liga={piernasLiga.liga}
                        >
                            <path
                                d="M 85 175 L 80 280 Q 82 300 90 300 L 95 180 Z"
                                fill={
                                    piernasLiga.gradient
                                        ? "url(#piernasGradient)"
                                        : piernasColor
                                }
                                stroke="#fff"
                                strokeWidth="1.5"
                                opacity="0.9"
                            />
                            <path
                                d="M 115 175 L 120 280 Q 118 300 110 300 L 105 180 Z"
                                fill={
                                    piernasLiga.gradient
                                        ? "url(#piernasGradient)"
                                        : piernasColor
                                }
                                stroke="#fff"
                                strokeWidth="1.5"
                                opacity="0.9"
                            />
                            <path
                                d="M 85 300 L 82 360 L 92 360 L 90 300 Z"
                                fill={
                                    piernasLiga.gradient
                                        ? "url(#piernasGradient)"
                                        : piernasColor
                                }
                                stroke="#fff"
                                strokeWidth="1.5"
                                opacity="0.9"
                            />
                            <path
                                d="M 115 300 L 118 360 L 108 360 L 110 300 Z"
                                fill={
                                    piernasLiga.gradient
                                        ? "url(#piernasGradient)"
                                        : piernasColor
                                }
                                stroke="#fff"
                                strokeWidth="1.5"
                                opacity="0.9"
                            />
                        </g>
                    </svg>
                </div>
            </div>

            <div className="muscle-map__legend">
                <h4 className="muscle-map__legend-title">Sistema de Ligas</h4>
                <div className="muscle-map__legend-items">
                    <div className="muscle-map__legend-item">
                        <span
                            className="muscle-map__legend-color"
                            style={{ backgroundColor: "#8B4513" }}
                        ></span>
                        <span>Bronce (0-30%)</span>
                    </div>
                    <div className="muscle-map__legend-item">
                        <span
                            className="muscle-map__legend-color"
                            style={{ backgroundColor: "#C0C0C0" }}
                        ></span>
                        <span>Plata (31-50%)</span>
                    </div>
                    <div className="muscle-map__legend-item">
                        <span
                            className="muscle-map__legend-color"
                            style={{ backgroundColor: "#FFD700" }}
                        ></span>
                        <span>Oro (51-70%)</span>
                    </div>
                    <div className="muscle-map__legend-item">
                        <span
                            className="muscle-map__legend-color"
                            style={{ backgroundColor: "#20B2AA" }}
                        ></span>
                        <span>Platino (71-85%)</span>
                    </div>
                    <div className="muscle-map__legend-item">
                        <span
                            className="muscle-map__legend-color"
                            style={{ backgroundColor: "#87CEEB" }}
                        ></span>
                        <span>Diamante (86-100%)</span>
                    </div>
                    <div className="muscle-map__legend-item">
                        <span
                            className="muscle-map__legend-color"
                            style={{ backgroundColor: "#9370DB" }}
                        ></span>
                        <span>Maestro (101-110%)</span>
                    </div>
                    <div className="muscle-map__legend-item">
                        <span
                            className="muscle-map__legend-color"
                            style={{ backgroundColor: "#DC143C" }}
                        ></span>
                        <span>Gran Maestro (111-120%)</span>
                    </div>
                    <div className="muscle-map__legend-item">
                        <span className="muscle-map__legend-color muscle-map__legend-color--gradient"></span>
                        <span>Retador (120%+)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
