import React, { useState, useEffect } from "react";
import { Modal } from "./ui/Modal";
import { Select } from "./ui/Select";
import { validators } from "../utils/validators";
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
        muscleGroupId: number,
        secondaryMuscleGroupIds: number[],
        videoFile?: File | null
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
    const [secondaryMuscleGroupIds, setSecondaryMuscleGroupIds] = useState<
        number[]
    >([]);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (exercise) {
            setName(exercise.name);
            setEquipmentId(exercise.equipmentId);
            setMuscleGroupId(exercise.muscleGroupId);
            setSecondaryMuscleGroupIds(
                exercise.secondaryMuscleGroups?.map(
                    (smg) => smg.muscleGroupId
                ) || []
            );
        } else {
            setName("");
            setEquipmentId(0);
            setMuscleGroupId(0);
            setSecondaryMuscleGroupIds([]);
            setVideoFile(null);
        }
        setError("");
    }, [exercise, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const nameError = validators.name(name);
        if (nameError) {
            setError(nameError);
            return;
        }

        const equipmentError = validators.select(
            equipmentId,
            "un equipamiento"
        );
        if (equipmentError) {
            setError(equipmentError);
            return;
        }

        const muscleGroupError = validators.select(
            muscleGroupId,
            "un grupo muscular"
        );
        if (muscleGroupError) {
            setError(muscleGroupError);
            return;
        }

        try {
            setLoading(true);
            await onSubmit(
                name.trim(),
                equipmentId,
                muscleGroupId,
                secondaryMuscleGroupIds,
                videoFile
            );
            setName("");
            setEquipmentId(0);
            setMuscleGroupId(0);
            setSecondaryMuscleGroupIds([]);
            setVideoFile(null);
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

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== "video/mp4") {
                setError("Solo se permiten archivos .mp4");
                e.target.value = "";
                return;
            }
            if (file.size > 50 * 1024 * 1024) {
                setError("El archivo no puede superar los 50MB");
                e.target.value = "";
                return;
            }
            setVideoFile(file);
            setError("");
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
                    <Select
                        value={equipmentId.toString()}
                        onChange={(val) =>
                            setEquipmentId(parseInt(val as string))
                        }
                        options={equipment.map((item) => ({
                            value: item.id,
                            label: item.name,
                        }))}
                        placeholder="Selecciona un equipamiento"
                        disabled={loading}
                        className="exercise-modal__select"
                        searchable={true}
                    />
                </div>

                <div className="exercise-modal__field">
                    <label className="exercise-modal__label">
                        Grupo Muscular Primario
                    </label>
                    <Select
                        value={muscleGroupId.toString()}
                        onChange={(val) =>
                            setMuscleGroupId(parseInt(val as string))
                        }
                        options={muscleGroups.map((item) => ({
                            value: item.id,
                            label: item.name,
                        }))}
                        placeholder="Selecciona el grupo muscular primario"
                        disabled={loading}
                        className="exercise-modal__select"
                        searchable={true}
                    />
                </div>

                <div className="exercise-modal__field">
                    <label className="exercise-modal__label">
                        Grupos Musculares Secundarios (opcional)
                    </label>
                    <Select
                        value={secondaryMuscleGroupIds}
                        onChange={(val) =>
                            setSecondaryMuscleGroupIds(val as number[])
                        }
                        options={muscleGroups
                            .filter((item) => item.id !== muscleGroupId)
                            .map((item) => ({
                                value: item.id,
                                label: item.name,
                            }))}
                        placeholder="Selecciona grupos musculares secundarios"
                        disabled={loading}
                        className="exercise-modal__select"
                        searchable={true}
                        multiple={true}
                    />
                </div>

                <div className="exercise-modal__field">
                    <label className="exercise-modal__label">
                        Video de ejemplo (opcional)
                    </label>
                    <input
                        type="file"
                        accept="video/mp4"
                        onChange={handleVideoChange}
                        className="exercise-modal__input"
                        disabled={loading}
                    />
                    {videoFile && (
                        <span className="exercise-modal__file-name">
                            {videoFile.name}
                        </span>
                    )}
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
