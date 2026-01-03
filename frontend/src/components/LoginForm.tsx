import React, { useState } from "react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { validators } from "../utils/validators";
import { authService } from "../services/authService";
import { ApiError } from "../services/api";
import "../styles/form.css";

interface LoginFormProps {
    onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string }>(
        {}
    );
    const [generalError, setGeneralError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: { email?: string; password?: string } = {};

        const emailError = validators.email(email);
        const passwordError = validators.password(password);

        if (emailError) newErrors.email = emailError;
        if (passwordError) newErrors.password = passwordError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralError("");

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            await authService.login({ email, password });

            onSuccess?.();
        } catch (error) {
            if (error instanceof ApiError) {
                if (error.errors) {
                    const backendErrors: { email?: string; password?: string } =
                        {};
                    error.errors.forEach((err) => {
                        if (err.field === "email" || err.field === "password") {
                            backendErrors[err.field] = err.message;
                        }
                    });
                    setErrors(backendErrors);
                } else {
                    setGeneralError(error.message);
                }
            } else {
                setGeneralError("Error de conexión. Intenta nuevamente.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form">
            <div className="form__header">
                <h1 className="form__title">Iniciar Sesión</h1>
                <p className="form__subtitle">
                    Ingresa tus credenciales para continuar
                </p>
            </div>

            {generalError && <div className="form__error">{generalError}</div>}

            <div className="form__field">
                <Input
                    type="email"
                    label="Email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                    disabled={isLoading}
                    autoComplete="email"
                />
            </div>

            <div className="form__field">
                <Input
                    type="password"
                    label="Contraseña"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                    disabled={isLoading}
                    autoComplete="current-password"
                />
            </div>

            <div className="form__footer">
                <Button type="submit" fullWidth isLoading={isLoading}>
                    Iniciar Sesión
                </Button>
            </div>
        </form>
    );
};
