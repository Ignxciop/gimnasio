import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
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
                    <h1 className="statistics__title">
                        Estadísticas de @{username}
                    </h1>
                    {isOwnProfile && (
                        <span className="statistics__badge">Tu perfil</span>
                    )}
                </div>

                <div className="statistics__content">
                    <p className="statistics__placeholder">
                        Aquí irán los gráficos y estadísticas detalladas del
                        usuario
                    </p>
                </div>
            </div>
        </MainLayout>
    );
};
