import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Plus,
    GripVertical,
    Trash2,
    Edit,
    Play,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { useFetch } from "../hooks/useFetch";
import { useModal } from "../hooks/useModal";
import { useApiCall } from "../hooks/useApiCall";
import { useUnit } from "../hooks/useUnit";
import { VideoThumbnail } from "../components/ui/VideoThumbnail";
import { routineService } from "../services/routineService";
import { routineExerciseService } from "../services/routineExerciseService";
import { activeRoutineService } from "../services/activeRoutineService";
import { authService } from "../services/authService";
import { getVideoUrl } from "../config/constants";
import { kgToLbs, formatWeight } from "../utils/unitConverter";
import {
    LOADING_MESSAGES,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
} from "../config/messages";
import "../styles/routineDetail.css";
import type { Routine } from "../types/routine";
import type {
    RoutineExercise,
    RoutineExerciseFormData,
} from "../types/routineExercise";
import AddExerciseModal from "../components/AddExerciseModal";
import EditRoutineExerciseModal from "../components/EditRoutineExerciseModal";

export default function RoutineDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { unit } = useUnit();
    const [routine, setRoutine] = useState<Routine | null>(null);
    const [activeRoutineId, setActiveRoutineId] = useState<number | null>(null);
    const [draggedExercise, setDraggedExercise] =
        useState<RoutineExercise | null>(null);
    const [isTouchDragging, setIsTouchDragging] = useState<boolean>(false);

    const addExerciseModal = useModal();
    const editExerciseModal = useModal<RoutineExercise>();

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
        }
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
        data: Omit<RoutineExerciseFormData, "exerciseId">
    ) => {
        const token = authService.getToken();
        if (!token || !editExerciseModal.editingItem) return;

        await updateExercise.execute(
            editExerciseModal.editingItem.id,
            data,
            token
        );
    };

    const handleDeleteExercise = async (exerciseId: number) => {
        if (!confirm("¿Estás seguro de eliminar este ejercicio?")) return;

        const token = authService.getToken();
        if (!token) return;

        await deleteExercise.execute(exerciseId, token);
    };

    const handleDragStart = (exercise: RoutineExercise) => {
        setDraggedExercise(exercise);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleTouchStart = (
        e: React.TouchEvent,
        exercise: RoutineExercise
    ) => {
        e.stopPropagation();
        setDraggedExercise(exercise);
        setIsTouchDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isTouchDragging) return;
        e.preventDefault();
    };

    const handleTouchEnd = async (e: React.TouchEvent) => {
        if (!isTouchDragging || !draggedExercise) {
            setIsTouchDragging(false);
            setDraggedExercise(null);
            return;
        }

        e.stopPropagation();

        const touch = e.changedTouches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);

        const exerciseCard = element?.closest(".exercise-card");
        if (!exerciseCard) {
            setIsTouchDragging(false);
            setDraggedExercise(null);
            return;
        }

        const targetId = parseInt(
            exerciseCard.getAttribute("data-exercise-id") || "0"
        );
        const exercises = exercisesFetch.data || [];
        const targetExercise = exercises.find((ex) => ex.id === targetId);

        if (!targetExercise || targetExercise.id === draggedExercise.id) {
            setIsTouchDragging(false);
            setDraggedExercise(null);
            return;
        }

        const token = authService.getToken();
        if (token) {
            const draggedIndex = exercises.findIndex(
                (ex) => ex.id === draggedExercise.id
            );
            const targetIndex = exercises.findIndex(
                (ex) => ex.id === targetExercise.id
            );

            const reordered = [...exercises];
            reordered.splice(draggedIndex, 1);
            reordered.splice(targetIndex, 0, draggedExercise);

            const updatedExercises = reordered.map((exercise, index) => ({
                id: exercise.id,
                order: index,
            }));

            await reorderExercises.execute(updatedExercises, token);
        }

        setIsTouchDragging(false);
        setDraggedExercise(null);
    };

    const handleDrop = async (
        e: React.DragEvent,
        targetExercise: RoutineExercise
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
            (ex) => ex.id === draggedExercise.id
        );
        const targetIndex = exercises.findIndex(
            (ex) => ex.id === targetExercise.id
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
                <div className="routine-detail-header">
                    <button
                        onClick={() => navigate("/rutinas")}
                        className="btn-back"
                    >
                        <ArrowLeft size={20} />
                        Volver
                    </button>
                    <div className="routine-info">
                        <h1>{routine.name}</h1>
                        {routine.description && (
                            <p className="routine-description">
                                {routine.description}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => addExerciseModal.openModal()}
                        className="btn-add-exercise"
                    >
                        <Plus size={20} />
                        Agregar Ejercicio
                    </button>
                </div>

                <div className="exercises-list">
                    {exercisesFetch.loading ? (
                        <div className="loading">Cargando ejercicios...</div>
                    ) : exercisesFetch.data &&
                      exercisesFetch.data.length > 0 ? (
                        exercisesFetch.data.map((routineExercise) => (
                            <div
                                key={routineExercise.id}
                                data-exercise-id={routineExercise.id}
                                className="exercise-card"
                                draggable
                                onDragStart={() =>
                                    handleDragStart(routineExercise)
                                }
                                onTouchStart={(e) =>
                                    handleTouchStart(e, routineExercise)
                                }
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, routineExercise)}
                            >
                                <div className="exercise-card-content">
                                    <GripVertical
                                        size={20}
                                        className="drag-handle"
                                    />
                                    {routineExercise.exercise?.videoPath && (
                                        <div className="exercise-thumbnail">
                                            <VideoThumbnail
                                                src={
                                                    getVideoUrl(
                                                        routineExercise.exercise
                                                            .videoPath
                                                    ) || ""
                                                }
                                                className="exercise-thumbnail-video"
                                            />
                                        </div>
                                    )}
                                    <div className="exercise-info">
                                        <h3>
                                            {routineExercise.exercise?.name}
                                        </h3>
                                        <div className="exercise-details">
                                            <span className="detail-badge">
                                                {routineExercise.sets} series
                                            </span>
                                            <span className="detail-badge">
                                                {routineExercise.repsMin ===
                                                routineExercise.repsMax
                                                    ? `${routineExercise.repsMin} reps`
                                                    : `${routineExercise.repsMin}-${routineExercise.repsMax} reps`}
                                            </span>
                                            {routineExercise.weight && (
                                                <span className="detail-badge">
                                                    {formatWeight(
                                                        unit === "lbs"
                                                            ? kgToLbs(
                                                                  routineExercise.weight
                                                              )
                                                            : routineExercise.weight
                                                    )}{" "}
                                                    {unit}
                                                </span>
                                            )}
                                            <span className="detail-badge">
                                                {routineExercise.restTime}s
                                                descanso
                                            </span>
                                        </div>
                                        <div className="exercise-meta">
                                            <span>
                                                {
                                                    routineExercise.exercise
                                                        ?.muscleGroup?.name
                                                }
                                            </span>
                                            <span>•</span>
                                            <span>
                                                {
                                                    routineExercise.exercise
                                                        ?.equipment?.name
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="exercise-actions">
                                    <button
                                        onClick={() =>
                                            editExerciseModal.openEditModal(
                                                routineExercise
                                            )
                                        }
                                        className="btn-edit"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDeleteExercise(
                                                routineExercise.id
                                            )
                                        }
                                        className="btn-delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
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
        </MainLayout>
    );
}
