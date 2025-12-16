import React from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import { LoginForm } from "../components/LoginForm";

interface LoginProps {
    onLoginSuccess?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    return (
        <AuthLayout>
            <LoginForm onSuccess={onLoginSuccess} />
            <div className="form__link">
                <p>
                    ¿No tienes cuenta?{" "}
                    <Link to="/register" className="form__link-text">
                        Regístrate
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};
