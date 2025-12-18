import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import { RegisterForm } from "../components/RegisterForm";

interface RegisterProps {
    onRegisterSuccess?: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onRegisterSuccess }) => {
    const navigate = useNavigate();

    const handleSuccess = () => {
        onRegisterSuccess?.();
        navigate("/inicio", { replace: true });
    };

    return (
        <AuthLayout>
            <RegisterForm onSuccess={handleSuccess} />
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
