import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import type {
    RoutineExercise,
    RoutineExerciseFormData,
} from "../types/routineExercise";
import "./editRoutineExerciseModal.css";

const getVideoUrl = (videoPath: string | null) => {
    if (!videoPath) return null;
    return `http://localhost:3000/resources/examples_exercises/${videoPath}`;
};

interface EditRoutineExerciseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<RoutineExerciseFormData, "exerciseId">) => void;
    routineExercise: RoutineExercise | null;
}

export default function EditRoutineExerciseModal({
    isOpen,
    onClose,
    onSubmit,
    routineExercise,
}: EditRoutineExerciseModalProps) {
    const [formData, setFormData] = useState({
        sets: 3,
        repsMin: 6,
        repsMax: 10,
        weight: undefined as number | undefined,
        restTime: 60,
    });

    useEffect(() => {
        if (isOpen && routineExercise) {
            setFormData({
                sets: routineExercise.sets,
                repsMin: routineExercise.repsMin,
                repsMax: routineExercise.repsMax,
                weight: routineExercise.weight || undefined,
                restTime: routineExercise.restTime,
            });
        }
    }, [isOpen, routineExercise]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen || !routineExercise) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content exercise-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2>Editar Ejercicio</h2>
                    <button onClick={onClose} className="modal-close">
                        <X size={24} />
                    </button>
                </div>

                {routineExercise.exercise?.videoPath && (
                    <div className="exercise-video-container">
                        <video
                            src={
                                getVideoUrl(
                                    routineExercise.exercise.videoPath
                                ) || ""
                            }
                            autoPlay
                            loop
                            muted
                            className="exercise-video"
                        />
                    </div>
                )}

                <div className="exercise-name-display">
                    {routineExercise.exercise?.name}
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>
                                Series <span className="required">*</span>
                            </label>
                            <Input
                                type="number"
                                value={formData.sets}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        sets: Number(e.target.value),
                                    })
                                }
                                min="1"
                                max="100"
                                placeholder="Ej: 3"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Repeticiones Mínimas{" "}
                                <span className="required">*</span>
                            </label>
                            <Input
                                type="number"
                                value={formData.repsMin}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        repsMin: Number(e.target.value),
                                    })
                                }
                                min="1"
                                max="1000"
                                placeholder="Ej: 6"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>
                                Repeticiones Máximas{" "}
                                <span className="required">*</span>
                            </label>
                            <Input
                                type="number"
                                value={formData.repsMax}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        repsMax: Number(e.target.value),
                                    })
                                }
                                min="1"
                                max="1000"
                                placeholder="Ej: 8"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Peso (kg)</label>
                            <Input
                                type="number"
                                value={formData.weight || ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        weight: e.target.value
                                            ? Number(e.target.value)
                                            : undefined,
                                    })
                                }
                                min="0"
                                step="0.5"
                                placeholder="Ej: 50"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>
                                Descanso (segundos){" "}
                                <span className="required">*</span>
                            </label>
                            <Input
                                type="number"
                                value={formData.restTime}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        restTime: Number(e.target.value),
                                    })
                                }
                                min="0"
                                max="600"
                                placeholder="Ej: 60"
                                required
                            />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="secondary"
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary">
                            Guardar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
