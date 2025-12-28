import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Lightbulb, Bug, Heart } from "lucide-react";
import { MainLayout } from "../layouts/MainLayout";
import { ProfileCard } from "../components/ProfileCard";
import { Button } from "../components/ui/Button";
import { FeedbackModal } from "../components/FeedbackModal";
import { profileService, type ProfileData } from "../services/profileService";
import { authService } from "../services/authService";
import { useToast } from "../hooks/useToast";
import { getUserFromToken } from "../utils/getUserFromToken";
import { FEEDBACK_TYPES } from "../config/constants";
import { ERROR_MESSAGES, LOADING_MESSAGES } from "../config/messages";
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
    >(FEEDBACK_TYPES.SUGGESTION);
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
                    error.message === ERROR_MESSAGES.PROFILE.PRIVATE
                ) {
                    showToast("error", ERROR_MESSAGES.PROFILE.PRIVATE);
                    navigate("/inicio");
                } else {
                    showToast(
                        "error",
                        error instanceof Error
                            ? error.message
                            : ERROR_MESSAGES.PROFILE.FETCH
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
        setFeedbackType(FEEDBACK_TYPES.SUGGESTION);
        setFeedbackModalOpen(true);
    };

    const handleOpenBugReport = () => {
        setFeedbackType(FEEDBACK_TYPES.BUG_REPORT);
        setFeedbackModalOpen(true);
    };

    if (loading) {
        return (
            <MainLayout>
                <div>{LOADING_MESSAGES.PROFILE}</div>
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

                {isOwnProfile && (
                    <div className="profile-actions">
                        <Button
                            variant="secondary"
                            onClick={handleOpenSuggestion}
                            aria-label="Enviar sugerencia"
                            className="profile-action-btn--suggestion"
                        >
                            <Lightbulb size={20} />
                            Sugerencias
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={handleOpenBugReport}
                            aria-label="Reportar problema"
                            className="profile-action-btn--report"
                        >
                            <Bug size={20} />
                            Reportes
                        </Button>

                        <div className="profile-action-btn-wrapper">
                            <Button
                                variant="secondary"
                                disabled
                                onMouseEnter={() =>
                                    setShowDonationTooltip(true)
                                }
                                onMouseLeave={() =>
                                    setShowDonationTooltip(false)
                                }
                                onClick={() => setShowDonationTooltip(true)}
                                aria-label="Donación (próximamente)"
                                className="profile-action-btn--donation"
                            >
                                <Heart size={20} />
                                Donación
                            </Button>
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
            </section>
        </MainLayout>
    );
};

export default Profile;
