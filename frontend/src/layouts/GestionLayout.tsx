import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Target, Dumbbell, Users } from "lucide-react";
import { MainLayout } from "./MainLayout";
import "../styles/gestionLayout.css";

export const GestionLayout: React.FC = () => {
    return (
        <MainLayout>
            <div className="gestion-layout">
                <header className="gestion-layout__header">
                    <h1 className="gestion-layout__title">Panel de Gestión</h1>

                    <nav className="gestion-layout__tabs">
                        <NavLink
                            to="/gestion"
                            end
                            className={({ isActive }) =>
                                `gestion-layout__tab ${
                                    isActive
                                        ? "gestion-layout__tab--active"
                                        : ""
                                }`
                            }
                        >
                            <Target size={20} />
                            <span>Ejercicios</span>
                        </NavLink>

                        <NavLink
                            to="/gestion/equipamiento"
                            className={({ isActive }) =>
                                `gestion-layout__tab ${
                                    isActive
                                        ? "gestion-layout__tab--active"
                                        : ""
                                }`
                            }
                        >
                            <Dumbbell size={20} />
                            <span>Equipamiento</span>
                        </NavLink>

                        <NavLink
                            to="/gestion/grupos-musculares"
                            className={({ isActive }) =>
                                `gestion-layout__tab ${
                                    isActive
                                        ? "gestion-layout__tab--active"
                                        : ""
                                }`
                            }
                        >
                            <Users size={20} />
                            <span>Grupos Musculares</span>
                        </NavLink>
                    </nav>
                </header>

                <main className="gestion-layout__content">
                    <Outlet />
                </main>
            </div>
        </MainLayout>
    );
};
