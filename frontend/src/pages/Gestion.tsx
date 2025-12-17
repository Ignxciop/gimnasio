import React, { useState } from "react";
import { Dumbbell, Users, Target } from "lucide-react";
import { MainLayout } from "../layouts/MainLayout";
import "../styles/gestion.css";

type TabType = "equipamiento" | "grupos" | "ejercicios";

export const Gestion: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>("equipamiento");

    return (
        <MainLayout>
            <section className="gestion">
                <div className="gestion__header">
                    <div className="gestion__title-section">
                        <h1 className="gestion__title">
                            Gestión de Entrenamiento
                        </h1>
                        <p className="gestion__subtitle">
                            Administra equipamiento, grupos musculares y
                            ejercicios
                        </p>
                    </div>

                    <div className="gestion__tabs">
                        <button
                            className={`gestion__tab ${
                                activeTab === "equipamiento"
                                    ? "gestion__tab--active"
                                    : ""
                            }`}
                            onClick={() => setActiveTab("equipamiento")}
                        >
                            <Dumbbell size={20} />
                            <span>Equipamiento</span>
                        </button>
                        <button
                            className={`gestion__tab ${
                                activeTab === "grupos"
                                    ? "gestion__tab--active"
                                    : ""
                            }`}
                            onClick={() => setActiveTab("grupos")}
                        >
                            <Users size={20} />
                            <span>Grupos Musculares</span>
                        </button>
                        <button
                            className={`gestion__tab ${
                                activeTab === "ejercicios"
                                    ? "gestion__tab--active"
                                    : ""
                            }`}
                            onClick={() => setActiveTab("ejercicios")}
                        >
                            <Target size={20} />
                            <span>Ejercicios</span>
                        </button>
                    </div>
                </div>

                <div className="gestion__content">
                    {activeTab === "equipamiento" && (
                        <div className="gestion__section">
                            <div className="gestion__section-header">
                                <h2 className="gestion__section-title">
                                    Equipamiento
                                </h2>
                                <button className="gestion__add-button">
                                    Agregar Equipamiento
                                </button>
                            </div>
                            <div className="gestion__placeholder">
                                <Dumbbell size={48} />
                                <p>Gestión de equipamiento próximamente</p>
                            </div>
                        </div>
                    )}

                    {activeTab === "grupos" && (
                        <div className="gestion__section">
                            <div className="gestion__section-header">
                                <h2 className="gestion__section-title">
                                    Grupos Musculares
                                </h2>
                                <button className="gestion__add-button">
                                    Agregar Grupo Muscular
                                </button>
                            </div>
                            <div className="gestion__placeholder">
                                <Users size={48} />
                                <p>Gestión de grupos musculares próximamente</p>
                            </div>
                        </div>
                    )}

                    {activeTab === "ejercicios" && (
                        <div className="gestion__section">
                            <div className="gestion__section-header">
                                <h2 className="gestion__section-title">
                                    Ejercicios
                                </h2>
                                <button className="gestion__add-button">
                                    Agregar Ejercicio
                                </button>
                            </div>
                            <div className="gestion__placeholder">
                                <Target size={48} />
                                <p>Gestión de ejercicios próximamente</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </MainLayout>
    );
};
