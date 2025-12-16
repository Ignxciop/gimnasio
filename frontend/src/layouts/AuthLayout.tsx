import React from "react";
import "../styles/authLayout.css";

interface AuthLayoutProps {
    children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className="auth-layout">
            <div className="auth-layout__container">{children}</div>
        </div>
    );
};
