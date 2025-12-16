import React from "react";
import { AuthLayout } from "../layouts/AuthLayout";
import { LoginForm } from "../components/LoginForm";

interface LoginProps {
    onLoginSuccess?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    return (
        <AuthLayout>
            <LoginForm onSuccess={onLoginSuccess} />
        </AuthLayout>
    );
};
