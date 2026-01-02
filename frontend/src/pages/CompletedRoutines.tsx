import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    Clock,
    Calendar,
    Trash2,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { useToast } from "../hooks/useToast";
import { authService } from "../services/authService";
import { profileService } from "../services/profileService";
import { activeRoutineService } from "../services/activeRoutineService";
import { getVideoUrl, getApiEndpoint } from "../config/constants";
import { LOADING_MESSAGES, ERROR_MESSAGES } from "../config/messages";
import type { DayWorkout } from "../services/dashboardService";
import "../styles/workoutDay.css";

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    return date.toLocaleDateString("es-ES", options);
};

const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);

    if (hrs > 0) {
        return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
};

export default function CompletedRoutines() {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [workouts, setWorkouts] = useState<DayWorkout[]>([]);
    const [expandedWorkouts, setExpandedWorkouts] = useState<Set<number>>(
        new Set()
    );
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [workoutToDelete, setWorkoutToDelete] = useState<{
        id: number;
        userId: string;
    } | null>(null);

    useEffect(() => {
        const fetchRoutines = async () => {
            if (!username) {
                navigate("/inicio");
                return;
            }

            try {
                const token = authService.getToken();
                const profile = await profileService.getProfileByUsername(
                    username,
                    token
                );

                const loggedUserId = authService.getUserIdFromToken();
                setCurrentUserId(loggedUserId);

                const headers: HeadersInit = {};
                if (token) {
                    headers.Authorization = `Bearer ${token}`;
                }

                const response = await fetch(
                    getApiEndpoint(
                        `/statistics/all-completed-routines?userId=${profile.id}`
                    ),
                    {
                        headers,
                    }
                );

                if (!response.ok) {
                    if (response.status === 403) {
                        throw new Error(ERROR_MESSAGES.PROFILE.PRIVATE);
                    }
                    throw new Error(ERROR_MESSAGES.ROUTINES.FETCH);
                }

                const data = await response.json();
                setWorkouts(data.data);
            } catch (error) {
                if (
                    error instanceof Error &&
                    error.message === ERROR_MESSAGES.PROFILE.PRIVATE
                ) {
                    showToast("error", ERROR_MESSAGES.PROFILE.PRIVATE);
                    navigate("/inicio");
                } else {
                    showToast(
                        "error",
                        error instanceof Error
                            ? error.message
                            : ERROR_MESSAGES.ROUTINES.FETCH
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRoutines();
    }, [username, navigate, showToast]);

    const toggleWorkout = (workoutId: number) => {
        setExpandedWorkouts((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(workoutId)) {
                newSet.delete(workoutId);
            } else {
                newSet.add(workoutId);
            }
            return newSet;
        });
    };

    const handleDeleteWorkout = async (
        workoutId: number,
        workoutUserId: string
    ) => {
        if (!currentUserId || workoutUserId !== currentUserId) {
            showToast("error", "No tienes permisos para eliminar esta rutina");
            return;
        }

        setWorkoutToDelete({ id: workoutId, userId: workoutUserId });
    };

    const confirmDelete = async () => {
        if (!workoutToDelete) return;

        try {
            setDeletingId(workoutToDelete.id);
            const token = authService.getToken();
            if (!token) return;

            await activeRoutineService.deleteCompleted(
                workoutToDelete.id,
                token
            );
            setWorkouts((prev) =>
                prev.filter((w) => w.id !== workoutToDelete.id)
            );
            showToast("success", "Rutina eliminada exitosamente");
        } catch (error) {
            showToast(
                "error",
                error instanceof Error
                    ? error.message
                    : "Error al eliminar rutina"
            );
        } finally {
            setDeletingId(null);
            setWorkoutToDelete(null);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="loading">{LOADING_MESSAGES.GENERIC}</div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="workout-day-container">
                <button
                    onClick={() => navigate(`/perfil/${username}/estadisticas`)}
                    className="btn-back"
                >
                    <ArrowLeft size={20} />
                    Volver a Estadísticas
                </button>

                <div className="workout-day-header">
                    <h1 className="workout-day-title">Rutinas Realizadas</h1>
                    <p className="workout-day-count">
                        {workouts.length}{" "}
                        {workouts.length === 1
                            ? "entrenamiento"
                            : "entrenamientos"}{" "}
                        completados
                    </p>
                </div>

                <div className="workout-day-list">
                    {workouts.map((workout) => {
                        const isExpanded = expandedWorkouts.has(workout.id);
                        const exerciseGroups = workout.sets.reduce(
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
                                return acc;
                            },
                            {} as Record<
                                number,
                                {
                                    exercise: (typeof workout.sets)[0]["exercise"];
                                    sets: typeof workout.sets;
                                    minOrder: number;
                                }
                            >
                        );

                        return (
                            <div key={workout.id} className="workout-day-card">
                                <div className="workout-day-card-header">
                                    <div
                                        className="workout-info"
                                        onClick={() =>
                                            toggleWorkout(workout.id)
                                        }
                                        style={{ flex: 1, cursor: "pointer" }}
                                    >
                                        <h3 className="workout-name">
                                            {workout.routineName}
                                        </h3>
                                        <div className="workout-meta">
                                            <Calendar size={14} />
                                            <span>
                                                {formatDate(
                                                    workout.endTime || ""
                                                )}
                                            </span>
                                            <Clock size={14} />
                                            <span>
                                                {formatDuration(
                                                    workout.duration
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {currentUserId === workout.userId && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteWorkout(
                                                    workout.id,
                                                    workout.userId
                                                );
                                            }}
                                            className="btn-delete-workout"
                                            disabled={deletingId === workout.id}
                                            title="Eliminar rutina"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() =>
                                            toggleWorkout(workout.id)
                                        }
                                        className="workout-toggle-btn"
                                    >
                                        {isExpanded ? (
                                            <ChevronUp size={20} />
                                        ) : (
                                            <ChevronDown size={20} />
                                        )}
                                    </button>
                                </div>

                                {isExpanded && (
                                    <div className="workout-day-card-content">
                                        {Object.entries(exerciseGroups)
                                            .sort(
                                                ([, a], [, b]) =>
                                                    a.minOrder - b.minOrder
                                            )
                                            .map(
                                                ([
                                                    exerciseId,
                                                    { exercise, sets },
                                                ]) => (
                                                    <div
                                                        key={exerciseId}
                                                        className="exercise-section"
                                                    >
                                                        <div className="exercise-header">
                                                            {exercise.videoPath && (
                                                                <div className="exercise-thumbnail">
                                                                    <video
                                                                        src={
                                                                            getVideoUrl(
                                                                                exercise.videoPath
                                                                            ) ||
                                                                            ""
                                                                        }
                                                                        className="exercise-thumbnail-video"
                                                                    />
                                                                </div>
                                                            )}
                                                            <div className="exercise-details">
                                                                <h4 className="exercise-name">
                                                                    {
                                                                        exercise.name
                                                                    }
                                                                </h4>
                                                                <div className="exercise-tags">
                                                                    <span>
                                                                        {
                                                                            exercise
                                                                                .muscleGroup
                                                                                .name
                                                                        }
                                                                    </span>
                                                                    <span>
                                                                        •
                                                                    </span>
                                                                    <span>
                                                                        {
                                                                            exercise
                                                                                .equipment
                                                                                .name
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="sets-list">
                                                            {sets.map((set) => (
                                                                <div
                                                                    key={set.id}
                                                                    className={`set-item ${
                                                                        set.isPR
                                                                            ? "set-item--pr"
                                                                            : set.completed
                                                                            ? "set-item--completed"
                                                                            : "set-item--not-completed"
                                                                    }`}
                                                                >
                                                                    <span className="set-number">
                                                                        Serie{" "}
                                                                        {
                                                                            set.setNumber
                                                                        }
                                                                    </span>
                                                                    <div className="set-data">
                                                                        <span>
                                                                            {set.actualWeight ||
                                                                                0}{" "}
                                                                            kg
                                                                        </span>
                                                                        <span>
                                                                            ×
                                                                        </span>
                                                                        <span>
                                                                            {set.actualReps ||
                                                                                0}{" "}
                                                                            reps
                                                                        </span>
                                                                    </div>
                                                                    {set.isPR && (
                                                                        <span className="pr-badge">
                                                                            PR
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <ConfirmDialog
                    isOpen={workoutToDelete !== null}
                    onClose={() => setWorkoutToDelete(null)}
                    onConfirm={confirmDelete}
                    title="Eliminar rutina completada"
                    message="¿Estás seguro de eliminar esta rutina completada? Esta acción no se puede deshacer."
                    confirmText="Eliminar"
                    variant="danger"
                />
            </div>
        </MainLayout>
    );
}
