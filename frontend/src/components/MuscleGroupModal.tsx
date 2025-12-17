import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { MuscleGroup } from "../services/muscleGroupService";
import "./muscleGroupModal.css";

interface MuscleGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string) => Promise<void>;
    muscleGroup?: MuscleGroup | null;
    title: string;
}

export const MuscleGroupModal: React.FC<MuscleGroupModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    muscleGroup,
    title,
}) => {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (muscleGroup) {
            setName(muscleGroup.name);
        } else {
            setName("");
        }
        setError("");
    }, [muscleGroup, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (name.trim().length < 2) {
            setError("El nombre debe tener al menos 2 caracteres");
            return;
        }

        if (name.trim().length > 100) {
            setError("El nombre no puede exceder 100 caracteres");
            return;
        }

        try {
            setLoading(true);
            await onSubmit(name.trim());
            setName("");
            onClose();
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Error al guardar el grupo muscular";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="muscle-group-modal">
            <div className="muscle-group-modal__overlay" onClick={onClose} />
            <div className="muscle-group-modal__content">
                <div className="muscle-group-modal__header">
                    <h2 className="muscle-group-modal__title">{title}</h2>
                    <button
                        onClick={onClose}
                        className="muscle-group-modal__close"
                        type="button"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="muscle-group-modal__form"
                >
                    <div className="muscle-group-modal__field">
                        <label className="muscle-group-modal__label">
                            Nombre del grupo muscular
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ej: Espalda, Bíceps, Tríceps..."
                            className="muscle-group-modal__input"
                            disabled={loading}
                            autoFocus
                        />
                        {error && (
                            <span className="muscle-group-modal__error">
                                {error}
                            </span>
                        )}
                    </div>

                    <div className="muscle-group-modal__actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="muscle-group-modal__button muscle-group-modal__button--cancel"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="muscle-group-modal__button muscle-group-modal__button--submit"
                            disabled={loading}
                        >
                            {loading ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
