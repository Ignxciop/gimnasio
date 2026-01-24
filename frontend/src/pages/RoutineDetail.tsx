import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Play } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { useFetch } from "../hooks/useFetch";
import { useModal } from "../hooks/useModal";
import { useApiCall } from "../hooks/useApiCall";
import { useUnit } from "../hooks/useUnit";
import { routineService } from "../services/routineService";
import { routineExerciseService } from "../services/routineExerciseService";
import { activeRoutineService } from "../services/activeRoutineService";
import { authService } from "../services/authService";
import { formatWeight, kgToLbs } from "../utils/unitConverter";
import {
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    LOADING_MESSAGES,
} from "../config/messages";
import "../styles/routineDetail.css";
import "../styles/exerciseCard.css";
import type { Routine } from "../types/routine";
import type {
    RoutineExercise,
    RoutineExerciseFormData,
} from "../types/routineExercise";
import AddExerciseModal from "../components/AddExerciseModal";
import EditRoutineExerciseModal from "../components/EditRoutineExerciseModal";
import ExerciseCard from "../components/routines/ExerciseCard";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";

export default function RoutineDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { unit } = useUnit();
    const [routine, setRoutine] = useState<Routine | null>(null);
    const [activeRoutineId, setActiveRoutineId] = useState<number | null>(null);
    const [draggedExercise, setDraggedExercise] =
        useState<RoutineExercise | null>(null);
    const [isTouchDragging, setIsTouchDragging] = useState<boolean>(false);
    const [longPressTimer, setLongPressTimer] = useState<number | null>(null);
    const [longPressTarget, setLongPressTarget] = useState<{
        id: number;
    } | null>(null);

    const addExerciseModal = useModal();
    const editExerciseModal = useModal<RoutineExercise>();
    const deleteExerciseModal = useModal<number>();

    const exercisesFetch = useFetch<RoutineExercise[]>({
        fetchFn: (token: string) =>
            routineExerciseService.getAllByRoutine(Number(id), token),
    });

    const fetchRoutineAndActive = useApiCall(
        async (token: string) => {
            const data = await routineService.getById(Number(id), token);
            const active = await activeRoutineService.getActive(token);
            return { routine: data, active };
        },
        {
            errorMessage: "No se pudo cargar la rutina",
            onSuccess: ({ routine, active }) => {
                setRoutine(routine);
                if (active && active.routineId === Number(id)) {
                    setActiveRoutineId(active.id);
                }
            },
            onError: () => navigate("/rutinas"),
        },
    );

    const addExercise = useApiCall(routineExerciseService.create, {
        successMessage: SUCCESS_MESSAGES.ROUTINES.EXERCISE_ADDED,
        errorMessage: ERROR_MESSAGES.ROUTINES.ADD_EXERCISE,
        onSuccess: () => {
            exercisesFetch.execute();
            addExerciseModal.closeModal();
        },
    });

    const updateExercise = useApiCall(routineExerciseService.update, {
        successMessage: SUCCESS_MESSAGES.ROUTINES.EXERCISE_UPDATED,
        errorMessage: ERROR_MESSAGES.ROUTINES.UPDATE_EXERCISE,
        onSuccess: () => {
            exercisesFetch.execute();
            editExerciseModal.closeModal();
        },
    });

    const deleteExercise = useApiCall(routineExerciseService.delete, {
        successMessage: SUCCESS_MESSAGES.ROUTINES.EXERCISE_DELETED,
        errorMessage: ERROR_MESSAGES.ROUTINES.DELETE_EXERCISE,
        onSuccess: () => exercisesFetch.execute(),
    });

    const reorderExercises = useApiCall(routineExerciseService.reorder, {
        successMessage: SUCCESS_MESSAGES.ROUTINES.ORDER_UPDATED,
        errorMessage: ERROR_MESSAGES.ROUTINES.UPDATE_ORDER,
        onSuccess: () => exercisesFetch.execute(),
    });

    const startWorkout = useApiCall(activeRoutineService.create, {
        successMessage: SUCCESS_MESSAGES.ROUTINES.WORKOUT_STARTED,
        errorMessage: ERROR_MESSAGES.ROUTINES.START,
        onSuccess: (_result) => navigate(`/rutinas/${id}/activa/${_result.id}`),
    });

    useEffect(() => {
        const token = authService.getToken();
        if (!token) return;

        fetchRoutineAndActive.execute(token);
        exercisesFetch.execute();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleAddExercise = async (data: RoutineExerciseFormData) => {
        const token = authService.getToken();
        if (!token) return;

        await addExercise.execute(Number(id), data, token);
    };

    const handleEditExercise = async (
        data: Omit<RoutineExerciseFormData, "exerciseId"> & {
            exerciseId?: number;
        },
    ) => {
        const token = authService.getToken();
        if (!token || !editExerciseModal.editingItem) return;

        await updateExercise.execute(
            editExerciseModal.editingItem.id,
            data,
            token,
        );
    };

    const handleDeleteExercise = async (exerciseId: number) => {
        deleteExerciseModal.openEditModal(exerciseId);
    };

    const handleConfirmDeleteExercise = async () => {
        const exerciseId = deleteExerciseModal.editingItem;
        if (!exerciseId) return;

        const token = authService.getToken();
        if (!token) return;

        await deleteExercise.execute(exerciseId, token);
        deleteExerciseModal.closeModal();
    };

    const handleExerciseMouseDown = (
        e: React.MouseEvent,
        exercise: RoutineExercise,
    ) => {
        const target = e.target as HTMLElement;
        if (!target.closest(".drag-icon")) {
            return;
        }
        if (longPressTimer) {
            return;
        }
        const timer = window.setTimeout(() => {
            setLongPressTarget({ id: exercise.id });
        }, 500);
        setLongPressTimer(timer);
    };

    const handleExerciseMouseUp = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            setLongPressTimer(null);
        }
        if (!draggedExercise) {
            setLongPressTarget(null);
        }
    };

    const handleDragStart = (e: React.DragEvent, exercise: RoutineExercise) => {
        // En desktop (mouse), drag instantáneo; en mobile, solo si longpress
        const isTouch = e.nativeEvent instanceof TouchEvent;
        if (!isTouch) {
            setDraggedExercise(exercise);
            if (e.dataTransfer) {
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", exercise.id.toString());
            }
        } else if (longPressTarget?.id === exercise.id) {
            setDraggedExercise(exercise);
            if (e.dataTransfer) {
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", exercise.id.toString());
            }
        }
    };

    const handleDragEnd = () => {
        setDraggedExercise(null);
        setLongPressTarget(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleTouchStart = (
        e: React.TouchEvent,
        exercise: RoutineExercise,
    ) => {
        const target = e.target as HTMLElement;
        if (!target.closest(".drag-icon")) {
            return;
        }
        if (longPressTimer) {
            return;
        }
        const timer = window.setTimeout(() => {
            setLongPressTarget({ id: exercise.id });
            setDraggedExercise(exercise);
            setIsTouchDragging(true);
        }, 500);
        setLongPressTimer(timer);
    };

    const handleTouchMove = (_e: React.TouchEvent) => {
        if (!isTouchDragging || !draggedExercise) return;
    };

    const handleTouchEnd = async (e: React.TouchEvent) => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            setLongPressTimer(null);
        }

        if (!isTouchDragging || !draggedExercise) {
            setIsTouchDragging(false);
            setDraggedExercise(null);
            setLongPressTarget(null);
            return;
        }

        const touch = e.changedTouches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);

        const exerciseCard = element?.closest(".exercise-card");
        if (exerciseCard) {
            const targetId = parseInt(
                exerciseCard.getAttribute("data-exercise-id") || "0",
            );
            const exercises = exercisesFetch.data || [];
            const targetExercise = exercises.find((ex) => ex.id === targetId);

            if (targetExercise && targetExercise.id !== draggedExercise.id) {
                const token = authService.getToken();
                if (token) {
                    const draggedIndex = exercises.findIndex(
                        (ex) => ex.id === draggedExercise.id,
                    );
                    const targetIndex = exercises.findIndex(
                        (ex) => ex.id === targetExercise.id,
                    );

                    const reordered = [...exercises];
                    reordered.splice(draggedIndex, 1);
                    reordered.splice(targetIndex, 0, draggedExercise);

                    const updatedExercises = reordered.map(
                        (exercise, index) => ({
                            id: exercise.id,
                            order: index,
                        }),
                    );

                    await reorderExercises.execute(updatedExercises, token);
                }
            }
        }

        setIsTouchDragging(false);
        setDraggedExercise(null);
        setLongPressTarget(null);
    };

    const handleDrop = async (
        e: React.DragEvent,
        targetExercise: RoutineExercise,
    ) => {
        e.preventDefault();

        if (!draggedExercise || draggedExercise.id === targetExercise.id) {
            setDraggedExercise(null);
            return;
        }

        const token = authService.getToken();
        if (!token) {
            setDraggedExercise(null);
            return;
        }

        const exercises = exercisesFetch.data || [];
        const draggedIndex = exercises.findIndex(
            (ex) => ex.id === draggedExercise.id,
        );
        const targetIndex = exercises.findIndex(
            (ex) => ex.id === targetExercise.id,
        );

        const reordered = [...exercises];
        reordered.splice(draggedIndex, 1);
        reordered.splice(targetIndex, 0, draggedExercise);

        const updatedExercises = reordered.map((exercise, index) => ({
            id: exercise.id,
            order: index,
        }));

        await reorderExercises.execute(updatedExercises, token);
        setDraggedExercise(null);
    };

    const handleStartWorkout = async () => {
        const token = authService.getToken();
        if (!token || !id) return;

        if (activeRoutineId) {
            navigate(`/rutinas/${id}/activa/${activeRoutineId}`);
            return;
        }

        await startWorkout.execute(Number(id), token);
    };

    if (!routine) {
        return (
            <MainLayout>
                <div className="loading">{LOADING_MESSAGES.GENERIC}</div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="routine-detail-container">
                {activeRoutineId && (
                    <div className="active-routine-warning">
                        <div className="warning-content">
                            <span className="warning-icon">⚠️</span>
                            <div className="warning-text">
                                <strong>Rutina activa en progreso</strong>
                                <p>
                                    Finaliza o cancela tu rutina activa para
                                    poder editar esta rutina.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="routine-detail-header">
                    <div className="header-buttons-row">
                        <button
                            onClick={() => navigate("/rutinas")}
                            className="btn-back"
                        >
                            <ArrowLeft size={20} />
                            Volver
                        </button>
                        <button
                            onClick={() => addExerciseModal.openModal()}
                            className={`btn-add-exercise ${activeRoutineId ? "disabled" : ""}`}
                            disabled={!!activeRoutineId}
                            title={
                                activeRoutineId
                                    ? "Finaliza o cancela la rutina activa para poder agregar ejercicios"
                                    : "Agregar ejercicio"
                            }
                        >
                            <Plus size={20} />
                            Agregar Ejercicio
                        </button>
                    </div>
                    <div className="routine-title-section">
                        <h1>{routine.name}</h1>
                        {routine.description && (
                            <p className="routine-description">
                                {routine.description}
                            </p>
                        )}
                    </div>
                </div>

                <div className="exercises-list">
                    {exercisesFetch.loading ? (
                        <div className="loading">Cargando ejercicios...</div>
                    ) : exercisesFetch.data &&
                      exercisesFetch.data.length > 0 ? (
                        exercisesFetch.data.map((routineExercise) => {
                            const weightDisplay = routineExercise.weight
                                ? `${formatWeight(
                                      unit === "lbs"
                                          ? kgToLbs(routineExercise.weight)
                                          : routineExercise.weight,
                                  )} ${unit}`
                                : undefined;

                            return (
                                <ExerciseCard
                                    key={routineExercise.id}
                                    exercise={routineExercise}
                                    isDragging={
                                        draggedExercise?.id ===
                                        routineExercise.id
                                    }
                                    isLongPressActive={
                                        longPressTarget?.id ===
                                        routineExercise.id
                                    }
                                    weightDisplay={weightDisplay}
                                    isEditingDisabled={!!activeRoutineId}
                                    onEdit={() =>
                                        editExerciseModal.openEditModal(
                                            routineExercise,
                                        )
                                    }
                                    onDelete={() =>
                                        handleDeleteExercise(routineExercise.id)
                                    }
                                    onDragStart={(e) =>
                                        handleDragStart(e, routineExercise)
                                    }
                                    onDragEnd={handleDragEnd}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) =>
                                        handleDrop(e, routineExercise)
                                    }
                                    onMouseDown={(e) =>
                                        handleExerciseMouseDown(
                                            e,
                                            routineExercise,
                                        )
                                    }
                                    onMouseUp={handleExerciseMouseUp}
                                    onTouchStart={(e) =>
                                        handleTouchStart(e, routineExercise)
                                    }
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                />
                            );
                        })
                    ) : (
                        <div className="empty-state">
                            <p>No hay ejercicios en esta rutina</p>
                            <p>Comienza agregando ejercicios</p>
                        </div>
                    )}
                </div>
            </div>

            {exercisesFetch.data && exercisesFetch.data.length > 0 && (
                <button
                    onClick={handleStartWorkout}
                    className="btn-start-workout"
                    title={
                        activeRoutineId
                            ? "Continuar entrenamiento"
                            : "Iniciar entrenamiento"
                    }
                >
                    <Play size={24} fill="currentColor" />
                </button>
            )}

            <AddExerciseModal
                isOpen={addExerciseModal.isOpen}
                onClose={addExerciseModal.closeModal}
                onSubmit={handleAddExercise}
            />

            <EditRoutineExerciseModal
                isOpen={editExerciseModal.isOpen}
                onClose={editExerciseModal.closeModal}
                onSubmit={handleEditExercise}
                routineExercise={editExerciseModal.editingItem}
            />

            <ConfirmDialog
                isOpen={deleteExerciseModal.isOpen}
                onClose={deleteExerciseModal.closeModal}
                onConfirm={handleConfirmDeleteExercise}
                title="Eliminar ejercicio"
                message="¿Estás seguro de que quieres eliminar este ejercicio de la rutina?"
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="danger"
            />
        </MainLayout>
    );
}
