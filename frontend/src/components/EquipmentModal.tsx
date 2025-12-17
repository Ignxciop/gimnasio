import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
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
        } catch (err: any) {
            setError(err.message || "Error al guardar el equipamiento");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="equipment-modal">
            <div className="equipment-modal__overlay" onClick={onClose} />
            <div className="equipment-modal__content">
                <div className="equipment-modal__header">
                    <h2 className="equipment-modal__title">{title}</h2>
                    <button
                        onClick={onClose}
                        className="equipment-modal__close"
                        type="button"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="equipment-modal__form">
                    <div className="equipment-modal__field">
                        <label className="equipment-modal__label">
                            Nombre del equipamiento
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ej: Máquina, Barra, Polea..."
                            className="equipment-modal__input"
                            disabled={loading}
                            autoFocus
                        />
                        {error && (
                            <span className="equipment-modal__error">
                                {error}
                            </span>
                        )}
                    </div>

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
            </div>
        </div>
    );
};
