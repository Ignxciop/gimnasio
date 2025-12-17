import React from "react";
import { MainLayout } from "../layouts/MainLayout";

interface HomeProps {
    onLogout?: () => void;
}

export const Home: React.FC<HomeProps> = ({ onLogout }) => {
    return (
        <MainLayout onLogout={onLogout}>
            <section>
                <h1 style={{ color: "var(--color-text-primary)" }}>Inicio</h1>
                <p style={{ color: "var(--color-text-secondary)" }}>
                    Bienvenido al panel principal. Aquí aparecerán las
                    estadísticas y accesos rápidos.
                </p>
            </section>
        </MainLayout>
    );
};

export default Home;
