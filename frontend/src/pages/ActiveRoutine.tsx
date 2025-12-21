import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, GripVertical } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { useToast } from "../hooks/useToast";
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
            } catch (error) {
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
        } catch (error) {
            showToast("error", "Error al actualizar orden");
        }

        setDraggedSet(null);
    };

    const handleCompleteWorkout = async () => {
        if (!activeRoutine) return;

        const incompleteSets = activeRoutine.sets.filter((s) => !s.completed);
        if (incompleteSets.length > 0) {
            if (
                !confirm(
                    `Tienes ${incompleteSets.length} series sin completar. ¿Deseas finalizar igualmente?`
                )
            ) {
                return;
            }
        }

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
                    <button
                        onClick={() => navigate(`/rutinas/${routineId}`)}
                        className="btn-back"
                    >
                        <ArrowLeft size={20} />
                        Volver
                    </button>
                    <div className="routine-info">
                        <h1>{activeRoutine.routine.name}</h1>
                        <div className="timer">{formatTime(elapsedTime)}</div>
                    </div>
                    <button
                        onClick={handleCompleteWorkout}
                        className="btn-complete-workout"
                    >
                        Finalizar
                    </button>
                </div>

                <div className="sets-list">
                    {activeRoutine.sets.map((set) => (
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
                            <div className="set-card-content">
                                <GripVertical
                                    size={20}
                                    className="drag-handle"
                                />
                                {set.exercise.videoPath && (
                                    <div className="set-thumbnail">
                                        <video
                                            src={
                                                getVideoUrl(
                                                    set.exercise.videoPath
                                                ) || ""
                                            }
                                            className="set-thumbnail-video"
                                        />
                                    </div>
                                )}
                                <div className="set-info">
                                    <h3>{set.exercise.name}</h3>
                                    <div className="set-details">
                                        <span className="set-number">
                                            Serie {set.setNumber}
                                        </span>
                                        <span className="set-target">
                                            Target:{" "}
                                            {set.targetRepsMin ===
                                            set.targetRepsMax
                                                ? `${set.targetRepsMin} reps`
                                                : `${set.targetRepsMin}-${set.targetRepsMax} reps`}
                                            {set.targetWeight &&
                                                ` @ ${set.targetWeight} kg`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="set-inputs">
                                <div className="input-group">
                                    <label>Peso (kg)</label>
                                    <input
                                        type="text"
                                        value={set.actualWeight ?? ""}
                                        onChange={(e) =>
                                            handleWeightChange(
                                                set.id,
                                                e.target.value
                                            )
                                        }
                                        disabled={set.completed}
                                        placeholder={
                                            set.targetWeight?.toString() || "0"
                                        }
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Reps</label>
                                    <input
                                        type="number"
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
                                    onClick={() => handleCompleteSet(set.id)}
                                    className="btn-complete-set"
                                    disabled={set.completed}
                                >
                                    <Check size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}
