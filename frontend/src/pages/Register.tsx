import React from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import { RegisterForm } from "../components/RegisterForm";

interface RegisterProps {
    onRegisterSuccess?: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onRegisterSuccess }) => {
    return (
        <AuthLayout>
            <RegisterForm onSuccess={onRegisterSuccess} />
            <div className="form__link">
                <p>
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/login" className="form__link-text">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};
