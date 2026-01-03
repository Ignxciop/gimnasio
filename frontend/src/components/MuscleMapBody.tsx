import React from "react";
import type { MuscleRadarData } from "../types/muscleStimulus.types";
import { FemaleMuscleMapBody } from "./FemaleMuscleMapBody";
import { MaleFrontMap } from "./muscle-maps/MaleFrontMap";
import { MaleBackMap } from "./muscle-maps/MaleBackMap";
import { processMuscleData } from "../utils/muscleMappingHelpers";
import { GENDERS } from "../config/constants";
import "./muscleMapBody.css";

interface MuscleMapBodyProps {
    muscleData: MuscleRadarData[];
    gender: "male" | "female";
}

export const MuscleMapBody: React.FC<MuscleMapBodyProps> = ({
    muscleData,
    gender,
}) => {
    if (gender === GENDERS.FEMALE) {
        return <FemaleMuscleMapBody muscleData={muscleData} />;
    }

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
                    <MaleFrontMap
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
                                rx="22"
                                ry="28"
                                fill="#1a1a1a"
                                stroke="#333"
                                strokeWidth="1"
                            />
                            <ellipse
                                cx="100"
                                cy="50"
                                rx="15"
                                ry="8"
                                fill="#0d0d0d"
                                stroke="#333"
                                strokeWidth="0.5"
                            />
                        </g>

                        <g
                            className="muscle-group"
                            data-muscle="hombros"
                            data-liga={hombrosLiga.liga}
                        >
                            <path
                                d="M 55 70 Q 50 75 52 85 L 58 82 Q 60 75 58 70 Z"
                                fill={
                                    hombrosLiga.gradient
                                        ? "url(#hombrosGradient)"
                                        : hombrosColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <path
                                d="M 145 70 Q 150 75 148 85 L 142 82 Q 140 75 142 70 Z"
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
                                cx="62"
                                cy="78"
                                rx="20"
                                ry="14"
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
                                cx="138"
                                cy="78"
                                rx="20"
                                ry="14"
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

                        <g
                            className="muscle-group"
                            data-muscle="pecho"
                            data-liga={pechoLiga.liga}
                        >
                            <path
                                d="M 75 68 Q 82 65 90 68 L 95 90 Q 100 95 100 100 Q 100 95 105 90 L 110 68 Q 118 65 125 68 L 120 110 Q 118 120 115 125 Q 100 132 85 125 Q 82 120 80 110 Z"
                                fill={
                                    pechoLiga.gradient
                                        ? "url(#pechoGradient)"
                                        : pechoColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <line
                                x1="100"
                                y1="75"
                                x2="100"
                                y2="115"
                                stroke="#000"
                                strokeWidth="0.8"
                                opacity="0.3"
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
                                cx="48"
                                cy="105"
                                rx="11"
                                ry="28"
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
                                cx="152"
                                cy="105"
                                rx="11"
                                ry="28"
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
                                d="M 42 133 Q 38 145 40 160 L 42 180 L 48 180 L 50 160 Q 52 145 48 133 Z"
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
                                d="M 158 133 Q 162 145 160 160 L 158 180 L 152 180 L 150 160 Q 148 145 152 133 Z"
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
                                cx="45"
                                cy="195"
                                rx="9"
                                ry="15"
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
                                cx="155"
                                cy="195"
                                rx="9"
                                ry="15"
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
                                d="M 78 128 L 75 175 Q 75 185 78 190 L 85 190 Q 88 185 88 175 L 88 128 Z"
                                fill={
                                    abdomenLiga.gradient
                                        ? "url(#abdomenGradient)"
                                        : abdomenColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <path
                                d="M 122 128 L 125 175 Q 125 185 122 190 L 115 190 Q 112 185 112 175 L 112 128 Z"
                                fill={
                                    abdomenLiga.gradient
                                        ? "url(#abdomenGradient)"
                                        : abdomenColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <rect
                                x="88"
                                y="128"
                                width="24"
                                height="62"
                                rx="2"
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
                                x1="88"
                                y1="145"
                                x2="112"
                                y2="145"
                                stroke="#000"
                                strokeWidth="0.8"
                                opacity="0.3"
                            />
                            <line
                                x1="88"
                                y1="162"
                                x2="112"
                                y2="162"
                                stroke="#000"
                                strokeWidth="0.8"
                                opacity="0.3"
                            />
                            <line
                                x1="100"
                                y1="128"
                                x2="100"
                                y2="190"
                                stroke="#000"
                                strokeWidth="0.8"
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
                                d="M 78 195 L 75 245 Q 73 270 75 290 L 78 335 L 85 335 L 88 290 Q 90 270 88 245 L 88 195 Z"
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
                                d="M 122 195 L 125 245 Q 127 270 125 290 L 122 335 L 115 335 L 112 290 Q 110 270 112 245 L 112 195 Z"
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
                                d="M 78 335 L 76 390 Q 75 405 78 410 L 85 410 L 88 390 L 88 335 Z"
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
                                d="M 122 335 L 124 390 Q 125 405 122 410 L 115 410 L 112 390 L 112 335 Z"
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
                                cx="81.5"
                                cy="245"
                                rx="7"
                                ry="12"
                                fill="#0d0d0d"
                                opacity="0.3"
                            />
                            <ellipse
                                cx="118.5"
                                cy="245"
                                rx="7"
                                ry="12"
                                fill="#0d0d0d"
                                opacity="0.3"
                            />
                            <title>
                                Piernas: {piernasValue}% - {piernasLiga.liga}
                            </title>
                        </g>
                    </svg> */}
                </div>

                <div className="muscle-map__body">
                    <h3 className="muscle-map__title">Vista Posterior</h3>
                    <MaleBackMap
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
                            {piernasLiga.gradient && (
                                <linearGradient
                                    id="piernasPostGradient"
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
                                    id="brazosPostGradient"
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
                        </defs>

                        <g className="muscle-group" data-muscle="cabeza">
                            <ellipse
                                cx="100"
                                cy="30"
                                rx="22"
                                ry="28"
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
                            <path
                                d="M 55 70 Q 50 75 52 85 L 58 82 Q 60 75 58 70 Z"
                                fill={
                                    hombrosLiga.gradient
                                        ? "url(#hombrosGradient)"
                                        : hombrosColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <path
                                d="M 145 70 Q 150 75 148 85 L 142 82 Q 140 75 142 70 Z"
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
                                cx="62"
                                cy="78"
                                rx="20"
                                ry="14"
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
                                cx="138"
                                cy="78"
                                rx="20"
                                ry="14"
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

                        <g
                            className="muscle-group"
                            data-muscle="espalda"
                            data-liga={espaldaLiga.liga}
                        >
                            <path
                                d="M 68 68 Q 100 62 132 68 L 130 95 Q 128 110 125 125 L 122 155 Q 120 170 115 180 Q 100 188 85 180 Q 80 170 78 155 L 75 125 Q 72 110 70 95 Z"
                                fill={
                                    espaldaLiga.gradient
                                        ? "url(#espaldaGradient)"
                                        : espaldaColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <path
                                d="M 75 75 Q 85 72 95 75 L 90 115 Q 88 125 85 135 Z"
                                fill="#000"
                                opacity="0.15"
                            />
                            <path
                                d="M 125 75 Q 115 72 105 75 L 110 115 Q 112 125 115 135 Z"
                                fill="#000"
                                opacity="0.15"
                            />
                            <line
                                x1="100"
                                y1="68"
                                x2="100"
                                y2="180"
                                stroke="#000"
                                strokeWidth="0.8"
                                opacity="0.3"
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
                                cx="48"
                                cy="105"
                                rx="11"
                                ry="28"
                                fill={
                                    brazosLiga.gradient
                                        ? "url(#brazosPostGradient)"
                                        : brazosColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <ellipse
                                cx="152"
                                cy="105"
                                rx="11"
                                ry="28"
                                fill={
                                    brazosLiga.gradient
                                        ? "url(#brazosPostGradient)"
                                        : brazosColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <path
                                d="M 42 133 Q 38 145 40 160 L 42 180 L 48 180 L 50 160 Q 52 145 48 133 Z"
                                fill={
                                    brazosLiga.gradient
                                        ? "url(#brazosPostGradient)"
                                        : brazosColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <path
                                d="M 158 133 Q 162 145 160 160 L 158 180 L 152 180 L 150 160 Q 148 145 152 133 Z"
                                fill={
                                    brazosLiga.gradient
                                        ? "url(#brazosPostGradient)"
                                        : brazosColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <ellipse
                                cx="45"
                                cy="195"
                                rx="9"
                                ry="15"
                                fill={
                                    brazosLiga.gradient
                                        ? "url(#brazosPostGradient)"
                                        : brazosColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <ellipse
                                cx="155"
                                cy="195"
                                rx="9"
                                ry="15"
                                fill={
                                    brazosLiga.gradient
                                        ? "url(#brazosPostGradient)"
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

                        <g className="muscle-group" data-muscle="zona-lumbar">
                            <ellipse
                                cx="100"
                                cy="185"
                                rx="22"
                                ry="15"
                                fill="#1a1a1a"
                                stroke="#333"
                                strokeWidth="1"
                                opacity="0.6"
                            />
                        </g>

                        <g
                            className="muscle-group"
                            data-muscle="gluteos"
                            data-liga={piernasLiga.liga}
                        >
                            <ellipse
                                cx="83"
                                cy="205"
                                rx="12"
                                ry="18"
                                fill={
                                    piernasLiga.gradient
                                        ? "url(#piernasPostGradient)"
                                        : piernasColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <ellipse
                                cx="117"
                                cy="205"
                                rx="12"
                                ry="18"
                                fill={
                                    piernasLiga.gradient
                                        ? "url(#piernasPostGradient)"
                                        : piernasColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
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
                                d="M 78 225 L 75 270 Q 73 290 75 310 L 78 335 L 85 335 L 88 310 Q 90 290 88 270 L 88 225 Z"
                                fill={
                                    piernasLiga.gradient
                                        ? "url(#piernasPostGradient)"
                                        : piernasColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <path
                                d="M 122 225 L 125 270 Q 127 290 125 310 L 122 335 L 115 335 L 112 310 Q 110 290 112 270 L 112 225 Z"
                                fill={
                                    piernasLiga.gradient
                                        ? "url(#piernasPostGradient)"
                                        : piernasColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <ellipse
                                cx="81.5"
                                cy="265"
                                rx="7"
                                ry="12"
                                fill="#000"
                                opacity="0.2"
                            />
                            <ellipse
                                cx="118.5"
                                cy="265"
                                rx="7"
                                ry="12"
                                fill="#000"
                                opacity="0.2"
                            />
                            <path
                                d="M 78 335 L 76 390 Q 75 405 78 410 L 85 410 L 88 390 L 88 335 Z"
                                fill={
                                    piernasLiga.gradient
                                        ? "url(#piernasPostGradient)"
                                        : piernasColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <path
                                d="M 122 335 L 124 390 Q 125 405 122 410 L 115 410 L 112 390 L 112 335 Z"
                                fill={
                                    piernasLiga.gradient
                                        ? "url(#piernasPostGradient)"
                                        : piernasColor
                                }
                                stroke="#000"
                                strokeWidth="1"
                                opacity="0.95"
                            />
                            <title>
                                Piernas: {piernasValue}% - {piernasLiga.liga}
                            </title>
                        </g>
                    </svg> */}
                </div>
            </div>

            <div className="muscle-map__legend">
                <h4 className="muscle-map__legend-title">Sistema de Ligas</h4>
                <div className="muscle-map__legend-items">
                    <div className="muscle-map__legend-item">
                        <span
                            className="muscle-map__legend-color"
                            style={{ backgroundColor: "#8B5A3C" }}
                        ></span>
                        <span>Bronce (0-30%)</span>
                    </div>
                    <div className="muscle-map__legend-item">
                        <span
                            className="muscle-map__legend-color"
                            style={{ backgroundColor: "#95B8C8" }}
                        ></span>
                        <span>Plata (31-50%)</span>
                    </div>
                    <div className="muscle-map__legend-item">
                        <span
                            className="muscle-map__legend-color"
                            style={{ backgroundColor: "#F4C542" }}
                        ></span>
                        <span>Oro (51-70%)</span>
                    </div>
                    <div className="muscle-map__legend-item">
                        <span
                            className="muscle-map__legend-color"
                            style={{ backgroundColor: "#4ECDC4" }}
                        ></span>
                        <span>Platino (71-85%)</span>
                    </div>
                    <div className="muscle-map__legend-item">
                        <span
                            className="muscle-map__legend-color"
                            style={{ backgroundColor: "#5B8FE0" }}
                        ></span>
                        <span>Diamante (86-100%)</span>
                    </div>
                    <div className="muscle-map__legend-item">
                        <span
                            className="muscle-map__legend-color"
                            style={{ backgroundColor: "#9D4DDD" }}
                        ></span>
                        <span>Maestro (101-110%)</span>
                    </div>
                    <div className="muscle-map__legend-item">
                        <span
                            className="muscle-map__legend-color"
                            style={{ backgroundColor: "#E74C3C" }}
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
