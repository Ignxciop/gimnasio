import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuthUser";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRoles?: string[];
    requireAnyRole?: boolean; // Si true, requiere cualquiera de los roles; si false, requiere todos
    fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredRoles = [],
    requireAnyRole = false,
    fallbackPath = "/inicio",
}) => {
    const { user, loading, error } = useAuthUser();

    // Mostrar loading mientras se carga la información del usuario
    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    fontSize: "18px",
                    color: "#666",
                }}
            >
                Verificando permisos...
            </div>
        );
    }

    // Si hay error al cargar el usuario, redirigir al login
    if (error || !user) {
        return <Navigate to="/login" replace />;
    }

    // Verificar roles
    if (requiredRoles.length > 0) {
        const hasRequiredRole = requireAnyRole
            ? requiredRoles.includes(user.role.role)
            : requiredRoles.every((role) => user.role.role === role);

        if (!hasRequiredRole) {
            // Usuario no tiene los roles requeridos, redirigir
            return <Navigate to={fallbackPath} replace />;
        }
    }

    // Usuario autorizado, renderizar el componente
    return <>{children}</>;
};
