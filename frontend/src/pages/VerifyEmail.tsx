import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { emailVerificationService } from "../services/emailVerificationService";
import { authService } from "../services/authService";
import { useToast } from "../hooks/useToast";
import { useApiCall } from "../hooks/useApiCall";
import { AuthLayout } from "../layouts/AuthLayout";
import { Button } from "../components/ui/Button";
import "../styles/verifyEmail.css";

export default function VerifyEmail() {
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();

    const [code, setCode] = useState("");
    const [timeLeft, setTimeLeft] = useState(300);
    const [canResend, setCanResend] = useState(false);

    const userId = location.state?.userId;
    const email = location.state?.email;
    const tempPassword = location.state?.password;

    const verifyEmail = useApiCall(emailVerificationService.verifyEmail, {
        errorMessage: "Error al verificar el código",
        onSuccess: async () => {
            showToast("success", "¡Correo verificado exitosamente!");

            if (email && tempPassword) {
                try {
                    const response = await authService.login({
                        emailOrUsername: email,
                        password: tempPassword,
                    });
                    authService.saveToken(response.data.accessToken);
                    navigate("/inicio");
                } catch {
                    navigate("/login");
                }
            } else {
                navigate("/login");
            }
        },
    });

    const resendCode = useApiCall(emailVerificationService.resendCode, {
        successMessage: "Código reenviado exitosamente",
        errorMessage: "Error al reenviar el código",
        onSuccess: () => {
            setTimeLeft(300);
            setCanResend(false);
        },
    });

    useEffect(() => {
        if (!userId || !email) {
            navigate("/register");
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [userId, email, navigate]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (code.length !== 6) {
            showToast("error", "El código debe tener 6 dígitos");
            return;
        }

        await verifyEmail.execute({ userId, code });
    };

    const handleResend = async () => {
        if (!canResend) return;
        await resendCode.execute({ userId });
    };

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
        setCode(value);
    };

    return (
        <AuthLayout>
            <div className="verify-email-container">
                <div className="verify-email-header">
                    <button
                        onClick={() => navigate("/register")}
                        className="btn-back-verify"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div className="verify-icon">
                        <Mail size={48} />
                    </div>
                    <h1>Verifica tu correo</h1>
                    <p>
                        Hemos enviado un código de 6 dígitos a
                        <br />
                        <strong>{email}</strong>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="verify-form">
                    <div className="code-input-container">
                        <input
                            type="text"
                            inputMode="numeric"
                            value={code}
                            onChange={handleCodeChange}
                            placeholder="000000"
                            className="code-input"
                            maxLength={6}
                            autoComplete="off"
                        />
                    </div>

                    <div className="timer-container">
                        {timeLeft > 0 ? (
                            <p className="timer">
                                El código expira en{" "}
                                <strong>{formatTime(timeLeft)}</strong>
                            </p>
                        ) : (
                            <p className="timer expired">Código expirado</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        isLoading={verifyEmail.loading}
                        disabled={code.length !== 6}
                    >
                        Verificar código
                    </Button>

                    <button
                        type="button"
                        onClick={handleResend}
                        className="btn-resend"
                        disabled={!canResend || resendCode.loading}
                    >
                        {resendCode.loading
                            ? "Reenviando..."
                            : canResend
                            ? "Reenviar código"
                            : "Espera para reenviar"}
                    </button>
                </form>

                <p className="verify-note">
                    Si no recibes el correo, revisa tu carpeta de spam
                </p>
            </div>
        </AuthLayout>
    );
}
