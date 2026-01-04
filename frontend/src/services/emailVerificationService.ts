const API_URL = import.meta.env.VITE_API_URL;

interface VerifyEmailRequest {
    userId: string;
    code: string;
}

interface ResendCodeRequest {
    userId: string;
}

export const emailVerificationService = {
    async verifyEmail(data: VerifyEmailRequest): Promise<void> {
        const response = await fetch(`${API_URL}/api/auth/verify-email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al verificar el código");
        }
    },

    async resendCode(data: ResendCodeRequest): Promise<void> {
        const response = await fetch(`${API_URL}/api/auth/resend-code`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al reenviar el código");
        }
    },
};
