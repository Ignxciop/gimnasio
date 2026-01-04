import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { validators } from "../utils/validators";
import { authService } from "../services/authService";
import { ApiError } from "../services/api";
import { GENDERS } from "../config/constants";
import "../styles/form.css";

interface RegisterFormProps {
    onSuccess?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [gender, setGender] = useState<"male" | "female">(GENDERS.MALE);
    const [errors, setErrors] = useState<{
        name?: string;
        lastname?: string;
        email?: string;
        username?: string;
        password?: string;
        confirmPassword?: string;
        gender?: string;
    }>({});
    const [generalError, setGeneralError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: {
            name?: string;
            lastname?: string;
            email?: string;
            username?: string;
            password?: string;
            confirmPassword?: string;
            gender?: string;
        } = {};

        if (!name.trim()) newErrors.name = "El nombre es requerido";
        if (!lastname.trim()) newErrors.lastname = "El apellido es requerido";
        if (!username.trim())
            newErrors.username = "El nombre de usuario es requerido";
        if (!gender) newErrors.gender = "El género es requerido";

        const emailError = validators.email(email);
        if (emailError) newErrors.email = emailError;

        const passwordError = validators.password(password);
        if (passwordError) newErrors.password = passwordError;

        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralError("");

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const response = await authService.register({
                name,
                lastname,
                email,
                username,
                password,
                gender,
            });

            navigate("/verificar-correo", {
                state: {
                    userId: response.data.userId,
                    email: response.data.email,
                    password,
                },
            });
        } catch (error) {
            if (error instanceof ApiError) {
                if (error.errors) {
                    const backendErrors: {
                        name?: string;
                        lastname?: string;
                        email?: string;
                        username?: string;
                        password?: string;
                        gender?: string;
                    } = {};
                    error.errors.forEach((err) => {
                        const field = err.field as keyof typeof backendErrors;
                        if (field in backendErrors) {
                            backendErrors[field] = err.message;
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
                <h1 className="form__title">Crear Cuenta</h1>
                <p className="form__subtitle">
                    Completa el formulario para registrarte
                </p>
            </div>

            {generalError && <div className="form__error">{generalError}</div>}

            <div className="form__field">
                <Input
                    type="text"
                    label="Nombre"
                    placeholder="Juan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={errors.name}
                    disabled={isLoading}
                    autoComplete="given-name"
                />
            </div>

            <div className="form__field">
                <Input
                    type="text"
                    label="Apellido"
                    placeholder="Pérez"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    error={errors.lastname}
                    disabled={isLoading}
                    autoComplete="family-name"
                />
            </div>

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
                    type="text"
                    label="Nombre de Usuario"
                    placeholder="juanperez"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    error={errors.username}
                    disabled={isLoading}
                    autoComplete="username"
                />
            </div>

            <div className="form__field">
                <label className="form__label">Género</label>
                <div className="form__radio-group">
                    <label className="form__radio-label">
                        <input
                            type="radio"
                            name="gender"
                            value={GENDERS.MALE}
                            checked={gender === GENDERS.MALE}
                            onChange={(e) =>
                                setGender(e.target.value as "male" | "female")
                            }
                            disabled={isLoading}
                            className="form__radio-input"
                        />
                        <span className="form__radio-text">Hombre</span>
                    </label>
                    <label className="form__radio-label">
                        <input
                            type="radio"
                            name="gender"
                            value={GENDERS.FEMALE}
                            checked={gender === GENDERS.FEMALE}
                            onChange={(e) =>
                                setGender(e.target.value as "male" | "female")
                            }
                            disabled={isLoading}
                            className="form__radio-input"
                        />
                        <span className="form__radio-text">Mujer</span>
                    </label>
                </div>
                {errors.gender && (
                    <span className="form__error-text">{errors.gender}</span>
                )}
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
                    autoComplete="new-password"
                />
                {!errors.password && (
                    <span className="form__help-text">
                        Mínimo 12 caracteres, debe incluir: mayúscula,
                        minúscula, número y carácter especial (@$!%*?&#)
                    </span>
                )}
            </div>

            <div className="form__field">
                <Input
                    type="password"
                    label="Confirmar Contraseña"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={errors.confirmPassword}
                    disabled={isLoading}
                    autoComplete="new-password"
                />
            </div>

            <div className="form__legal-notice">
                <p>
                    Al crear una cuenta aceptas nuestros{" "}
                    <a
                        href="/terminos"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="form__legal-link"
                    >
                        Términos de Uso
                    </a>{" "}
                    y{" "}
                    <a
                        href="/privacidad"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="form__legal-link"
                    >
                        Política de Privacidad
                    </a>
                </p>
            </div>

            <div className="form__footer">
                <Button type="submit" fullWidth isLoading={isLoading}>
                    Registrarse
                </Button>
            </div>
        </form>
    );
};
