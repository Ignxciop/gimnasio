import { useState, useEffect } from "react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { feedbackService } from "../services/feedbackService";
import { authService } from "../services/authService";
import { useToast } from "../hooks/useToast";
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
    const [loading, setLoading] = useState(false);

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

        setLoading(true);
        try {
            const token = authService.getToken();
            if (!token) throw new Error("No hay sesión activa");

            await feedbackService.createFeedback(
                {
                    type,
                    title: title.trim() || undefined,
                    description: description.trim(),
                },
                token
            );

            showToast(
                "success",
                type === "suggestion"
                    ? "Sugerencia enviada correctamente"
                    : "Reporte enviado correctamente"
            );
            onClose();
        } catch (error) {
            showToast(
                "error",
                error instanceof Error ? error.message : "Error al enviar"
            );
        } finally {
            setLoading(false);
        }
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
                    disabled={loading}
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
                        disabled={loading}
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
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={loading}
                        disabled={description.trim().length < 10}
                    >
                        Enviar
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
