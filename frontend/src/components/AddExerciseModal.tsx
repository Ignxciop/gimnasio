import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import { exerciseService } from "../services/exerciseService";
import { Select } from "./ui/Select";
import { Input } from "./ui/Input";
import type { RoutineExerciseFormData } from "../types/routineExercise";
import type { Exercise } from "../types/exercise";
import "./addExerciseModal.css";

interface AddExerciseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: RoutineExerciseFormData) => void;
}

export default function AddExerciseModal({
    isOpen,
    onClose,
    onSubmit,
}: AddExerciseModalProps) {
    const [formData, setFormData] = useState<RoutineExerciseFormData>({
        exerciseId: 0,
        sets: 3,
        reps: 10,
        weight: undefined,
        restTime: 60,
    });

    const exercisesFetch = useFetch<Exercise[]>({
        fetchFn: exerciseService.getAll,
    });

    useEffect(() => {
        if (isOpen) {
            exercisesFetch.execute();
            setFormData({
                exerciseId: 0,
                sets: 3,
                reps: 10,
                weight: undefined,
                restTime: 60,
            });
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.exerciseId === 0) {
            return;
        }

        onSubmit(formData);
    };

    if (!isOpen) return null;

    const exerciseOptions =
        exercisesFetch.data?.map((ex) => ({
            value: ex.id,
            label: ex.name,
        })) || [];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content exercise-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2>Agregar Ejercicio</h2>
                    <button onClick={onClose} className="modal-close">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>
                            Ejercicio <span className="required">*</span>
                        </label>
                        <Select
                            value={formData.exerciseId}
                            onChange={(value) =>
                                setFormData({
                                    ...formData,
                                    exerciseId: Number(value),
                                })
                            }
                            options={exerciseOptions}
                            placeholder="Selecciona un ejercicio"
                            searchable
                        />
                    </div>

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
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={formData.exerciseId === 0}
                        >
                            Agregar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
