import React, { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { MainLayout } from "../layouts/MainLayout";
import { UserTable } from "../components/UserTable";
import { adminService } from "../services/adminService";
import { authService } from "../services/authService";
import { useFetch } from "../hooks/useFetch";
import type { User } from "../types/auth.types";
import "../styles/admin.css";

export const Admin: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<number | "all">("all");
    const [statusFilter, setStatusFilter] = useState<boolean | "all">("all");

    const usersFetch = useFetch<User[]>({
        fetchFn: adminService.getUsers,
    });

    useEffect(() => {
        usersFetch.execute();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRoleChange = async (userId: number, newRoleId: number) => {
        const token = authService.getToken();
        if (!token) return;
        await adminService.updateUserRole(userId, newRoleId, token);
        await usersFetch.execute();
    };

    const handleStatusToggle = async (
        userId: number,
        currentStatus: boolean
    ) => {
        const token = authService.getToken();
        if (!token) return;
        await adminService.updateUserStatus(userId, !currentStatus, token);
        await usersFetch.execute();
    };

    const filteredUsers = useMemo(() => {
        const users = usersFetch.data || [];
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
    }, [usersFetch.data, searchTerm, roleFilter, statusFilter]);

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
                        Mostrando {filteredUsers.length} de{" "}
                        {usersFetch.data?.length || 0} usuarios
                    </div>
                </div>

                {usersFetch.loading ? (
                    <div className="admin__loading">Cargando usuarios...</div>
                ) : (
                    <UserTable
                        users={filteredUsers}
                        onRoleChange={handleRoleChange}
                        onStatusToggle={handleStatusToggle}
                    />
                )}
            </section>
        </MainLayout>
    );
};
