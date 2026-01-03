import React from "react";
import type { MuscleRadarData } from "../types/muscleStimulus.types";
import { FemaleFrontMap } from "./muscle-maps/FemaleFrontMap";
import { FemaleBackMap } from "./muscle-maps/FemaleBackMap";
import { processMuscleData } from "../utils/muscleMappingHelpers";
import "./muscleMapBody.css";

interface FemaleMuscleMapBodyProps {
    muscleData: MuscleRadarData[];
}

export const FemaleMuscleMapBody: React.FC<FemaleMuscleMapBodyProps> = ({
    muscleData,
}) => {
    const {
        pechoValue,
        espaldaValue,
        hombrosValue,
        brazosValue,
        piernasValue,
        abdomenValue,
        pechoColor,
        espaldaColor,
        hombrosColor,
        brazosColor,
        piernasColor,
        abdomenColor,
        pechoLiga,
        espaldaLiga,
        hombrosLiga,
        brazosLiga,
        piernasLiga,
        abdomenLiga,
    } = processMuscleData(muscleData);

    return (
        <div className="muscle-map">
            <div className="muscle-map__bodies">
                <div className="muscle-map__body">
                    <h3 className="muscle-map__title">Vista Frontal</h3>
                    <FemaleFrontMap
                        pechoColor={pechoColor}
                        pechoLiga={pechoLiga}
                        pechoValue={pechoValue}
                        hombrosColor={hombrosColor}
                        hombrosLiga={hombrosLiga}
                        hombrosValue={hombrosValue}
                        brazosColor={brazosColor}
                        brazosLiga={brazosLiga}
                        brazosValue={brazosValue}
                        abdomenColor={abdomenColor}
                        abdomenLiga={abdomenLiga}
                        abdomenValue={abdomenValue}
                        piernasColor={piernasColor}
                        piernasLiga={piernasLiga}
                        piernasValue={piernasValue}
                    />
                    {/* <svg
                        viewBox="0 0 200 450"
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
                                    id="brazosFrontalGradient"
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
                                    id="piernasFrontalGradient"
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
                                ry="26"
                                fill="#1a1a1a"
                                stroke="#333"
                                strokeWidth="1"
                            />
                        </g>

                        <g className="muscle-group" data-muscle="cuello">
                            <path
                                d="M 93 55 L 93 65 L 107 65 L 107 55 Z"
                                fill="#1a1a1a"
                                stroke="#333"
                                strokeWidth="1"
                            />
                        </g>

                        <g
                            className="muscle-group"
                            data-muscle="hombros"
                            data-liga={hombrosLiga.liga}
                        >
                            <ellipse
                                cx="65"
                                cy="82"
                                rx="16"
                                ry="20"
                                fill={
                                    hombrosLiga.gradient
                                        ? "url(#hombrosGradient)"
                                        : hombrosColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <ellipse
                                cx="135"
                                cy="82"
                                rx="16"
                                ry="20"
                                fill={
                                    hombrosLiga.gradient
                                        ? "url(#hombrosGradient)"
                                        : hombrosColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <title>
                                Hombros: {hombrosValue}% - {hombrosLiga.liga}
                            </title>
                        </g>

                        <g className="muscle-group" data-muscle="torso">
                            <path
                                d="M 78 68 Q 83 67 90 67 L 110 67 Q 117 67 122 68 L 120 125 Q 118 135 115 145 L 85 145 Q 82 135 80 125 Z"
                                fill="#1a1a1a"
                                stroke="#333"
                                strokeWidth="1"
                            />
                        </g>

                        <g
                            className="muscle-group"
                            data-muscle="pecho"
                            data-liga={pechoLiga.liga}
                        >
                            <ellipse
                                cx="88"
                                cy="95"
                                rx="12"
                                ry="16"
                                fill={
                                    pechoLiga.gradient
                                        ? "url(#pechoGradient)"
                                        : pechoColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.90"
                            />
                            <ellipse
                                cx="112"
                                cy="95"
                                rx="12"
                                ry="16"
                                fill={
                                    pechoLiga.gradient
                                        ? "url(#pechoGradient)"
                                        : pechoColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.90"
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
                                cx="56"
                                cy="110"
                                rx="10"
                                ry="32"
                                fill={
                                    brazosLiga.gradient
                                        ? "url(#brazosFrontalGradient)"
                                        : brazosColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <ellipse
                                cx="144"
                                cy="110"
                                rx="10"
                                ry="32"
                                fill={
                                    brazosLiga.gradient
                                        ? "url(#brazosFrontalGradient)"
                                        : brazosColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <path
                                d="M 51 138 Q 49 155 51 165 L 61 165 Q 63 155 61 138 Z"
                                fill={
                                    brazosLiga.gradient
                                        ? "url(#brazosFrontalGradient)"
                                        : brazosColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <path
                                d="M 149 138 Q 151 155 149 165 L 139 165 Q 137 155 139 138 Z"
                                fill={
                                    brazosLiga.gradient
                                        ? "url(#brazosFrontalGradient)"
                                        : brazosColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
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
                                d="M 85 145 L 85 190 Q 88 195 100 195 Q 112 195 115 190 L 115 145 Z"
                                fill={
                                    abdomenLiga.gradient
                                        ? "url(#abdomenGradient)"
                                        : abdomenColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <line
                                x1="85"
                                y1="158"
                                x2="115"
                                y2="158"
                                stroke="#000"
                                strokeWidth="0.8"
                                opacity="0.3"
                            />
                            <line
                                x1="85"
                                y1="172"
                                x2="115"
                                y2="172"
                                stroke="#000"
                                strokeWidth="0.8"
                                opacity="0.3"
                            />
                            <title>
                                Abdomen: {abdomenValue}% - {abdomenLiga.liga}
                            </title>
                        </g>

                        <g className="muscle-group" data-muscle="cadera">
                            <path
                                d="M 78 145 Q 75 170 80 195 L 88 195 L 85 145 Z"
                                fill="#1a1a1a"
                                stroke="#333"
                                strokeWidth="1"
                            />
                            <path
                                d="M 122 145 Q 125 170 120 195 L 112 195 L 115 145 Z"
                                fill="#1a1a1a"
                                stroke="#333"
                                strokeWidth="1"
                            />
                        </g>

                        <g
                            className="muscle-group"
                            data-muscle="piernas"
                            data-liga={piernasLiga.liga}
                        >
                            <path
                                d="M 80 195 L 78 245 Q 77 265 78 285 L 80 335 L 87 335 L 90 285 Q 90 265 88 245 L 88 195 Z"
                                fill={
                                    piernasLiga.gradient
                                        ? "url(#piernasFrontalGradient)"
                                        : piernasColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <path
                                d="M 120 195 L 122 245 Q 123 265 122 285 L 120 335 L 113 335 L 110 285 Q 110 265 112 245 L 112 195 Z"
                                fill={
                                    piernasLiga.gradient
                                        ? "url(#piernasFrontalGradient)"
                                        : piernasColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <path
                                d="M 80 335 L 78 390 Q 77 405 80 410 L 87 410 L 90 390 L 90 335 Z"
                                fill={
                                    piernasLiga.gradient
                                        ? "url(#piernasFrontalGradient)"
                                        : piernasColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <path
                                d="M 120 335 L 122 390 Q 123 405 120 410 L 113 410 L 110 390 L 110 335 Z"
                                fill={
                                    piernasLiga.gradient
                                        ? "url(#piernasFrontalGradient)"
                                        : piernasColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <ellipse
                                cx="83.5"
                                cy="245"
                                rx="6"
                                ry="10"
                                fill="#0d0d0d"
                                opacity="0.3"
                            />
                            <ellipse
                                cx="116.5"
                                cy="245"
                                rx="6"
                                ry="10"
                                fill="#0d0d0d"
                                opacity="0.3"
                            />
                            <title>
                                Piernas: {piernasValue}% - {piernasLiga.liga}
                            </title>
                        </g>
                            </title>
                        </g>
                    </svg> */}
                </div>

                <div className="muscle-map__body">
                    <h3 className="muscle-map__title">Vista Posterior</h3>
                    <FemaleBackMap
                        espaldaColor={espaldaColor}
                        espaldaLiga={espaldaLiga}
                        espaldaValue={espaldaValue}
                        hombrosColor={hombrosColor}
                        hombrosLiga={hombrosLiga}
                        hombrosValue={hombrosValue}
                        brazosColor={brazosColor}
                        brazosLiga={brazosLiga}
                        brazosValue={brazosValue}
                        piernasColor={piernasColor}
                        piernasLiga={piernasLiga}
                        piernasValue={piernasValue}
                    />
                    {/* <svg
                        viewBox="0 0 200 450"
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
                            {hombrosLiga.gradient && (
                                <linearGradient
                                    id="hombrosPosteriorGradient"
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
                                    id="brazosPosteriorGradient"
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
                            {piernasLiga.gradient && (
                                <linearGradient
                                    id="piernasPosteriorGradient"
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
                                ry="26"
                                fill="#1a1a1a"
                                stroke="#333"
                                strokeWidth="1"
                            />
                        </g>

                        <g className="muscle-group" data-muscle="cuello">
                            <path
                                d="M 93 55 L 93 65 L 107 65 L 107 55 Z"
                                fill="#1a1a1a"
                                stroke="#333"
                                strokeWidth="1"
                            />
                        </g>

                        <g
                            className="muscle-group"
                            data-muscle="hombros"
                            data-liga={hombrosLiga.liga}
                        >
                            <ellipse
                                cx="65"
                                cy="80"
                                rx="15"
                                ry="18"
                                fill={
                                    hombrosLiga.gradient
                                        ? "url(#hombrosPosteriorGradient)"
                                        : hombrosColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <ellipse
                                cx="135"
                                cy="80"
                                rx="15"
                                ry="18"
                                fill={
                                    hombrosLiga.gradient
                                        ? "url(#hombrosPosteriorGradient)"
                                        : hombrosColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
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
                                d="M 78 68 Q 82 67 88 67 L 112 67 Q 118 67 122 68 L 118 120 Q 115 135 110 145 L 90 145 Q 85 135 82 120 Z"
                                fill={
                                    espaldaLiga.gradient
                                        ? "url(#espaldaGradient)"
                                        : espaldaColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <line
                                x1="100"
                                y1="70"
                                x2="100"
                                y2="138"
                                stroke="#000"
                                strokeWidth="1.2"
                                opacity="0.3"
                            />
                            <path
                                d="M 88 85 Q 95 88 100 88 Q 105 88 112 85"
                                stroke="#000"
                                strokeWidth="0.8"
                                opacity="0.25"
                                fill="none"
                            />
                            <path
                                d="M 88 105 Q 95 108 100 108 Q 105 108 112 105"
                                stroke="#000"
                                strokeWidth="0.8"
                                opacity="0.25"
                                fill="none"
                            />
                            <path
                                d="M 88 125 Q 95 128 100 128 Q 105 128 112 125"
                                stroke="#000"
                                strokeWidth="0.8"
                                opacity="0.25"
                                fill="none"
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
                                cx="56"
                                cy="108"
                                rx="9"
                                ry="30"
                                fill={
                                    brazosLiga.gradient
                                        ? "url(#brazosPosteriorGradient)"
                                        : brazosColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <ellipse
                                cx="144"
                                cy="108"
                                rx="9"
                                ry="30"
                                fill={
                                    brazosLiga.gradient
                                        ? "url(#brazosPosteriorGradient)"
                                        : brazosColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <path
                                d="M 51 135 Q 49 153 51 165 L 61 165 Q 63 153 61 135 Z"
                                fill={
                                    brazosLiga.gradient
                                        ? "url(#brazosPosteriorGradient)"
                                        : brazosColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <path
                                d="M 149 135 Q 151 153 149 165 L 139 165 Q 137 153 139 135 Z"
                                fill={
                                    brazosLiga.gradient
                                        ? "url(#brazosPosteriorGradient)"
                                        : brazosColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <title>
                                Brazos: {brazosValue}% - {brazosLiga.liga}
                            </title>
                        </g>

                        <g className="muscle-group" data-muscle="espalda-baja">
                            <path
                                d="M 90 145 L 88 175 Q 90 190 100 195 Q 110 190 112 175 L 110 145 Z"
                                fill="#1a1a1a"
                                stroke="#333"
                                strokeWidth="1"
                            />
                        </g>

                        <g className="muscle-group" data-muscle="gluteos">
                            <path
                                d="M 78 145 Q 75 168 80 195 L 88 195 L 90 145 Z"
                                fill="#0d0d0d"
                                stroke="#222"
                                strokeWidth="1"
                            />
                            <path
                                d="M 122 145 Q 125 168 120 195 L 112 195 L 110 145 Z"
                                fill="#0d0d0d"
                                stroke="#222"
                                strokeWidth="1"
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
                                d="M 80 195 L 78 245 Q 77 265 78 285 L 80 335 L 87 335 L 90 285 Q 90 265 88 245 L 88 195 Z"
                                fill={
                                    piernasLiga.gradient
                                        ? "url(#piernasPosteriorGradient)"
                                        : piernasColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <path
                                d="M 120 195 L 122 245 Q 123 265 122 285 L 120 335 L 113 335 L 110 285 Q 110 265 112 245 L 112 195 Z"
                                fill={
                                    piernasLiga.gradient
                                        ? "url(#piernasPosteriorGradient)"
                                        : piernasColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <path
                                d="M 80 335 L 78 390 Q 77 405 80 410 L 87 410 L 90 390 L 90 335 Z"
                                fill={
                                    piernasLiga.gradient
                                        ? "url(#piernasPosteriorGradient)"
                                        : piernasColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <path
                                d="M 120 335 L 122 390 Q 123 405 120 410 L 113 410 L 110 390 L 110 335 Z"
                                fill={
                                    piernasLiga.gradient
                                        ? "url(#piernasPosteriorGradient)"
                                        : piernasColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <ellipse
                                cx="83.5"
                                cy="260"
                                rx="6"
                                ry="14"
                                fill="#0d0d0d"
                                opacity="0.3"
                            />
                            <ellipse
                                cx="116.5"
                                cy="260"
                                rx="6"
                                ry="14"
                                fill="#0d0d0d"
                                opacity="0.3"
                            />
                            <title>
                                Piernas: {piernasValue}% - {piernasLiga.liga}
                            </title>
                        </g>
                    </svg> */}
                </div>
            </div>
        </div>
    );
};
