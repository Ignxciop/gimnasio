import React from "react";
import { MainLayout } from "../layouts/MainLayout";
import { ProfileCard } from "../components/ProfileCard";
import { getUserFromToken } from "../utils/getUserFromToken";
import { useNavigate } from "react-router-dom";

interface ProfileProps {
    onLogout?: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ onLogout }) => {
    const navigate = useNavigate();
    const user = getUserFromToken();

    if (!user) {
        navigate("/login", { replace: true });
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
