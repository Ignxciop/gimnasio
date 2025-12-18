import React, { useState, useEffect, useMemo } from "react";
import { MainLayout } from "../layouts/MainLayout";
import { UserTable } from "../components/UserTable";
import { Select } from "../components/ui/Select";
import { SearchInput } from "../components/ui/SearchInput";
import { adminService } from "../services/adminService";
import { authService } from "../services/authService";
import { useFetch } from "../hooks/useFetch";
import { useToast } from "../hooks/useToast";
import type { User } from "../types/auth.types";
import "../styles/admin.css";

export const Admin: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<number | "all">("all");
    const [statusFilter, setStatusFilter] = useState<boolean | "all">("all");

    const { showToast } = useToast();

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

        try {
            await adminService.updateUserRole(userId, newRoleId, token);
            await usersFetch.execute();
            showToast("success", "Rol de usuario actualizado correctamente");
        } catch (error) {
            showToast("error", "Error al actualizar el rol del usuario");
        }
    };

    const handleStatusToggle = async (
        userId: number,
        currentStatus: boolean
    ) => {
        const token = authService.getToken();
        if (!token) return;

        try {
            await adminService.updateUserStatus(userId, !currentStatus, token);
            await usersFetch.execute();
            showToast(
                "success",
                `Usuario ${
                    !currentStatus ? "activado" : "desactivado"
                } correctamente`
            );
        } catch (error) {
            showToast("error", "Error al actualizar el estado del usuario");
        }
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
                        <SearchInput
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Buscar por nombre o usuario..."
                            className="admin__search"
                        />

                        <div className="admin__filter-group">
                            <Select
                                value={roleFilter.toString()}
                                onChange={(val) =>
                                    setRoleFilter(
                                        val === "all" ? "all" : parseInt(val)
                                    )
                                }
                                options={[
                                    { value: "all", label: "Todos los roles" },
                                    { value: 1, label: "Administrador" },
                                    { value: 2, label: "Manager" },
                                    { value: 3, label: "Usuario" },
                                ]}
                                className="admin__select"
                            />

                            <Select
                                value={statusFilter.toString()}
                                onChange={(val) =>
                                    setStatusFilter(
                                        val === "all" ? "all" : val === "true"
                                    )
                                }
                                options={[
                                    {
                                        value: "all",
                                        label: "Todos los estados",
                                    },
                                    { value: "true", label: "Activos" },
                                    { value: "false", label: "Inactivos" },
                                ]}
                                className="admin__select"
                            />
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
