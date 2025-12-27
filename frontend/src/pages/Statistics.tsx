import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { MuscleRadarChart } from "../components/MuscleRadarChart";
import { profileService } from "../services/profileService";
import { authService } from "../services/authService";
import { useToast } from "../hooks/useToast";
import { getUserFromToken } from "../utils/getUserFromToken";
import "../styles/statistics.css";

export const Statistics: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [isOwnProfile, setIsOwnProfile] = useState(false);

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

                if (token) {
                    const currentUser = getUserFromToken(token);
                    setIsOwnProfile(currentUser?.username === username);
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
                        <h2 className="statistics__section-title">
                            Desarrollo Muscular
                        </h2>
                        <div className="statistics__chart-container">
                            <MuscleRadarChart />
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};
