import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Info } from "lucide-react";
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

                    const weeklySets = await statisticsService.getWeeklySets(
                        currentUserId,
                        token
                    );

                    const calculatedData =
                        muscleGrowthCalculator.calculateWeeklyStimulus(
                            weeklySets
                        );
                    setRadarData(calculatedData);
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
                                    <strong>estímulo semanal</strong> por grupo
                                    muscular basado en tus entrenamientos de los
                                    últimos 7 días.
                                </p>
                                <ul>
                                    <li>
                                        <strong>
                                            100% = Objetivo cumplido:
                                        </strong>{" "}
                                        Has alcanzado el volumen de
                                        entrenamiento recomendado para ese
                                        músculo.
                                    </li>
                                    <li>
                                        <strong>Menos de 100%:</strong> Puedes
                                        aumentar el volumen (más series o peso).
                                    </li>
                                    <li>
                                        <strong>Más de 100%:</strong> Estás
                                        superando el objetivo, lo cual puede ser
                                        bueno para músculos rezagados.
                                    </li>
                                </ul>
                                <p className="statistics__info-note">
                                    El cálculo considera: peso × repeticiones
                                    efectivas × participación muscular del
                                    ejercicio.
                                </p>
                            </div>
                        )}

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
