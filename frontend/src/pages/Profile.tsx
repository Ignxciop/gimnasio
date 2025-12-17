import React, { useEffect, useState } from "react";
import { MainLayout } from "../layouts/MainLayout";
import { ProfileCard } from "../components/ProfileCard";
import { getUserFromToken } from "../utils/getUserFromToken";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/auth.types";

interface ProfileProps {
    onLogout?: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ onLogout }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const userData = getUserFromToken();
        if (!userData) {
            navigate("/login", { replace: true });
        } else {
            setUser(userData);
        }
    }, [navigate]);

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
