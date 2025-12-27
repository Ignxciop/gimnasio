import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { ProfileCard } from "../components/ProfileCard";
import { profileService, type ProfileData } from "../services/profileService";
import { authService } from "../services/authService";
import { useToast } from "../hooks/useToast";
import { getUserFromToken } from "../utils/getUserFromToken";

export const Profile: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const { showToast } = useToast();
    const currentUser = getUserFromToken();
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isOwnProfile, setIsOwnProfile] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!username) return;

            setLoading(true);
            try {
                const token = authService.getToken();
                const data = await profileService.getProfileByUsername(
                    username,
                    token
                );
                setProfileData(data);
                setIsOwnProfile(currentUser?.username === username);
            } catch (error) {
                showToast(
                    "error",
                    error instanceof Error
                        ? error.message
                        : "Error al cargar perfil"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username, currentUser?.username, showToast]);

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
