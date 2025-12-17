import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { UserTable } from "../components/UserTable";
import { adminService } from "../services/adminService";
import type { User } from "../types/auth.types";

export const Admin: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        const token = localStorage.getItem("token");

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
            <section>
                <div style={{ padding: "var(--spacing-xl)" }}>
                    <h1 style={{ color: "var(--color-text-primary)" }}>
                        Administración de Usuarios
                    </h1>
                    <p
                        style={{
                            color: "var(--color-text-secondary)",
                            marginBottom: "var(--spacing-xl)",
                        }}
                    >
                        Gestiona roles y estados de usuarios del sistema
                    </p>
                </div>
                <UserTable users={users} onUserUpdated={fetchUsers} />
            </section>
        </MainLayout>
    );
};
