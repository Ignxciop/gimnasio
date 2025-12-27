import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp, Clock } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { useToast } from "../hooks/useToast";
import { authService } from "../services/authService";
import { dashboardService } from "../services/dashboardService";
import type { DayWorkout } from "../services/dashboardService";
import "../styles/workoutDay.css";

const getVideoUrl = (videoPath: string | null) => {
    if (!videoPath) return null;
    return `http://localhost:3000/resources/examples_exercises/${videoPath}`;
};

const formatDate = (year: number, month: number, day: number): string => {
    const date = new Date(year, month - 1, day);
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

export default function WorkoutDay() {
    const { year, month, day } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [workouts, setWorkouts] = useState<DayWorkout[]>([]);
    const [expandedWorkouts, setExpandedWorkouts] = useState<Set<number>>(
        new Set()
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const token = authService.getToken();
                if (!token || !year || !month || !day) return;

                const data = await dashboardService.getWorkoutsByDate(
                    parseInt(year),
                    parseInt(month),
                    parseInt(day),
                    token
                );

                setWorkouts(data);
            } catch (error) {
                showToast(
                    "error",
                    error instanceof Error
                        ? error.message
                        : "Error al cargar entrenamientos"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchWorkouts();
    }, [year, month, day, showToast]);

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

    if (loading) {
        return (
            <MainLayout>
                <div className="loading">Cargando...</div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="workout-day-container">
                <button onClick={() => navigate("/")} className="btn-back">
                    <ArrowLeft size={20} />
                    Volver al Dashboard
                </button>

                <div className="workout-day-header">
                    <h1 className="workout-day-title">
                        {formatDate(
                            parseInt(year || "0"),
                            parseInt(month || "0"),
                            parseInt(day || "0")
                        )}
                    </h1>
                    <p className="workout-day-count">
                        {workouts.length}{" "}
                        {workouts.length === 1
                            ? "entrenamiento"
                            : "entrenamientos"}
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
                                <div
                                    className="workout-day-card-header"
                                    onClick={() => toggleWorkout(workout.id)}
                                >
                                    <div className="workout-info">
                                        <h3 className="workout-name">
                                            {workout.routineName}
                                        </h3>
                                        <div className="workout-meta">
                                            <Clock size={14} />
                                            <span>
                                                {formatDuration(
                                                    workout.duration
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="workout-toggle-btn">
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
            </div>
        </MainLayout>
    );
}
