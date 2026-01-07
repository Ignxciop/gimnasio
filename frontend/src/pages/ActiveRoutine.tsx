import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, GripVertical, X, Plus, Trash2 } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { useToast } from "../hooks/useToast";
import { useModal } from "../hooks/useModal";
import { useApiCall } from "../hooks/useApiCall";
import { useUnit } from "../hooks/useUnit";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { VideoThumbnail } from "../components/ui/VideoThumbnail";
import { activeRoutineService } from "../services/activeRoutineService";
import { authService } from "../services/authService";
import { getVideoUrl } from "../config/constants";
import { formatTime } from "../utils/dateHelpers";
import { kgToLbs, lbsToKg, formatWeight } from "../utils/unitConverter";
import { LOADING_MESSAGES, ERROR_MESSAGES } from "../config/messages";
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
    userId: string;
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

export default function ActiveRoutine() {
    const { routineId, activeId } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { unit } = useUnit();
    const cancelModal = useModal();
    const completeModal = useModal();
    const [activeRoutine, setActiveRoutine] = useState<ActiveRoutine | null>(
        null
    );
    const [elapsedTime, setElapsedTime] = useState(0);
    const [draggedSet, setDraggedSet] = useState<ActiveRoutineSet | null>(null);
    const [isTouchDragging, setIsTouchDragging] = useState<boolean>(false);
    const draggedSetRef = useRef<ActiveRoutineSet | null>(null);
    const [longPressTimer, setLongPressTimer] = useState<number | null>(null);
    const [longPressActive, setLongPressActive] =
        useState<ActiveRoutineSet | null>(null);
    const [weightInputs, setWeightInputs] = useState<Record<number, string>>(
        {}
    );

    const fetchActiveRoutine = useApiCall(activeRoutineService.getActive, {
        errorMessage: ERROR_MESSAGES.ACTIVE_ROUTINE.FETCH,
        onSuccess: (data) => {
            if (!data || data.id !== Number(activeId)) {
                showToast("error", "Rutina activa no encontrada");
                navigate(`/rutinas/${routineId}`);
                return;
            }
            setActiveRoutine(data);
        },
        onError: () => navigate(`/rutinas/${routineId}`),
    });

    const updateSet = useApiCall(activeRoutineService.updateSet, {
        errorMessage: ERROR_MESSAGES.ACTIVE_ROUTINE.UPDATE,
        onSuccess: (updatedSet) => {
            if (!activeRoutine) return;
            setActiveRoutine({
                ...activeRoutine,
                sets: activeRoutine.sets.map((s) =>
                    s.id === updatedSet.id ? { ...s, ...updatedSet } : s
                ),
            });
            if (updatedSet.isPR) {
                showToast("success", "¡Nuevo PR! 🏆");
            }
        },
    });

    const uncompleteSet = useApiCall(activeRoutineService.uncompleteSet, {
        errorMessage: "Error al desmarcar la serie",
        onSuccess: (updatedSet) => {
            if (!activeRoutine) return;
            setActiveRoutine({
                ...activeRoutine,
                sets: activeRoutine.sets.map((s) =>
                    s.id === updatedSet.id ? { ...s, ...updatedSet } : s
                ),
            });
        },
    });

    const reorderSets = useApiCall(activeRoutineService.reorderSets, {
        successMessage: "Orden actualizado",
        errorMessage: "Error al actualizar orden",
    });

    const addSet = useApiCall(activeRoutineService.addSet, {
        successMessage: "Serie agregada",
        errorMessage: "Error al agregar serie",
        onSuccess: (newSet) => {
            if (!activeRoutine) return;
            setActiveRoutine({
                ...activeRoutine,
                sets: [...activeRoutine.sets, newSet],
            });
        },
    });

    const removeSet = useApiCall(activeRoutineService.removeSet, {
        successMessage: "Serie eliminada",
        errorMessage: "Error al eliminar serie",
    });

    const completeRoutine = useApiCall(activeRoutineService.complete, {
        successMessage: "¡Entrenamiento completado!",
        errorMessage: "Error al finalizar entrenamiento",
        onSuccess: () => navigate(`/rutinas/${routineId}`),
    });

    const cancelRoutine = useApiCall(activeRoutineService.cancel, {
        successMessage: "Rutina cancelada",
        errorMessage: "Error al cancelar rutina",
        onSuccess: () => navigate(`/rutinas/${routineId}`),
    });

    useEffect(() => {
        const token = authService.getToken();
        if (!token) return;

        fetchActiveRoutine.execute(token);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeId, routineId]);

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

        if (value === "" || /^\d*[,.]?\d*$/.test(value)) {
            setWeightInputs((prev) => ({ ...prev, [setId]: value }));

            const normalizedValue = value.replace(/,/g, ".");
            let weightInKg: number | null = null;

            if (normalizedValue !== "" && normalizedValue !== ".") {
                const inputValue = Number(normalizedValue);
                weightInKg = unit === "lbs" ? lbsToKg(inputValue) : inputValue;
            }

            setActiveRoutine({
                ...activeRoutine,
                sets: activeRoutine.sets.map((set) =>
                    set.id === setId
                        ? { ...set, actualWeight: weightInKg }
                        : set
                ),
            });
        }
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

        const token = authService.getToken();
        if (!token) return;

        if (set.completed) {
            await uncompleteSet.execute(setId, token);
        } else {
            await updateSet.execute(
                setId,
                set.actualWeight,
                set.actualReps,
                token
            );
        }
    };

    const handleDragStart = (_e: React.DragEvent, set: ActiveRoutineSet) => {
        setDraggedSet(set);
        draggedSetRef.current = set;
        document.body.style.overflow = "hidden";
    };

    const handleTouchStart = (e: React.TouchEvent, set: ActiveRoutineSet) => {
        const target = e.target as HTMLElement;
        if (!target.closest(".drag-handle")) return;

        e.stopPropagation();

        setLongPressActive(set);

        const timer = setTimeout(() => {
            setDraggedSet(set);
            draggedSetRef.current = set;
            setIsTouchDragging(true);
            setLongPressActive(null);
            document.body.style.overflow = "hidden";
        }, 400);

        setLongPressTimer(timer);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (longPressTimer && !isTouchDragging) {
            clearTimeout(longPressTimer);
            setLongPressTimer(null);
            setLongPressActive(null);
            return;
        }

        if (!isTouchDragging) return;
        e.preventDefault();
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
            draggedSetRef.current = null;
            document.body.style.overflow = "";
            return;
        }

        if (draggedSet.exerciseId !== targetSet.exerciseId) {
            setDraggedSet(null);
            draggedSetRef.current = null;
            document.body.style.overflow = "";
            return;
        }

        const token = authService.getToken();
        if (!token) {
            setDraggedSet(null);
            draggedSetRef.current = null;
            document.body.style.overflow = "";
            return;
        }

        const exerciseSets = activeRoutine.sets
            .filter((s) => s.exerciseId === draggedSet.exerciseId)
            .sort((a, b) => a.order - b.order);

        const draggedIndex = exerciseSets.findIndex(
            (s) => s.id === draggedSet.id
        );
        const targetIndex = exerciseSets.findIndex(
            (s) => s.id === targetSet.id
        );

        const reordered = [...exerciseSets];
        reordered.splice(draggedIndex, 1);
        reordered.splice(targetIndex, 0, draggedSet);

        const minOrder = exerciseSets[0].order;

        const reorderedWithUpdatedOrder = reordered.map((set, idx) => ({
            ...set,
            order: minOrder + idx,
        }));

        const setsToUpdate = reorderedWithUpdatedOrder.map((s) => ({
            id: s.id,
            order: s.order,
        }));

        const updatedSets = activeRoutine.sets.map((set) => {
            const updated = reorderedWithUpdatedOrder.find(
                (rs) => rs.id === set.id
            );
            return updated || set;
        });

        setActiveRoutine({
            ...activeRoutine,
            sets: updatedSets,
        });

        await reorderSets.execute(setsToUpdate, token);

        setDraggedSet(null);
        draggedSetRef.current = null;
        document.body.style.overflow = "";
    };

    const handleTouchEnd = async (e: React.TouchEvent) => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            setLongPressTimer(null);
            setLongPressActive(null);
        }

        if (!isTouchDragging || !draggedSetRef.current) {
            setIsTouchDragging(false);
            setDraggedSet(null);
            draggedSetRef.current = null;
            document.body.style.overflow = "";
            return;
        }

        e.stopPropagation();

        const touch = e.changedTouches[0];
        const elementBelow = document.elementFromPoint(
            touch.clientX,
            touch.clientY
        );

        const setCard = elementBelow?.closest(".set-card");

        if (!setCard) {
            setIsTouchDragging(false);
            setDraggedSet(null);
            draggedSetRef.current = null;
            document.body.style.overflow = "";
            return;
        }

        const targetId = parseInt(setCard.getAttribute("data-set-id") || "0");
        const currentDraggedSet = draggedSetRef.current;

        if (!activeRoutine) {
            setIsTouchDragging(false);
            setDraggedSet(null);
            draggedSetRef.current = null;
            document.body.style.overflow = "";
            return;
        }

        const target = activeRoutine.sets.find((s) => s.id === targetId);

        if (!target || currentDraggedSet.id === target.id) {
            setIsTouchDragging(false);
            setDraggedSet(null);
            draggedSetRef.current = null;
            document.body.style.overflow = "";
            return;
        }

        if (currentDraggedSet.exerciseId !== target.exerciseId) {
            setIsTouchDragging(false);
            setDraggedSet(null);
            draggedSetRef.current = null;
            document.body.style.overflow = "";
            return;
        }

        const token = authService.getToken();
        if (!token) {
            setIsTouchDragging(false);
            setDraggedSet(null);
            draggedSetRef.current = null;
            document.body.style.overflow = "";
            return;
        }

        const exerciseSets = activeRoutine.sets
            .filter((s) => s.exerciseId === currentDraggedSet.exerciseId)
            .sort((a, b) => a.order - b.order);

        const draggedIndex = exerciseSets.findIndex(
            (s) => s.id === currentDraggedSet.id
        );
        const targetIndex = exerciseSets.findIndex((s) => s.id === target.id);

        const reordered = [...exerciseSets];
        reordered.splice(draggedIndex, 1);
        reordered.splice(targetIndex, 0, currentDraggedSet);

        const minOrder = exerciseSets[0].order;

        const reorderedWithUpdatedOrder = reordered.map((set, idx) => ({
            ...set,
            order: minOrder + idx,
        }));

        const setsToUpdate = reorderedWithUpdatedOrder.map((s) => ({
            id: s.id,
            order: s.order,
        }));

        const updatedSets = activeRoutine.sets.map((set) => {
            const updated = reorderedWithUpdatedOrder.find(
                (rs) => rs.id === set.id
            );
            return updated || set;
        });

        setActiveRoutine({
            ...activeRoutine,
            sets: updatedSets,
        });

        await reorderSets.execute(setsToUpdate, token);

        setIsTouchDragging(false);
        setDraggedSet(null);
        draggedSetRef.current = null;
        document.body.style.overflow = "";
    };

    const handleAddSet = async (exerciseId: number) => {
        if (!activeRoutine) return;

        const token = authService.getToken();
        if (!token) return;

        await addSet.execute(exerciseId, token);
    };

    const handleRemoveSet = async (setId: number, exerciseId: number) => {
        if (!activeRoutine) return;

        const exerciseSets = activeRoutine.sets.filter(
            (s) => s.exerciseId === exerciseId
        );

        if (exerciseSets.length <= 1) {
            showToast("error", "No puedes eliminar la única serie");
            return;
        }

        const token = authService.getToken();
        if (!token) return;

        const result = await removeSet.execute(setId, token);
        if (result !== undefined) {
            const updatedSets = activeRoutine.sets.filter(
                (s) => s.id !== setId
            );

            setActiveRoutine({
                ...activeRoutine,
                sets: updatedSets,
            });
        }
    };

    const handleCompleteWorkout = async () => {
        if (!activeRoutine) return;

        const completedSets = activeRoutine.sets.filter((s) => s.completed);
        if (completedSets.length === 0) {
            showToast(
                "error",
                "Debes completar al menos 1 serie para finalizar"
            );
            return;
        }

        const incompleteSets = activeRoutine.sets.filter((s) => !s.completed);
        if (incompleteSets.length > 0) {
            completeModal.openModal();
            return;
        }

        await confirmCompleteWorkout();
    };

    const confirmCompleteWorkout = async () => {
        if (!activeRoutine) return;

        const token = authService.getToken();
        if (!token) return;

        await completeRoutine.execute(activeRoutine.id, token);
    };

    if (!activeRoutine) {
        return (
            <MainLayout>
                <div className="loading">{LOADING_MESSAGES.GENERIC}</div>
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
                                    minOrder: set.order,
                                };
                            }
                            acc[exerciseId].sets.push(set);
                            acc[exerciseId].minOrder = Math.min(
                                acc[exerciseId].minOrder,
                                set.order
                            );
                            return acc;
                        }, {} as Record<number, { exercise: (typeof activeRoutine.sets)[0]["exercise"]; sets: typeof activeRoutine.sets; minOrder: number }>)
                    )
                        .sort(([, a], [, b]) => a.minOrder - b.minOrder)
                        .map(([exerciseId, { exercise, sets }]) => (
                            <div key={exerciseId} className="exercise-group">
                                <div className="exercise-group-header">
                                    {exercise.videoPath && (
                                        <div className="exercise-thumbnail">
                                            <VideoThumbnail
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
                                            <span>
                                                {exercise.muscleGroup.name}
                                            </span>
                                            <span>•</span>
                                            <span>
                                                {exercise.equipment.name}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() =>
                                            handleAddSet(Number(exerciseId))
                                        }
                                        className="btn-add-set"
                                        title="Agregar serie"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                                <div className="sets-group">
                                    {sets
                                        .sort((a, b) => a.order - b.order)
                                        .map((set, index) => (
                                            <div
                                                key={set.id}
                                                data-set-id={set.id}
                                                className={`set-card ${
                                                    set.completed
                                                        ? "completed"
                                                        : ""
                                                } ${set.isPR ? "pr" : ""} ${
                                                    draggedSet?.id === set.id
                                                        ? "dragging"
                                                        : ""
                                                } ${
                                                    longPressActive?.id ===
                                                    set.id
                                                        ? "long-press-active"
                                                        : ""
                                                }`}
                                                draggable
                                                onDragStart={(e) =>
                                                    handleDragStart(e, set)
                                                }
                                                onDragOver={handleDragOver}
                                                onDrop={(e) =>
                                                    handleDrop(e, set)
                                                }
                                                onTouchStart={(e) =>
                                                    handleTouchStart(e, set)
                                                }
                                                onTouchMove={handleTouchMove}
                                                onTouchEnd={handleTouchEnd}
                                            >
                                                <GripVertical
                                                    size={16}
                                                    className="drag-handle"
                                                />
                                                <div className="set-content">
                                                    <span className="set-number">
                                                        {index + 1}
                                                    </span>
                                                    <div className="input-wrapper">
                                                        <label className="input-label">
                                                            {unit.toUpperCase()}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="set-input"
                                                            value={
                                                                weightInputs[
                                                                    set.id
                                                                ] !== undefined
                                                                    ? weightInputs[
                                                                          set.id
                                                                      ]
                                                                    : set.actualWeight !==
                                                                      null
                                                                    ? formatWeight(
                                                                          unit ===
                                                                              "lbs"
                                                                              ? kgToLbs(
                                                                                    set.actualWeight
                                                                                )
                                                                              : set.actualWeight
                                                                      ).toString()
                                                                    : ""
                                                            }
                                                            onChange={(e) =>
                                                                handleWeightChange(
                                                                    set.id,
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            onBlur={() => {
                                                                if (
                                                                    weightInputs[
                                                                        set.id
                                                                    ] !==
                                                                        undefined &&
                                                                    set.actualWeight !==
                                                                        null
                                                                ) {
                                                                    const formatted =
                                                                        formatWeight(
                                                                            unit ===
                                                                                "lbs"
                                                                                ? kgToLbs(
                                                                                      set.actualWeight
                                                                                  )
                                                                                : set.actualWeight
                                                                        ).toString();
                                                                    setWeightInputs(
                                                                        (
                                                                            prev
                                                                        ) => ({
                                                                            ...prev,
                                                                            [set.id]:
                                                                                formatted,
                                                                        })
                                                                    );
                                                                }
                                                            }}
                                                            disabled={
                                                                set.completed
                                                            }
                                                            placeholder={
                                                                set.targetWeight
                                                                    ? formatWeight(
                                                                          unit ===
                                                                              "lbs"
                                                                              ? kgToLbs(
                                                                                    set.targetWeight
                                                                                )
                                                                              : set.targetWeight
                                                                      ).toString()
                                                                    : "0"
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
                                                            value={
                                                                set.actualReps ??
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleRepsChange(
                                                                    set.id,
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            disabled={
                                                                set.completed
                                                            }
                                                            placeholder={set.targetRepsMax.toString()}
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() =>
                                                            handleCompleteSet(
                                                                set.id
                                                            )
                                                        }
                                                        className="btn-complete-set"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveSet(
                                                                set.id,
                                                                set.exerciseId
                                                            )
                                                        }
                                                        className="btn-remove-set"
                                                        title="Eliminar serie"
                                                    >
                                                        <Trash2 size={16} />
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
                        const token = authService.getToken();
                        if (!token || !activeRoutine) return;

                        await cancelRoutine.execute(activeRoutine.id, token);
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
