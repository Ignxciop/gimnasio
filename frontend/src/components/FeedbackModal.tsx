import { useState, useEffect } from "react";
import { X } from "lucide-react";
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

    if (!isOpen) return null;

    const modalTitle =
        type === "suggestion" ? "Enviar Sugerencia" : "Reportar Problema";
    const placeholderDescription =
        type === "suggestion"
            ? "Ejemplo: Sería útil agregar la funcionalidad X para..."
            : "Describe el problema: ¿Qué sucedió? ¿Qué esperabas que sucediera? ¿Pasos para reproducirlo?";

    return (
        <div className="feedback-modal-overlay" onClick={onClose}>
            <div
                className="feedback-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="feedback-modal__header">
                    <h2>{modalTitle}</h2>
                    <button
                        className="feedback-modal__close"
                        onClick={onClose}
                        aria-label="Cerrar"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form className="feedback-modal__form" onSubmit={handleSubmit}>
                    <div className="feedback-modal__field">
                        <label htmlFor="title">
                            Título{" "}
                            <span className="feedback-modal__optional">
                                (opcional)
                            </span>
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Resumen breve"
                            maxLength={200}
                            disabled={loading}
                        />
                    </div>

                    <div className="feedback-modal__field">
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
                        <span className="feedback-modal__counter">
                            {description.length}/2000
                        </span>
                    </div>

                    <div className="feedback-modal__actions">
                        <button
                            type="button"
                            className="feedback-modal__btn feedback-modal__btn--cancel"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="feedback-modal__btn feedback-modal__btn--submit"
                            disabled={loading || description.trim().length < 10}
                        >
                            {loading ? "Enviando..." : "Enviar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
