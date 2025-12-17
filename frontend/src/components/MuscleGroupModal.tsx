import React, { useState, useEffect } from "react";
import { Modal } from "./ui/Modal";
import { validators } from "../utils/validators";
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

        const validationError = validators.name(name);
        if (validationError) {
            setError(validationError);
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

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit} className="muscle-group-modal__form">
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
                </div>

                {error && (
                    <span className="muscle-group-modal__error">{error}</span>
                )}

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
        </Modal>
    );
};
