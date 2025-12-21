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
import { useToast } from "../hooks/useToast";
import { routineService } from "../services/routineService";
import { routineExerciseService } from "../services/routineExerciseService";
import { activeRoutineService } from "../services/activeRoutineService";
import { authService } from "../services/authService";
import "../styles/routineDetail.css";
import type { Routine } from "../types/routine";
import type {
    RoutineExercise,
    RoutineExerciseFormData,
} from "../types/routineExercise";
import AddExerciseModal from "../components/AddExerciseModal";
import EditRoutineExerciseModal from "../components/EditRoutineExerciseModal";
import "../styles/routineDetail.css";

const getVideoUrl = (videoPath: string | null) => {
    if (!videoPath) return null;
    return `http://localhost:3000/resources/examples_exercises/${videoPath}`;
};

export default function RoutineDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [routine, setRoutine] = useState<Routine | null>(null);
    const [draggedExercise, setDraggedExercise] =
        useState<RoutineExercise | null>(null);

    const addExerciseModal = useModal();
    const editExerciseModal = useModal<RoutineExercise>();

    const exercisesFetch = useFetch<RoutineExercise[]>({
        fetchFn: (token: string) =>
            routineExerciseService.getAllByRoutine(Number(id), token),
    });

    useEffect(() => {
        const fetchRoutine = async () => {
            try {
                const token = authService.getToken();
                if (!token) return;

                const data = await routineService.getById(Number(id), token);
                setRoutine(data);
            } catch {
                showToast("error", "No se pudo cargar la rutina");
                navigate("/rutinas");
            }
        };

        fetchRoutine();
        exercisesFetch.execute();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, navigate, showToast]);

    const handleAddExercise = async (data: RoutineExerciseFormData) => {
        try {
            const token = authService.getToken();
            if (!token) return;

            await routineExerciseService.create(Number(id), data, token);
            showToast("success", "Ejercicio agregado exitosamente");
            exercisesFetch.execute();
            addExerciseModal.closeModal();
        } catch (error) {
            showToast(
                "error",
                error instanceof Error
                    ? error.message
                    : "Error al agregar ejercicio"
            );
        }
    };

    const handleEditExercise = async (
        data: Omit<RoutineExerciseFormData, "exerciseId">
    ) => {
        try {
            const token = authService.getToken();
            if (!token || !editExerciseModal.editingItem) return;

            await routineExerciseService.update(
                editExerciseModal.editingItem.id,
                data,
                token
            );
            showToast("success", "Ejercicio actualizado exitosamente");
            exercisesFetch.execute();
            editExerciseModal.closeModal();
        } catch (error) {
            showToast(
                "error",
                error instanceof Error
                    ? error.message
                    : "Error al actualizar ejercicio"
            );
        }
    };

    const handleDeleteExercise = async (exerciseId: number) => {
        if (!confirm("¿Estás seguro de eliminar este ejercicio?")) return;

        try {
            const token = authService.getToken();
            if (!token) return;

            await routineExerciseService.delete(exerciseId, token);
            showToast("success", "Ejercicio eliminado exitosamente");
            exercisesFetch.execute();
        } catch (error) {
            showToast(
                "error",
                error instanceof Error
                    ? error.message
                    : "Error al eliminar ejercicio"
            );
        }
    };

    const handleDragStart = (exercise: RoutineExercise) => {
        setDraggedExercise(exercise);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
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

        try {
            const token = authService.getToken();
            if (!token) return;

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

            await routineExerciseService.reorder(updatedExercises, token);
            exercisesFetch.execute();
            showToast("success", "Orden actualizado exitosamente");
        } catch {
            showToast("error", "Error al actualizar el orden");
        }

        setDraggedExercise(null);
    };

    const handleStartWorkout = async () => {
        try {
            const token = authService.getToken();
            if (!token || !id) return;

            const activeRoutine = await activeRoutineService.create(
                Number(id),
                token
            );
            showToast("success", "Entrenamiento iniciado");
            navigate(`/rutinas/${id}/activa/${activeRoutine.id}`);
        } catch (error) {
            showToast(
                "error",
                error instanceof Error
                    ? error.message
                    : "Error al iniciar entrenamiento"
            );
        }
    };

    if (!routine) {
        return (
            <MainLayout>
                <div className="loading">Cargando...</div>
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
                                className="exercise-card"
                                draggable
                                onDragStart={() =>
                                    handleDragStart(routineExercise)
                                }
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
                                            <video
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
                                                    {routineExercise.weight} kg
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
                    title="Iniciar entrenamiento"
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
