import React, { useEffect, useState } from "react";
import { MainLayout } from "../layouts/MainLayout";
import { ProfileCard } from "../components/ProfileCard";
import { profileService } from "../services/profileService";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/auth.types";

interface ProfileProps {
    onLogout?: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ onLogout }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userData = await profileService.getProfile();
                setUser(userData);
            } catch (error) {
                navigate("/login", { replace: true });
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    if (isLoading) {
        return (
            <MainLayout onLogout={onLogout}>
                <div>Cargando perfil...</div>
            </MainLayout>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <MainLayout onLogout={onLogout}>
            <section>
                <h1
                    style={{
                        color: "var(--color-text-primary)",
                        marginBottom: "var(--spacing-xl)",
                    }}
                >
                    Mi Perfil
                </h1>
                <ProfileCard user={user} />
            </section>
        </MainLayout>
    );
};

export default Profile;
