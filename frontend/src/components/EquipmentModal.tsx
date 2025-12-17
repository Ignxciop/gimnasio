import React, { useState, useEffect } from "react";
import { Modal } from "./ui/Modal";
import { validators } from "../utils/validators";
import type { Equipment } from "../services/equipmentService";
import "./equipmentModal.css";

interface EquipmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string) => Promise<void>;
    equipment?: Equipment | null;
    title: string;
}

export const EquipmentModal: React.FC<EquipmentModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    equipment,
    title,
}) => {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (equipment) {
            setName(equipment.name);
        } else {
            setName("");
        }
        setError("");
    }, [equipment, isOpen]);

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
                    : "Error al guardar el equipamiento";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit} className="equipment-modal__form">
                <div className="equipment-modal__field">
                    <label className="equipment-modal__label">
                        Nombre del equipamiento
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej: Mancuernas, Barra olímpica..."
                        className="equipment-modal__input"
                        disabled={loading}
                        autoFocus
                    />
                </div>

                {error && (
                    <span className="equipment-modal__error">{error}</span>
                )}

                <div className="equipment-modal__actions">
                    <button
                        type="button"
                        onClick={onClose}
                        className="equipment-modal__button equipment-modal__button--cancel"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="equipment-modal__button equipment-modal__button--submit"
                        disabled={loading}
                    >
                        {loading ? "Guardando..." : "Guardar"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
