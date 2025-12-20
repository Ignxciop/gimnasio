import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Input } from "./ui/Input";
import type {
    RoutineExercise,
    RoutineExerciseFormData,
} from "../types/routineExercise";
import "./editRoutineExerciseModal.css";

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
        reps: 10,
        weight: undefined as number | undefined,
        restTime: 60,
    });

    useEffect(() => {
        if (isOpen && routineExercise) {
            setFormData({
                sets: routineExercise.sets,
                reps: routineExercise.reps,
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
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Repeticiones <span className="required">*</span>
                            </label>
                            <Input
                                type="number"
                                value={formData.reps}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        reps: Number(e.target.value),
                                    })
                                }
                                min="1"
                                max="1000"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
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
                                placeholder="Opcional"
                            />
                        </div>

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
                                required
                            />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-cancel"
                        >
                            Cancelar
                        </button>
                        <button type="submit" className="btn-submit">
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
