import React, { useState, useEffect, useMemo } from "react";
import { UserTable } from "../../components/UserTable";
import { Select } from "../../components/ui/Select";
import { SearchInput } from "../../components/ui/SearchInput";
import { adminService } from "../../services/adminService";
import { authService } from "../../services/authService";
import { useFetch } from "../../hooks/useFetch";
import { useToast } from "../../hooks/useToast";
import { useApiCall } from "../../hooks/useApiCall";
import { ROLE_OPTIONS } from "../../config/constants";
import {
    SUCCESS_MESSAGES,
    ERROR_MESSAGES,
    UI_TEXTS,
    LOADING_MESSAGES,
} from "../../config/messages";
import type { User } from "../../types/auth.types";
import "../../styles/admin.css";

export const AdminUsers: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<number | "all">("all");
    const [statusFilter, setStatusFilter] = useState<boolean | "all">("all");

    const { showToast } = useToast();

    const usersFetch = useFetch<User[]>({
        fetchFn: adminService.getUsers,
    });

    const updateUserRole = useApiCall(adminService.updateUserRole, {
        successMessage: SUCCESS_MESSAGES.ROLE_UPDATED,
        errorMessage: ERROR_MESSAGES.ADMIN.ROLE_UPDATE,
        onSuccess: () => usersFetch.execute(),
    });

    const updateUserStatus = useApiCall(adminService.updateUserStatus, {
        errorMessage: ERROR_MESSAGES.ADMIN.STATUS_UPDATE,
        onSuccess: () => usersFetch.execute(),
    });

    useEffect(() => {
        usersFetch.execute();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRoleChange = async (userId: string, newRoleId: number) => {
        const token = authService.getToken();
        if (!token) return;

        await updateUserRole.execute(userId, newRoleId, token);
    };

    const handleStatusToggle = async (
        userId: string,
        currentStatus: boolean
    ) => {
        const token = authService.getToken();
        if (!token) return;

        const newStatus = !currentStatus;
        const result = await updateUserStatus.execute(userId, newStatus, token);

        if (result !== undefined) {
            showToast(
                "success",
                newStatus
                    ? SUCCESS_MESSAGES.USER_ACTIVATED
                    : SUCCESS_MESSAGES.USER_DEACTIVATED
            );
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
        <section className="admin">
            <div className="admin__header">
                <div className="admin__title-section">
                    <h1 className="admin__title">Administración de Usuarios</h1>
                    <p className="admin__subtitle">
                        Gestiona roles y estados de usuarios del sistema
                    </p>
                </div>

                <div className="admin__filters">
                    <SearchInput
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder={UI_TEXTS.SEARCH_PLACEHOLDER}
                        className="admin__search"
                    />

                    <div className="admin__filter-group">
                        <Select
                            value={roleFilter.toString()}
                            onChange={(value) => {
                                if (Array.isArray(value)) return;
                                setRoleFilter(
                                    value === "all" ? "all" : parseInt(value)
                                );
                            }}
                            options={[
                                { value: "all", label: UI_TEXTS.ALL_ROLES },
                                ...ROLE_OPTIONS,
                            ]}
                            className="admin__select"
                        />

                        <Select
                            value={statusFilter.toString()}
                            onChange={(value) =>
                                setStatusFilter(
                                    value === "all" ? "all" : value === "true"
                                )
                            }
                            options={[
                                {
                                    value: "all",
                                    label: UI_TEXTS.ALL_STATUSES,
                                },
                                { value: "true", label: UI_TEXTS.ACTIVE },
                                {
                                    value: "false",
                                    label: UI_TEXTS.INACTIVE,
                                },
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
                <div className="admin__loading">{LOADING_MESSAGES.USERS}</div>
            ) : (
                <UserTable
                    users={filteredUsers}
                    onRoleChange={handleRoleChange}
                    onStatusToggle={handleStatusToggle}
                />
            )}
        </section>
    );
};
