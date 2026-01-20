import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, X, Plus, Clock } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { useToast } from "../hooks/useToast";
import { useModal } from "../hooks/useModal";
import { useApiCall } from "../hooks/useApiCall";
import { useUnit } from "../hooks/useUnit";
import { useGlobalRestTimer } from "../hooks/useGlobalRestTimer";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { VideoThumbnail } from "../components/ui/VideoThumbnail";
import ActiveSetRow from "../components/routines/ActiveSetRow";
import { activeRoutineService } from "../services/activeRoutineService";
import { authService } from "../services/authService";
import { getVideoUrl } from "../config/constants";
import { formatTime } from "../utils/dateHelpers";
import { formatWeight, kgToLbs, lbsToKg } from "../utils/unitConverter";
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
    restTime: number;
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
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
    const [setToRemove, setSetToRemove] = useState<{
        setId: number;
        exerciseId: number;
    } | null>(null);

    const [activeRoutine, setActiveRoutine] = useState<ActiveRoutine | null>(
        null,
    );
    const [elapsedTime, setElapsedTime] = useState(0);
    const [draggedSet, setDraggedSet] = useState<ActiveRoutineSet | null>(null);
    const [isTouchDragging, setIsTouchDragging] = useState<boolean>(false);
    const draggedSetRef = useRef<ActiveRoutineSet | null>(null);
    const [longPressTimer, setLongPressTimer] = useState<number | null>(null);
    const [longPressActive, setLongPressActive] =
        useState<ActiveRoutineSet | null>(null);
    const [weightInputs, setWeightInputs] = useState<Record<number, string>>(
        {},
    );
    const {
        restTimer,
        startRestTimer,
        stopRestTimer,
        adjustRestTime: adjustGlobalRestTime,
    } = useGlobalRestTimer();
    const [restTimes, setRestTimes] = useState<Record<number, number>>({});
    const [previousActiveRoutine, setPreviousActiveRoutine] =
        useState<ActiveRoutine | null>(null);

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
                    s.id === updatedSet.id ? { ...s, ...updatedSet } : s,
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
                    s.id === updatedSet.id ? { ...s, ...updatedSet } : s,
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
        onSuccess: () => {
            // El estado ya se actualizó optimísticamente en handleRemoveSet
            setPreviousActiveRoutine(null);
        },
        onError: () => {
            // Si hay error, revertir el cambio optimístico
            if (previousActiveRoutine) {
                setActiveRoutine(previousActiveRoutine);
            }
            setPreviousActiveRoutine(null);
        },
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

    useEffect(() => {
        if (!activeRoutine) return;
        const exerciseGroups = Object.entries(
            activeRoutine.sets.reduce(
                (acc, set) => {
                    const key = set.exerciseId;
                    if (!acc[key]) acc[key] = [];
                    acc[key].push(set);
                    return acc;
                },
                {} as Record<number, ActiveRoutineSet[]>,
            ),
        );

        const initialRestTimes: Record<number, number> = {};
        exerciseGroups.forEach(([exerciseId, sets]) => {
            if (sets.length > 0) {
                // Usar el restTime del primer set de cada ejercicio
                initialRestTimes[Number(exerciseId)] = sets[0].restTime;
            }
        });
        setRestTimes((prev) => ({ ...initialRestTimes, ...prev }));
    }, [activeRoutine]);

    // Listen for rest timer finished event from Service Worker
    useEffect(() => {
        const handleRestTimerFinished = (event: CustomEvent) => {
            const { routineId } = event.detail;
            if (Number(routineId) === Number(activeId)) {
                showToast(
                    "success",
                    "¡Descanso terminado! Es hora de continuar.",
                );
                // The timer state will be automatically cleared by the context
            }
        };

        window.addEventListener(
            "restTimerFinished",
            handleRestTimerFinished as EventListener,
        );

        return () => {
            window.removeEventListener(
                "restTimerFinished",
                handleRestTimerFinished as EventListener,
            );
        };
    }, [activeId, showToast]);

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
                        : set,
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
                set.id === setId ? { ...set, actualReps: reps } : set,
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
                token,
            );
            const restTime = restTimes[set.exerciseId] || 60;
            startRestTimer(set.exerciseId, restTime, Number(routineId));
        }
    };

    const adjustRestTime = (delta: number) => {
        adjustGlobalRestTime(delta);
    };

    const handleRestTimeChange = (exerciseId: number, value: string) => {
        const time = value === "" ? 60 : Math.max(0, Number(value));
        setRestTimes((prev) => ({ ...prev, [exerciseId]: time }));
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
        targetSet: ActiveRoutineSet,
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
            (s) => s.id === draggedSet.id,
        );
        const targetIndex = exerciseSets.findIndex(
            (s) => s.id === targetSet.id,
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
                (rs) => rs.id === set.id,
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
            touch.clientY,
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
            (s) => s.id === currentDraggedSet.id,
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
                (rs) => rs.id === set.id,
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

    const handleRemoveSet = (setId: number, exerciseId: number) => {
        setSetToRemove({ setId, exerciseId });
        setIsRemoveModalOpen(true);
    };

    const confirmRemoveSet = async () => {
        if (!setToRemove || !activeRoutine) return;

        const { setId, exerciseId } = setToRemove;

        const exerciseSets = activeRoutine.sets.filter(
            (s) => s.exerciseId === exerciseId,
        );

        if (exerciseSets.length <= 1) {
            showToast("error", "No puedes eliminar la única serie");
            return;
        }

        // Guardar estado anterior para posible reversión
        setPreviousActiveRoutine(activeRoutine);

        // Actualizar estado optimísticamente
        const updatedSets = activeRoutine.sets.filter((s) => s.id !== setId);
        setActiveRoutine({
            ...activeRoutine,
            sets: updatedSets,
        });

        const token = authService.getToken();
        if (!token) return;
        await removeSet.execute(setId, token);

        // Limpiar estado
        setSetToRemove(null);
        setIsRemoveModalOpen(false);
    };

    const handleCompleteWorkout = async () => {
        if (!activeRoutine) return;

        const completedSets = activeRoutine.sets.filter((s) => s.completed);
        if (completedSets.length === 0) {
            showToast(
                "error",
                "Debes completar al menos 1 serie para finalizar",
            );
            return;
        }

        // Siempre mostrar modal de confirmación
        completeModal.openModal();
    };

    const confirmCompleteWorkout = async () => {
        if (!activeRoutine) return;

        const token = authService.getToken();
        if (!token) return;

        // Stop any active rest timer before completing the workout
        stopRestTimer();

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
                        activeRoutine.sets.reduce(
                            (acc, set) => {
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
                                    set.order,
                                );
                                return acc;
                            },
                            {} as Record<
                                number,
                                {
                                    exercise: (typeof activeRoutine.sets)[0]["exercise"];
                                    sets: typeof activeRoutine.sets;
                                    minOrder: number;
                                }
                            >,
                        ),
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
                                                        exercise.videoPath,
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
                                <div className="rest-time-section">
                                    <Clock
                                        size={16}
                                        className="rest-time-icon"
                                    />
                                    <span className="rest-time-label">
                                        Descanso:
                                    </span>
                                    <input
                                        type="number"
                                        value={
                                            restTimes[Number(exerciseId)] || 60
                                        }
                                        onChange={(e) =>
                                            handleRestTimeChange(
                                                Number(exerciseId),
                                                e.target.value,
                                            )
                                        }
                                        className="input-rest-time"
                                        min="0"
                                    />
                                    <span className="rest-label">s</span>
                                </div>
                                <div className="sets-list-container">
                                    {sets
                                        .sort((a, b) => a.order - b.order)
                                        .map((set, index) => (
                                            <ActiveSetRow
                                                key={set.id}
                                                set={set}
                                                index={index}
                                                unit={unit}
                                                weightInput={
                                                    weightInputs[set.id]
                                                }
                                                isDragging={
                                                    draggedSet?.id === set.id
                                                }
                                                isLongPressActive={
                                                    longPressActive?.id ===
                                                    set.id
                                                }
                                                onWeightChange={(value) =>
                                                    handleWeightChange(
                                                        set.id,
                                                        value,
                                                    )
                                                }
                                                onWeightBlur={() => {
                                                    if (
                                                        weightInputs[set.id] !==
                                                            undefined &&
                                                        set.actualWeight !==
                                                            null
                                                    ) {
                                                        const formatted =
                                                            formatWeight(
                                                                unit === "lbs"
                                                                    ? kgToLbs(
                                                                          set.actualWeight,
                                                                      )
                                                                    : set.actualWeight,
                                                            ).toString();
                                                        setWeightInputs(
                                                            (prev) => ({
                                                                ...prev,
                                                                [set.id]:
                                                                    formatted,
                                                            }),
                                                        );
                                                    }
                                                }}
                                                onRepsChange={(value) =>
                                                    handleRepsChange(
                                                        set.id,
                                                        value,
                                                    )
                                                }
                                                onComplete={() =>
                                                    handleCompleteSet(set.id)
                                                }
                                                onRemove={() =>
                                                    handleRemoveSet(
                                                        set.id,
                                                        set.exerciseId,
                                                    )
                                                }
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
                                            />
                                        ))}
                                </div>
                                {restTimer &&
                                    restTimer.exerciseId ===
                                        Number(exerciseId) && (
                                        <div className="rest-timer">
                                            <button
                                                onClick={() =>
                                                    adjustRestTime(-15)
                                                }
                                                className="btn-adjust-time"
                                            >
                                                -15
                                            </button>
                                            <div className="rest-timer-display">
                                                <div className="rest-timer-label">
                                                    Descanso
                                                </div>
                                                <div className="rest-timer-value">
                                                    {Math.floor(
                                                        restTimer.timeLeft / 60,
                                                    )}
                                                    :
                                                    {(restTimer.timeLeft % 60)
                                                        .toString()
                                                        .padStart(2, "0")}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    adjustRestTime(15)
                                                }
                                                className="btn-adjust-time"
                                            >
                                                +15
                                            </button>
                                        </div>
                                    )}
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

                        // Stop any active rest timer before canceling the routine
                        stopRestTimer();

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
                    message={
                        activeRoutine.sets.filter((s) => !s.completed)
                            .length === 0
                            ? "¡Felicitaciones! Has completado todas las series. ¿Deseas finalizar el entrenamiento?"
                            : `Tienes ${
                                  activeRoutine.sets.filter((s) => !s.completed)
                                      .length
                              } series sin completar. ¿Deseas finalizar igualmente?`
                    }
                    confirmText="Sí, finalizar"
                    cancelText="Cancelar"
                    variant="danger"
                />

                <ConfirmDialog
                    isOpen={isRemoveModalOpen}
                    onClose={() => {
                        setIsRemoveModalOpen(false);
                        setSetToRemove(null);
                    }}
                    onConfirm={confirmRemoveSet}
                    title="Eliminar serie"
                    message="¿Seguro que deseas eliminar esta serie? Esta acción no se puede deshacer."
                    confirmText="Sí, eliminar"
                    cancelText="Cancelar"
                    variant="danger"
                />
            </div>
        </MainLayout>
    );
}
