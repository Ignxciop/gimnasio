import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { MainLayout } from "../layouts/MainLayout";
import { UserTable } from "../components/UserTable";
import { adminService } from "../services/adminService";
import { authService } from "../services/authService";
import type { User } from "../types/auth.types";
import "../styles/admin.css";

export const Admin: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<number | "all">("all");
    const [statusFilter, setStatusFilter] = useState<boolean | "all">("all");
    const navigate = useNavigate();

    const fetchUsers = async () => {
        const token = authService.getToken();

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setLoading(true);
            const usersData = await adminService.getUsers(token);
            setUsers(usersData);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
            navigate("/home");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesSearch =
                searchTerm === "" ||
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.lastname
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                user.username.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesRole =
                roleFilter === "all" || user.roleId === roleFilter;

            const matchesStatus =
                statusFilter === "all" || user.is_active === statusFilter;

            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, searchTerm, roleFilter, statusFilter]);

    if (loading) {
        return (
            <MainLayout>
                <div style={{ padding: "var(--spacing-2xl)" }}>
                    <p style={{ color: "var(--color-text-secondary)" }}>
                        Cargando usuarios...
                    </p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <section className="admin">
                <div className="admin__header">
                    <div className="admin__title-section">
                        <h1 className="admin__title">
                            Administración de Usuarios
                        </h1>
                        <p className="admin__subtitle">
                            Gestiona roles y estados de usuarios del sistema
                        </p>
                    </div>

                    <div className="admin__filters">
                        <div className="admin__search">
                            <Search className="admin__search-icon" size={20} />
                            <input
                                type="text"
                                placeholder="Buscar por nombre o usuario..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="admin__search-input"
                            />
                        </div>

                        <div className="admin__filter-group">
                            <select
                                value={roleFilter}
                                onChange={(e) =>
                                    setRoleFilter(
                                        e.target.value === "all"
                                            ? "all"
                                            : parseInt(e.target.value)
                                    )
                                }
                                className="admin__select"
                            >
                                <option value="all">Todos los roles</option>
                                <option value={1}>Administrador</option>
                                <option value={2}>Manager</option>
                                <option value={3}>Usuario</option>
                            </select>

                            <select
                                value={statusFilter.toString()}
                                onChange={(e) =>
                                    setStatusFilter(
                                        e.target.value === "all"
                                            ? "all"
                                            : e.target.value === "true"
                                    )
                                }
                                className="admin__select"
                            >
                                <option value="all">Todos los estados</option>
                                <option value="true">Activos</option>
                                <option value="false">Inactivos</option>
                            </select>
                        </div>
                    </div>

                    <div className="admin__results">
                        Mostrando {filteredUsers.length} de {users.length}{" "}
                        usuarios
                    </div>
                </div>

                <UserTable users={filteredUsers} onUserUpdated={fetchUsers} />
            </section>
        </MainLayout>
    );
};
