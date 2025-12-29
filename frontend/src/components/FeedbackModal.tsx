import { useState, useEffect } from "react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { feedbackService } from "../services/feedbackService";
import { authService } from "../services/authService";
import { useApiCall } from "../hooks/useApiCall";
import { useToast } from "../hooks/useToast";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../config/messages";
import "./feedbackModal.css";

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: "suggestion" | "bug_report";
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
    isOpen,
    onClose,
    type,
}) => {
    const { showToast } = useToast();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const createFeedback = useApiCall(
        (
            data: { type: string; title?: string; description: string },
            token: string
        ) => feedbackService.createFeedback(data, token),
        {
            successMessage:
                type === "suggestion"
                    ? SUCCESS_MESSAGES.FEEDBACK.SUGGESTION_SENT
                    : SUCCESS_MESSAGES.FEEDBACK.REPORT_SENT,
            errorMessage: ERROR_MESSAGES.FEEDBACK.SEND,
            onSuccess: () => onClose(),
        }
    );

    useEffect(() => {
        if (!isOpen) {
            setTitle("");
            setDescription("");
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (description.trim().length < 10) {
            showToast(
                "error",
                "La descripción debe tener al menos 10 caracteres"
            );
            return;
        }

        const token = authService.getToken();
        if (!token) {
            showToast("error", "No hay sesión activa");
            return;
        }

        await createFeedback.execute(
            {
                type,
                title: title.trim() || undefined,
                description: description.trim(),
            },
            token
        );
    };

    const modalTitle =
        type === "suggestion" ? "Enviar Sugerencia" : "Reportar Problema";
    const placeholderDescription =
        type === "suggestion"
            ? "Ejemplo: Sería útil agregar la funcionalidad X para..."
            : "Describe el problema: ¿Qué sucedió? ¿Qué esperabas que sucediera? ¿Pasos para reproducirlo?";

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
            <form className="feedback-form" onSubmit={handleSubmit}>
                <Input
                    label="Título (opcional)"
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Resumen breve"
                    maxLength={200}
                    disabled={createFeedback.loading}
                />

                <div className="feedback-form__field">
                    <label htmlFor="description">
                        Descripción <span className="required">*</span>
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={placeholderDescription}
                        rows={8}
                        maxLength={2000}
                        required
                        disabled={createFeedback.loading}
                    />
                    <span className="feedback-form__counter">
                        {description.length}/2000
                    </span>
                </div>

                <div className="feedback-form__actions">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={createFeedback.loading}
                    >
                        {UI_TEXTS.CANCEL}
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={createFeedback.loading}
                        disabled={description.trim().length < 10}
                    >
                        Enviar
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
