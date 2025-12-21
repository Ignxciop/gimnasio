import { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import { exerciseService } from "../services/exerciseService";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import type { RoutineExerciseFormData } from "../types/routineExercise";
import type { Exercise } from "../types/exercise";
import "./addExerciseModal.css";

const getVideoUrl = (videoPath: string | null) => {
    if (!videoPath) return null;
    return `http://localhost:3000/resources/examples_exercises/${videoPath}`;
};

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
        sets: 0,
        repsMin: 0,
        repsMax: 0,
        weight: undefined,
        restTime: 0,
    });
    const [weightInput, setWeightInput] = useState<string>("");
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
        null
    );
    const [searchTerm, setSearchTerm] = useState("");

    const exercisesFetch = useFetch<Exercise[]>({
        fetchFn: exerciseService.getAll,
    });

    useEffect(() => {
        if (isOpen) {
            exercisesFetch.execute();
            setFormData({
                exerciseId: 0,
                sets: 0,
                repsMin: 0,
                repsMax: 0,
                weight: undefined,
                restTime: 0,
            });
            setWeightInput("");
            setSelectedExercise(null);
            setSearchTerm("");
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.exerciseId === 0) {
            return;
        }

        const weight =
            weightInput === ""
                ? undefined
                : parseFloat(weightInput.replace(",", "."));
        onSubmit({ ...formData, weight });
    };

    if (!isOpen) return null;

    const filteredExercises =
        exercisesFetch.data?.filter((ex) =>
            ex.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [];

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
                    {selectedExercise?.videoPath && (
                        <div className="exercise-video-container">
                            <video
                                src={
                                    getVideoUrl(selectedExercise.videoPath) ||
                                    ""
                                }
                                autoPlay
                                loop
                                muted
                                className="exercise-video"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>
                            Ejercicio <span className="required">*</span>
                        </label>
                        <div className="exercise-search">
                            <div className="search-input-wrapper">
                                <Search size={18} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Buscar ejercicio..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="search-input"
                                />
                            </div>
                            <div className="exercise-list">
                                {filteredExercises.length > 0 ? (
                                    filteredExercises.map((exercise) => (
                                        <div
                                            key={exercise.id}
                                            className={`exercise-list-item ${
                                                formData.exerciseId ===
                                                exercise.id
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            onClick={() => {
                                                setFormData({
                                                    ...formData,
                                                    exerciseId: exercise.id,
                                                });
                                                setSelectedExercise(exercise);
                                            }}
                                        >
                                            {exercise.videoPath && (
                                                <div className="exercise-list-thumbnail">
                                                    <video
                                                        src={
                                                            getVideoUrl(
                                                                exercise.videoPath
                                                            ) || ""
                                                        }
                                                        className="exercise-list-video"
                                                    />
                                                </div>
                                            )}
                                            <div className="exercise-list-info">
                                                <span className="exercise-list-name">
                                                    {exercise.name}
                                                </span>
                                                <span className="exercise-list-equipment">
                                                    {exercise.equipment?.name}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="exercise-list-empty">
                                        No se encontraron ejercicios
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>
                                Series <span className="required">*</span>
                            </label>
                            <Input
                                type="number"
                                value={formData.sets || ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        sets: e.target.value
                                            ? Number(e.target.value)
                                            : 0,
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
                                value={formData.repsMin || ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        repsMin: e.target.value
                                            ? Number(e.target.value)
                                            : 0,
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
                                value={formData.repsMax || ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        repsMax: e.target.value
                                            ? Number(e.target.value)
                                            : 0,
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
                                type="text"
                                value={weightInput}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (
                                        value === "" ||
                                        /^\d*[,.]?\d*$/.test(value)
                                    ) {
                                        setWeightInput(value);
                                    }
                                }}
                                placeholder="Ej: 50 o 50,5"
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
                                value={formData.restTime || ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        restTime: e.target.value
                                            ? Number(e.target.value)
                                            : 0,
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
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={formData.exerciseId === 0}
                        >
                            Agregar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
