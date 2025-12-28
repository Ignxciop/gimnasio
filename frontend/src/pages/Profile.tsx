import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Lightbulb, Bug, Heart } from "lucide-react";
import { MainLayout } from "../layouts/MainLayout";
import { ProfileCard } from "../components/ProfileCard";
import { FeedbackModal } from "../components/FeedbackModal";
import { profileService, type ProfileData } from "../services/profileService";
import { authService } from "../services/authService";
import { useToast } from "../hooks/useToast";
import { getUserFromToken } from "../utils/getUserFromToken";
import "../styles/profile.css";

export const Profile: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const currentUser = getUserFromToken();
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const [feedbackType, setFeedbackType] = useState<
        "suggestion" | "bug_report"
    >("suggestion");
    const [showDonationTooltip, setShowDonationTooltip] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchProfile = async () => {
            if (!username) return;

            setLoading(true);
            try {
                const token = authService.getToken();
                const data = await profileService.getProfileByUsername(
                    username,
                    token
                );

                if (!isMounted) return;

                setProfileData(data);
                setIsOwnProfile(currentUser?.username === username);
            } catch (error) {
                if (!isMounted) return;

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
                            : "Error al cargar perfil"
                    );
                    navigate("/inicio");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchProfile();

        return () => {
            isMounted = false;
        };
    }, [username, currentUser?.username, showToast, navigate]);

    const handleOpenSuggestion = () => {
        setFeedbackType("suggestion");
        setFeedbackModalOpen(true);
    };

    const handleOpenBugReport = () => {
        setFeedbackType("bug_report");
        setFeedbackModalOpen(true);
    };

    if (loading) {
        return (
            <MainLayout>
                <div>Cargando perfil...</div>
            </MainLayout>
        );
    }

    if (!profileData) {
        return null;
    }

    return (
        <MainLayout>
            <section>
                <h1
                    style={{
                        color: "var(--color-text-primary)",
                        marginBottom: "var(--spacing-xl)",

                {isOwnProfile && (
                    <div className="profile-actions">
                        <button
                            className="profile-action-btn profile-action-btn--suggestion"
                            onClick={handleOpenSuggestion}
                            aria-label="Enviar sugerencia"
                        >
                            <Lightbulb size={20} />
                            Sugerencias
                        </button>

                        <button
                            className="profile-action-btn profile-action-btn--report"
                            onClick={handleOpenBugReport}
                            aria-label="Reportar problema"
                        >
                            <Bug size={20} />
                            Reportes
                        </button>

                        <div className="profile-action-btn-wrapper">
                            <button
                                className="profile-action-btn profile-action-btn--donation"
                                disabled
                                onMouseEnter={() => setShowDonationTooltip(true)}
                                onMouseLeave={() => setShowDonationTooltip(false)}
                                onClick={() => setShowDonationTooltip(true)}
                                aria-label="Donación (próximamente)"
                            >
                                <Heart size={20} />
                                Donación
                            </button>
                            {showDonationTooltip && (
                                <span className="profile-action-tooltip">
                                    Próximamente
                                </span>
                            )}
                        </div>
                    </div>
                )}

                <FeedbackModal
                    isOpen={feedbackModalOpen}
                    onClose={() => setFeedbackModalOpen(false)}
                    type={feedbackType}
                />
                    }}
                >
                    {isOwnProfile
                        ? "Mi Perfil"
                        : `Perfil de ${profileData.name} ${profileData.lastname}`}
                </h1>
                <ProfileCard
                    profileData={profileData}
                    isOwnProfile={isOwnProfile}
                />
            </section>
        </MainLayout>
    );
};

export default Profile;
