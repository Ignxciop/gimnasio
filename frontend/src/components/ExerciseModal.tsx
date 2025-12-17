import React, { useState, useEffect } from "react";
import { Modal } from "./ui/Modal";
import type { Exercise } from "../services/exerciseService";
import type { Equipment } from "../services/equipmentService";
import type { MuscleGroup } from "../services/muscleGroupService";
import "./exerciseModal.css";

interface ExerciseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (
        name: string,
        equipmentId: number,
        muscleGroupId: number
    ) => Promise<void>;
    exercise?: Exercise | null;
    equipment: Equipment[];
    muscleGroups: MuscleGroup[];
    title: string;
}

export const ExerciseModal: React.FC<ExerciseModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    exercise,
    equipment,
    muscleGroups,
    title,
}) => {
    const [name, setName] = useState("");
    const [equipmentId, setEquipmentId] = useState<number>(0);
    const [muscleGroupId, setMuscleGroupId] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (exercise) {
            setName(exercise.name);
            setEquipmentId(exercise.equipmentId);
            setMuscleGroupId(exercise.muscleGroupId);
        } else {
            setName("");
            setEquipmentId(0);
            setMuscleGroupId(0);
        }
        setError("");
    }, [exercise, isOpen]);

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

        if (equipmentId === 0) {
            setError("Debes seleccionar un equipamiento");
            return;
        }

        if (muscleGroupId === 0) {
            setError("Debes seleccionar un grupo muscular");
            return;
        }

        try {
            setLoading(true);
            await onSubmit(name.trim(), equipmentId, muscleGroupId);
            setName("");
            setEquipmentId(0);
            setMuscleGroupId(0);
            onClose();
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Error al guardar el ejercicio";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit} className="exercise-modal__form">
                <div className="exercise-modal__field">
                    <label className="exercise-modal__label">
                        Nombre del ejercicio
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej: Press de banca, Curl de bíceps..."
                        className="exercise-modal__input"
                        disabled={loading}
                        autoFocus
                    />
                </div>

                <div className="exercise-modal__field">
                    <label className="exercise-modal__label">
                        Equipamiento
                    </label>
                    <select
                        value={equipmentId}
                        onChange={(e) =>
                            setEquipmentId(parseInt(e.target.value))
                        }
                        className="exercise-modal__select"
                        disabled={loading}
                    >
                        <option value={0}>Selecciona un equipamiento</option>
                        {equipment.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="exercise-modal__field">
                    <label className="exercise-modal__label">
                        Grupo muscular
                    </label>
                    <select
                        value={muscleGroupId}
                        onChange={(e) =>
                            setMuscleGroupId(parseInt(e.target.value))
                        }
                        className="exercise-modal__select"
                        disabled={loading}
                    >
                        <option value={0}>Selecciona un grupo muscular</option>
                        {muscleGroups.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>

                {error && (
                    <span className="exercise-modal__error">{error}</span>
                )}

                <div className="exercise-modal__actions">
                    <button
                        type="button"
                        onClick={onClose}
                        className="exercise-modal__button exercise-modal__button--cancel"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="exercise-modal__button exercise-modal__button--submit"
                        disabled={loading}
                    >
                        {loading ? "Guardando..." : "Guardar"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
