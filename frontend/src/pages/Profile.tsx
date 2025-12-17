import React, { useEffect } from "react";
import { MainLayout } from "../layouts/MainLayout";
import { ProfileCard } from "../components/ProfileCard";
import { profileService } from "../services/profileService";
import { useFetch } from "../hooks/useFetch";
import type { User } from "../types/auth.types";

interface ProfileProps {
    onLogout: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ onLogout }) => {
    const userFetch = useFetch<User>({
        fetchFn: profileService.getProfile,
    });

    useEffect(() => {
        userFetch.execute();
    }, []);

    if (userFetch.loading) {
        return (
            <MainLayout>
                <div>Cargando perfil...</div>
            </MainLayout>
        );
    }

    if (!userFetch.data) {
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
                    Mi Perfil
                </h1>
                <ProfileCard user={userFetch.data} onLogout={onLogout} />
            </section>
        </MainLayout>
    );
};

export default Profile;
