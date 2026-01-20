import { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { getVideoUrl } from "../config/constants";
import { useUnit } from "../hooks/useUnit";
import { useFetch } from "../hooks/useFetch";
import { exerciseService } from "../services/exerciseService";
import { kgToLbs, lbsToKg, formatWeight } from "../utils/unitConverter";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import type {
    RoutineExercise,
    RoutineExerciseFormData,
} from "../types/routineExercise";
import type { Exercise } from "../services/exerciseService";
import "./editRoutineExerciseModal.css";

interface EditRoutineExerciseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (
        data: Omit<RoutineExerciseFormData, "exerciseId"> & {
            exerciseId?: number;
        },
    ) => void;
    routineExercise: RoutineExercise | null;
}

export default function EditRoutineExerciseModal({
    isOpen,
    onClose,
    onSubmit,
    routineExercise,
}: EditRoutineExerciseModalProps) {
    const { unit } = useUnit();
    const [formData, setFormData] = useState({
        sets: 3,
        repsMin: 6,
        repsMax: 10,
        weight: undefined as number | undefined,
        restTime: 60,
    });
    const [weightInput, setWeightInput] = useState<string>("");
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
        null,
    );
    const [searchTerm, setSearchTerm] = useState("");

    const exercisesFetch = useFetch<Exercise[]>({
        fetchFn: exerciseService.getAll,
    });

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            exercisesFetch.execute();
            if (routineExercise) {
                setFormData({
                    sets: routineExercise.sets,
                    repsMin: routineExercise.repsMin,
                    repsMax: routineExercise.repsMax,
                    weight: routineExercise.weight || undefined,
                    restTime: routineExercise.restTime,
                });
                const displayWeight = routineExercise.weight
                    ? unit === "lbs"
                        ? formatWeight(kgToLbs(routineExercise.weight))
                        : routineExercise.weight
                    : "";
                setWeightInput(displayWeight.toString());
                setSelectedExercise(routineExercise.exercise || null);
            }
            setSearchTerm("");
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen, routineExercise]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let weightInKg: number | undefined = undefined;
        if (weightInput !== "") {
            const inputValue = parseFloat(weightInput.replace(",", "."));
            weightInKg = unit === "lbs" ? lbsToKg(inputValue) : inputValue;
        }

        const submitData: Omit<RoutineExerciseFormData, "exerciseId"> & {
            exerciseId?: number;
        } = { ...formData, weight: weightInKg };

        // Incluir exerciseId solo si se cambió el ejercicio
        if (
            selectedExercise &&
            selectedExercise.id !== routineExercise?.exercise?.id
        ) {
            submitData.exerciseId = selectedExercise.id;
        }

        onSubmit(submitData);
    };

    const filteredExercises =
        exercisesFetch.data?.filter((ex) =>
            ex.name.toLowerCase().includes(searchTerm.toLowerCase()),
        ) || [];

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

                {selectedExercise?.videoPath && (
                    <div className="exercise-video-container">
                        <video
                            src={getVideoUrl(selectedExercise.videoPath) || ""}
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
                            <input
                                type="text"
                                placeholder="Buscar ejercicio..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            <Search size={18} className="search-icon" />
                        </div>
                        <div className="exercise-list">
                            {filteredExercises.length > 0 ? (
                                filteredExercises.map((exercise) => (
                                    <div
                                        key={exercise.id}
                                        className={`exercise-list-item ${
                                            selectedExercise?.id === exercise.id
                                                ? "selected"
                                                : ""
                                        }`}
                                        onClick={() => {
                                            setSelectedExercise(exercise);
                                            setSearchTerm("");
                                        }}
                                    >
                                        {exercise.videoPath && (
                                            <div className="exercise-list-thumbnail">
                                                <video
                                                    src={
                                                        getVideoUrl(
                                                            exercise.videoPath,
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
                            <label>Peso ({unit})</label>
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
