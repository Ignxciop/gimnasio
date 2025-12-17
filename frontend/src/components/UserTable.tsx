import React, { useState } from "react";
import { Shield, Check, X } from "lucide-react";
import { Select } from "./ui/Select";
import type { User } from "../types/auth.types";
import "./userTable.css";

interface UserTableProps {
    users: User[];
    onRoleChange: (userId: number, newRoleId: number) => Promise<void>;
    onStatusToggle: (userId: number, currentStatus: boolean) => Promise<void>;
}

export const UserTable: React.FC<UserTableProps> = ({
    users,
    onRoleChange,
    onStatusToggle,
}) => {
    const [loading, setLoading] = useState<number | null>(null);

    const handleRoleChange = async (userId: number, newRoleId: number) => {
        try {
            setLoading(userId);
            await onRoleChange(userId, newRoleId);
        } catch (error) {
            console.error("Error al actualizar rol:", error);
        } finally {
            setLoading(null);
        }
    };

    const handleStatusToggle = async (
        userId: number,
        currentStatus: boolean
    ) => {
        try {
            setLoading(userId);
            await onStatusToggle(userId, currentStatus);
        } catch (error) {
            console.error("Error al actualizar estado:", error);
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="user-table">
            <div className="user-table__container">
                <table className="user-table__table">
                    <thead className="user-table__thead">
                        <tr>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="user-table__tbody">
                        {users.map((user) => (
                            <tr key={user.id} className="user-table__row">
                                <td className="user-table__user">
                                    <div className="user-table__user-info">
                                        <p className="user-table__name">
                                            {user.name} {user.lastname}
                                        </p>
                                        <p className="user-table__username">
                                            @{user.username}
                                        </p>
                                    </div>
                                </td>
                                <td className="user-table__email">
                                    {user.email}
                                </td>
                                <td className="user-table__role">
                                    <Select
                                        value={user.roleId.toString()}
                                        onChange={(val) =>
                                            handleRoleChange(
                                                user.id,
                                                parseInt(val)
                                            )
                                        }
                                        options={[
                                            {
                                                value: 1,
                                                label: "Administrador",
                                            },
                                            { value: 2, label: "Manager" },
                                            { value: 3, label: "Usuario" },
                                        ]}
                                        disabled={loading === user.id}
                                        className="user-table__select"
                                    />
                                </td>
                                <td className="user-table__status">
                                    <span
                                        className={`user-table__status-badge ${
                                            user.is_active
                                                ? "user-table__status-badge--active"
                                                : "user-table__status-badge--inactive"
                                        }`}
                                    >
                                        {user.is_active ? (
                                            <>
                                                <Check size={14} /> Activo
                                            </>
                                        ) : (
                                            <>
                                                <X size={14} /> Inactivo
                                            </>
                                        )}
                                    </span>
                                </td>
                                <td className="user-table__actions">
                                    <button
                                        onClick={() =>
                                            handleStatusToggle(
                                                user.id,
                                                user.is_active
                                            )
                                        }
                                        disabled={loading === user.id}
                                        className="user-table__button"
                                    >
                                        <Shield size={16} />
                                        {user.is_active
                                            ? "Desactivar"
                                            : "Activar"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="user-table__cards">
                    {users.map((user) => (
                        <div key={user.id} className="user-card">
                            <div className="user-card__header">
                                <div className="user-card__user-info">
                                    <h3 className="user-card__name">
                                        {user.name} {user.lastname}
                                    </h3>
                                    <p className="user-card__username">
                                        @{user.username}
                                    </p>
                                    <p className="user-card__email">
                                        {user.email}
                                    </p>
                                </div>
                                <span
                                    className={`user-card__status-badge ${
                                        user.is_active
                                            ? "user-card__status-badge--active"
                                            : "user-card__status-badge--inactive"
                                    }`}
                                >
                                    {user.is_active ? (
                                        <>
                                            <Check size={14} /> Activo
                                        </>
                                    ) : (
                                        <>
                                            <X size={14} /> Inactivo
                                        </>
                                    )}
                                </span>
                            </div>

                            <div className="user-card__role">
                                <label className="user-card__label">Rol</label>
                                <Select
                                    value={user.roleId.toString()}
                                    onChange={(val) =>
                                        handleRoleChange(user.id, parseInt(val))
                                    }
                                    options={[
                                        { value: 1, label: "Administrador" },
                                        { value: 2, label: "Manager" },
                                        { value: 3, label: "Usuario" },
                                    ]}
                                    disabled={loading === user.id}
                                    className="user-card__select"
                                />
                            </div>

                            <button
                                onClick={() =>
                                    handleStatusToggle(user.id, user.is_active)
                                }
                                disabled={loading === user.id}
                                className="user-card__button"
                            >
                                <Shield size={16} />
                                {user.is_active ? "Desactivar" : "Activar"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
