import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Users, MessageSquare, FileText } from "lucide-react";
import { MainLayout } from "./MainLayout";
import "../styles/adminLayout.css";

export const AdminLayout: React.FC = () => {
    return (
        <MainLayout>
            <div className="admin-layout">
                <header className="admin-layout__header">
                    <h1 className="admin-layout__title">
                        Panel de Administración
                    </h1>

                    <nav className="admin-layout__tabs">
                        <NavLink
                            to="/admin"
                            end
                            className={({ isActive }) =>
                                `admin-layout__tab ${
                                    isActive ? "admin-layout__tab--active" : ""
                                }`
                            }
                        >
                            <LayoutDashboard size={20} />
                            <span>Dashboard</span>
                        </NavLink>

                        <NavLink
                            to="/admin/usuarios"
                            className={({ isActive }) =>
                                `admin-layout__tab ${
                                    isActive ? "admin-layout__tab--active" : ""
                                }`
                            }
                        >
                            <Users size={20} />
                            <span>Usuarios</span>
                        </NavLink>

                        <NavLink
                            to="/admin/feedback"
                            className={({ isActive }) =>
                                `admin-layout__tab ${
                                    isActive ? "admin-layout__tab--active" : ""
                                }`
                            }
                        >
                            <MessageSquare size={20} />
                            <span>Feedback</span>
                        </NavLink>

                        <NavLink
                            to="/admin/auditoria"
                            className={({ isActive }) =>
                                `admin-layout__tab ${
                                    isActive ? "admin-layout__tab--active" : ""
                                }`
                            }
                        >
                            <FileText size={20} />
                            <span>Auditoría</span>
                        </NavLink>
                    </nav>
                </header>

                <main className="admin-layout__content">
                    <Outlet />
                </main>
            </div>
        </MainLayout>
    );
};
