import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, GripVertical, X } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { useToast } from "../hooks/useToast";
import { useModal } from "../hooks/useModal";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { activeRoutineService } from "../services/activeRoutineService";
import { authService } from "../services/authService";
import "../styles/activeRoutine.css";

interface ActiveRoutineSet {
    id: number;
    exerciseId: number;
    setNumber: number;
    targetWeight: number | null;
    targetRepsMin: number;
    targetRepsMax: number;
    actualWeight: number | null;
    actualReps: number | null;
    completed: boolean;
    isPR: boolean;
    order: number;
    exercise: {
        id: number;
        name: string;
        videoPath: string | null;
        equipment: {
            id: number;
            name: string;
        };
        muscleGroup: {
            id: number;
            name: string;
        };
    };
}

interface ActiveRoutine {
    id: number;
    userId: number;
    routineId: number;
    startTime: string;
    endTime: string | null;
    status: string;
    routine: {
        id: number;
        name: string;
        description: string | null;
    };
    sets: ActiveRoutineSet[];
}

const getVideoUrl = (videoPath: string | null) => {
    if (!videoPath) return null;
    return `http://localhost:3000/resources/examples_exercises/${videoPath}`;
};

const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
        return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function ActiveRoutine() {
    const { routineId, activeId } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const cancelModal = useModal();
    const completeModal = useModal();
    const [activeRoutine, setActiveRoutine] = useState<ActiveRoutine | null>(
        null
    );
    const [elapsedTime, setElapsedTime] = useState(0);
    const [draggedSet, setDraggedSet] = useState<ActiveRoutineSet | null>(null);

    useEffect(() => {
        const fetchActiveRoutine = async () => {
            try {
                const token = authService.getToken();
                if (!token) return;

                const data = await activeRoutineService.getActive(token);
                if (!data || data.id !== Number(activeId)) {
                    showToast("error", "Rutina activa no encontrada");
                    navigate(`/rutinas/${routineId}`);
                    return;
                }

                setActiveRoutine(data);
            } catch {
                showToast("error", "Error al cargar rutina activa");
                navigate(`/rutinas/${routineId}`);
            }
        };

        fetchActiveRoutine();
    }, [activeId, routineId, navigate, showToast]);

    useEffect(() => {
        if (!activeRoutine) return;

        const startTime = new Date(activeRoutine.startTime).getTime();
        const updateTimer = () => {
            const now = Date.now();
            const elapsed = Math.floor((now - startTime) / 1000);
            setElapsedTime(elapsed);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [activeRoutine]);

    const handleWeightChange = (setId: number, value: string) => {
        if (!activeRoutine) return;

        const normalizedValue = value.replace(/,/g, ".");
        const weight = normalizedValue === "" ? null : Number(normalizedValue);

        setActiveRoutine({
            ...activeRoutine,
            sets: activeRoutine.sets.map((set) =>
                set.id === setId ? { ...set, actualWeight: weight } : set
            ),
        });
    };

    const handleRepsChange = (setId: number, value: string) => {
        if (!activeRoutine) return;

        const reps = value === "" ? null : Number(value);

        setActiveRoutine({
            ...activeRoutine,
            sets: activeRoutine.sets.map((set) =>
                set.id === setId ? { ...set, actualReps: reps } : set
            ),
        });
    };

    const handleCompleteSet = async (setId: number) => {
        if (!activeRoutine) return;

        const set = activeRoutine.sets.find((s) => s.id === setId);
        if (!set) return;

        try {
            const token = authService.getToken();
            if (!token) return;

            const updatedSet = await activeRoutineService.updateSet(
                setId,
                set.actualWeight,
                set.actualReps,
                token
            );

            setActiveRoutine({
                ...activeRoutine,
                sets: activeRoutine.sets.map((s) =>
                    s.id === setId ? { ...s, ...updatedSet } : s
                ),
            });

            if (updatedSet.isPR) {
                showToast("success", "¡Nuevo PR! 🏆");
            }
        } catch (error) {
            showToast(
                "error",
                error instanceof Error ? error.message : "Error al actualizar"
            );
        }
    };

    const handleDragStart = (set: ActiveRoutineSet) => {
        setDraggedSet(set);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = async (
        e: React.DragEvent,
        targetSet: ActiveRoutineSet
    ) => {
        e.preventDefault();

        if (!draggedSet || draggedSet.id === targetSet.id || !activeRoutine) {
            setDraggedSet(null);
            return;
        }

        try {
            const token = authService.getToken();
            if (!token) return;

            const sets = activeRoutine.sets;
            const draggedIndex = sets.findIndex((s) => s.id === draggedSet.id);
            const targetIndex = sets.findIndex((s) => s.id === targetSet.id);

            const reordered = [...sets];
            reordered.splice(draggedIndex, 1);
            reordered.splice(targetIndex, 0, draggedSet);

            const setIds = reordered.map((s) => s.id);

            await activeRoutineService.reorderSets(setIds, token);

            setActiveRoutine({
                ...activeRoutine,
                sets: reordered,
            });

            showToast("success", "Orden actualizado");
        } catch {
            showToast("error", "Error al actualizar orden");
        }

        setDraggedSet(null);
    };

    const handleCompleteWorkout = async () => {
        if (!activeRoutine) return;

        const incompleteSets = activeRoutine.sets.filter((s) => !s.completed);
        if (incompleteSets.length > 0) {
            completeModal.openModal();
            return;
        }

        await confirmCompleteWorkout();
    };

    const confirmCompleteWorkout = async () => {
        if (!activeRoutine) return;

        try {
            const token = authService.getToken();
            if (!token) return;

            await activeRoutineService.complete(activeRoutine.id, token);
            showToast("success", "¡Entrenamiento completado!");
            navigate(`/rutinas/${routineId}`);
        } catch (error) {
            showToast(
                "error",
                error instanceof Error
                    ? error.message
                    : "Error al finalizar entrenamiento"
            );
        }
    };

    if (!activeRoutine) {
        return (
            <MainLayout>
                <div className="loading">Cargando...</div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="active-routine-container">
                <div className="active-routine-header">
                    <div className="header-buttons">
                        <button
                            onClick={() => navigate(`/rutinas/${routineId}`)}
                            className="btn-back"
                        >
                            <ArrowLeft size={18} />
                            Volver
                        </button>
                        <button
                            onClick={cancelModal.openModal}
                            className="btn-cancel"
                        >
                            <X size={18} />
                            Cancelar
                        </button>
                    </div>
                    <div className="routine-info">
                        <h1>{activeRoutine.routine.name}</h1>
                        <div className="timer">{formatTime(elapsedTime)}</div>
                    </div>
                </div>

                <div className="sets-list">
                    {Object.entries(
                        activeRoutine.sets.reduce((acc, set) => {
                            const exerciseId = set.exerciseId;
                            if (!acc[exerciseId]) {
                                acc[exerciseId] = {
                                    exercise: set.exercise,
                                    sets: [],
                                };
                            }
                            acc[exerciseId].sets.push(set);
                            return acc;
                        }, {} as Record<number, { exercise: (typeof activeRoutine.sets)[0]["exercise"]; sets: typeof activeRoutine.sets }>)
                    ).map(([exerciseId, { exercise, sets }]) => (
                        <div key={exerciseId} className="exercise-group">
                            <div className="exercise-group-header">
                                {exercise.videoPath && (
                                    <div className="exercise-thumbnail">
                                        <video
                                            src={
                                                getVideoUrl(
                                                    exercise.videoPath
                                                ) || ""
                                            }
                                            className="exercise-thumbnail-video"
                                        />
                                    </div>
                                )}
                                <div className="exercise-info">
                                    <h3>{exercise.name}</h3>
                                    <div className="exercise-meta">
                                        <span>{exercise.muscleGroup.name}</span>
                                        <span>•</span>
                                        <span>{exercise.equipment.name}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="sets-group">
                                {sets.map((set) => (
                                    <div
                                        key={set.id}
                                        className={`set-card ${
                                            set.completed ? "completed" : ""
                                        } ${set.isPR ? "pr" : ""}`}
                                        draggable
                                        onDragStart={() => handleDragStart(set)}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, set)}
                                    >
                                        <GripVertical
                                            size={16}
                                            className="drag-handle"
                                        />
                                        <div className="set-content">
                                            <span className="set-number">
                                                {set.setNumber}
                                            </span>
                                            <div className="input-wrapper">
                                                <label className="input-label">
                                                    KG
                                                </label>
                                                <input
                                                    type="text"
                                                    className="set-input"
                                                    value={
                                                        set.actualWeight ?? ""
                                                    }
                                                    onChange={(e) =>
                                                        handleWeightChange(
                                                            set.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={set.completed}
                                                    placeholder={
                                                        set.targetWeight?.toString() ||
                                                        "0"
                                                    }
                                                />
                                            </div>
                                            <div className="input-wrapper">
                                                <label className="input-label">
                                                    REPS
                                                </label>
                                                <input
                                                    type="number"
                                                    className="set-input"
                                                    value={set.actualReps ?? ""}
                                                    onChange={(e) =>
                                                        handleRepsChange(
                                                            set.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={set.completed}
                                                    placeholder={set.targetRepsMin.toString()}
                                                />
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleCompleteSet(set.id)
                                                }
                                                className="btn-complete-set"
                                                disabled={set.completed}
                                            >
                                                <Check size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    onClick={handleCompleteWorkout}
                    className="btn-complete-workout"
                >
                    Finalizar entrenamiento
                </button>

                <ConfirmDialog
                    isOpen={cancelModal.isOpen}
                    onClose={cancelModal.closeModal}
                    onConfirm={async () => {
                        try {
                            const token = authService.getToken();
                            if (!token || !activeRoutine) return;

                            await activeRoutineService.cancel(
                                activeRoutine.id,
                                token
                            );
                            showToast("success", "Rutina cancelada");
                            navigate(`/rutinas/${routineId}`);
                        } catch (error) {
                            showToast(
                                "error",
                                error instanceof Error
                                    ? error.message
                                    : "Error al cancelar rutina"
                            );
                        }
                    }}
                    title="Cancelar rutina"
                    message="¿Seguro que deseas cancelar esta rutina? Se perderá todo el progreso."
                    confirmText="Sí, cancelar"
                    cancelText="No, continuar"
                    variant="danger"
                />

                <ConfirmDialog
                    isOpen={completeModal.isOpen}
                    onClose={completeModal.closeModal}
                    onConfirm={confirmCompleteWorkout}
                    title="Finalizar entrenamiento"
                    message={`Tienes ${
                        activeRoutine.sets.filter((s) => !s.completed).length
                    } series sin completar. ¿Deseas finalizar igualmente?`}
                    confirmText="Sí, finalizar"
                    cancelText="Cancelar"
                    variant="warning"
                />
            </div>
        </MainLayout>
    );
}
