import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Calendar,
    Info,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { MuscleRadarChart } from "../components/MuscleRadarChart";
import { profileService } from "../services/profileService";
import { statisticsService } from "../services/statisticsService";
import { authService } from "../services/authService";
import { useToast } from "../hooks/useToast";
import { getUserFromToken } from "../utils/getUserFromToken";
import { muscleGrowthCalculator } from "../utils/muscleGrowthCalculator";
import { buildExerciseMappingsFromBackend } from "../utils/exerciseMappings";
import type { MuscleRadarData } from "../types/muscleStimulus.types";
import "../styles/statistics.css";

export const Statistics: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [radarData, setRadarData] = useState<MuscleRadarData[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [showInfo, setShowInfo] = useState(false);
    const [availableMonths, setAvailableMonths] = useState<string[]>([]);
    const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().getMonth() + 1
    );

    const loadMonthData = async (
        userId: string,
        token: string,
        year: number,
        month: number
    ) => {
        try {
            const monthlySets = await statisticsService.getMonthlySets(
                userId,
                year,
                month,
                token
            );

            const calculatedData =
                muscleGrowthCalculator.calculateMonthlyStimulus(monthlySets);
            setRadarData(calculatedData);
        } catch (error) {
            showToast(
                "error",
                error instanceof Error
                    ? error.message
                    : "Error al cargar datos del mes"
            );
        }
    };

    useEffect(() => {
        const verifyAccess = async () => {
            if (!username) {
                navigate("/inicio");
                return;
            }

            try {
                const token = authService.getToken();
                const profile = await profileService.getProfileByUsername(
                    username,
                    token
                );

                let currentUserId = null;
                if (token) {
                    const currentUser = getUserFromToken(token);
                    const isOwn = currentUser?.username === username;
                    setIsOwnProfile(isOwn);
                    currentUserId = currentUser?.userId.toString() || null;
                    setUserId(currentUserId);
                }

                if (token && currentUserId) {
                    const exercises = await statisticsService.getExercises(
                        token
                    );
                    const mappings =
                        buildExerciseMappingsFromBackend(exercises);
                    muscleGrowthCalculator.setExerciseMappings(mappings);

                    const months =
                        await statisticsService.getMonthsWithWorkouts(
                            currentUserId,
                            token
                        );
                    setAvailableMonths(months);

                    if (months.length > 0) {
                        const [year, month] = months[0].split("-").map(Number);
                        setSelectedYear(year);
                        setSelectedMonth(month);
                        await loadMonthData(currentUserId, token, year, month);
                    }
                }

                setLoading(false);
            } catch (error) {
                if (
                    error instanceof Error &&
                    error.message === "Este perfil es privado"
                ) {
                    showToast("error", "Este perfil es privado");
                    navigate("/inicio");
                } else {
                    showToast(
                        "error",
                        error instanceof Error
                            ? error.message
                            : "Error al cargar estadísticas"
                    );
                    navigate("/inicio");
                }
            }
        };

        verifyAccess();
    }, [username, navigate, showToast]);

    const handleGoBack = () => {
        navigate(`/perfil/${username}`);
    };

    const handleRoutinesClick = () => {
        showToast("info", "Funcionalidad próximamente");
    };

    const handlePreviousMonth = async () => {
        if (currentMonthIndex < availableMonths.length - 1) {
            const newIndex = currentMonthIndex + 1;
            setCurrentMonthIndex(newIndex);
            const [year, month] = availableMonths[newIndex]
                .split("-")
                .map(Number);
            setSelectedYear(year);
            setSelectedMonth(month);

            if (userId) {
                const token = authService.getToken();
                if (token) {
                    await loadMonthData(userId, token, year, month);
                }
            }
        }
    };

    const handleNextMonth = async () => {
        if (currentMonthIndex > 0) {
            const newIndex = currentMonthIndex - 1;
            setCurrentMonthIndex(newIndex);
            const [year, month] = availableMonths[newIndex]
                .split("-")
                .map(Number);
            setSelectedYear(year);
            setSelectedMonth(month);

            if (userId) {
                const token = authService.getToken();
                if (token) {
                    await loadMonthData(userId, token, year, month);
                }
            }
        }
    };

    const getMonthName = (month: number) => {
        const months = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
        ];
        return months[month - 1];
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="statistics">
                    <div className="statistics__loading">Cargando...</div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="statistics">
                <div className="statistics__header">
                    <div className="statistics__actions">
                        <button
                            onClick={handleGoBack}
                            className="statistics__btn statistics__btn--back"
                        >
                            <ArrowLeft size={20} />
                            Volver
                        </button>
                        <button
                            onClick={handleRoutinesClick}
                            className="statistics__btn statistics__btn--routines"
                        >
                            <Calendar size={20} />
                            Rutinas Realizadas
                        </button>
                    </div>

                    <h1 className="statistics__title">
                        Estadísticas de @{username}
                    </h1>
                    {isOwnProfile && (
                        <span className="statistics__badge">Tu perfil</span>
                    )}
                </div>

                <div className="statistics__content">
                    <div className="statistics__section">
                        <div className="statistics__section-header">
                            <h2 className="statistics__section-title">
                                Desarrollo Muscular
                            </h2>
                            <button
                                className="statistics__info-btn"
                                onClick={() => setShowInfo(!showInfo)}
                                aria-label="Información sobre el gráfico"
                            >
                                <Info size={20} />
                            </button>
                        </div>

                        {showInfo && (
                            <div className="statistics__info-box">
                                <h3>Cómo funciona este gráfico</h3>
                                <p>
                                    Este gráfico muestra tu{" "}
                                    <strong>estímulo mensual</strong> por grupo
                                    muscular basado en tus entrenamientos del
                                    mes seleccionado.
                                </p>

                                <h4>Interpretación de valores:</h4>
                                <ul className="statistics__scale-list">
                                    <li>
                                        <strong className="statistics__scale-low">
                                            0–40%
                                        </strong>{" "}
                                        → Infraentrenado
                                    </li>
                                    <li>
                                        <strong className="statistics__scale-maintenance">
                                            40–70%
                                        </strong>{" "}
                                        → Mantenimiento
                                    </li>
                                    <li>
                                        <strong className="statistics__scale-optimal">
                                            70–100%
                                        </strong>{" "}
                                        → Óptimo
                                    </li>
                                    <li>
                                        <strong className="statistics__scale-excess">
                                            100%+
                                        </strong>{" "}
                                        → Posible exceso
                                    </li>
                                </ul>

                                <p className="statistics__info-note">
                                    El cálculo considera: peso × repeticiones
                                    efectivas × participación muscular del
                                    ejercicio.
                                </p>
                            </div>
                        )}

                        <div className="statistics__month-navigation">
                            <button
                                onClick={handlePreviousMonth}
                                disabled={
                                    currentMonthIndex >=
                                    availableMonths.length - 1
                                }
                                className="statistics__month-btn"
                                aria-label="Mes anterior"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="statistics__current-month">
                                {getMonthName(selectedMonth)} {selectedYear}
                            </span>
                            <button
                                onClick={handleNextMonth}
                                disabled={currentMonthIndex <= 0}
                                className="statistics__month-btn"
                                aria-label="Mes siguiente"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        <div className="statistics__chart-container">
                            <MuscleRadarChart
                                data={
                                    radarData.length > 0
                                        ? radarData.map((d) => ({
                                              muscle: d.muscle,
                                              value: d.value,
                                              fullMark: 100,
                                          }))
                                        : undefined
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};
