import React from "react";
import { MainLayout } from "../layouts/MainLayout";

export const Home: React.FC = () => {
    return (
        <MainLayout>
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
