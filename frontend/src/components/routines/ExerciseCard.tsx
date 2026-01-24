import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { ActionMenu } from "../ui/ActionMenu";
import { VideoThumbnail } from "../ui/VideoThumbnail";
import { getVideoUrl } from "../../config/constants";
import type { RoutineExercise } from "../../types/routineExercise";

interface ExerciseCardProps {
    exercise: RoutineExercise;
    isDragging: boolean;
    isLongPressActive: boolean;
    weightDisplay?: string;
    isEditingDisabled?: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onDragStart: (e: React.DragEvent) => void;
    onDragEnd: () => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseUp: () => void;
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
}

export function ExerciseCard({
    exercise,
    isDragging,
    isLongPressActive,
    weightDisplay,
    isEditingDisabled = false,
    onEdit,
    onDelete,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop,
    onMouseDown,
    onMouseUp,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
}: ExerciseCardProps) {
    const getRepsDisplay = () => {
        if (exercise.repsMin === exercise.repsMax) {
            return `${exercise.repsMin} reps`;
        }
        return `${exercise.repsMin}-${exercise.repsMax} reps`;
    };

    const isLifted = isDragging || isLongPressActive;
    return (
        <div
            data-exercise-id={exercise.id}
            className={`exercise-card${isLifted ? " lifted" : ""}`}
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <div className="exercise-card-main">
                {exercise.exercise?.videoPath && (
                    <div className="exercise-card-thumbnail-wrapper">
                        <div className="exercise-card-drag">
                            <GripVertical size={20} className="drag-icon" />
                        </div>
                        <div className="exercise-card-thumbnail">
                            <VideoThumbnail
                                src={
                                    getVideoUrl(exercise.exercise.videoPath) ||
                                    ""
                                }
                                className="exercise-thumbnail-img"
                            />
                        </div>
                    </div>
                )}
                <div className="exercise-card-info">
                    <div className="exercise-card-info-header">
                        <h3
                            className="exercise-card-name"
                            title={exercise.exercise?.name}
                        >
                            {exercise.exercise?.name}
                        </h3>
                        <div className="exercise-card-actions">
                            <ActionMenu menuId={`exercise-${exercise.id}`}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!isEditingDisabled) {
                                            onEdit();
                                        }
                                    }}
                                    className={
                                        isEditingDisabled ? "disabled" : ""
                                    }
                                    disabled={isEditingDisabled}
                                    aria-label={
                                        isEditingDisabled
                                            ? "No se puede editar mientras hay una rutina activa"
                                            : "Editar ejercicio"
                                    }
                                    title={
                                        isEditingDisabled
                                            ? "Finaliza o cancela la rutina activa para poder editar"
                                            : "Editar ejercicio"
                                    }
                                >
                                    <Pencil size={16} /> Editar
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!isEditingDisabled) {
                                            onDelete();
                                        }
                                    }}
                                    className={`danger ${isEditingDisabled ? "disabled" : ""}`}
                                    disabled={isEditingDisabled}
                                    aria-label={
                                        isEditingDisabled
                                            ? "No se puede eliminar mientras hay una rutina activa"
                                            : "Eliminar ejercicio"
                                    }
                                    title={
                                        isEditingDisabled
                                            ? "Finaliza o cancela la rutina activa para poder eliminar"
                                            : "Eliminar ejercicio"
                                    }
                                >
                                    <Trash2 size={16} /> Eliminar
                                </button>
                            </ActionMenu>
                        </div>
                    </div>
                    <div className="exercise-card-stats">
                        <div className="stat-item">
                            <span className="stat-value">{exercise.sets}</span>
                            <span className="stat-label">series</span>
                        </div>
                        <div className="stat-separator">×</div>
                        <div className="stat-item">
                            <span className="stat-value">
                                {getRepsDisplay()}
                            </span>
                        </div>
                        {weightDisplay && (
                            <>
                                <div className="stat-separator">@</div>
                                <div className="stat-item">
                                    <span className="stat-value">
                                        {weightDisplay}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="exercise-card-meta">
                        <span className="meta-badge rest-badge">
                            {exercise.restTime}s descanso
                        </span>
                        <span
                            className="meta-badge muscle-badge"
                            title={exercise.exercise?.muscleGroup?.name}
                        >
                            {exercise.exercise?.muscleGroup?.name}
                        </span>
                        <span
                            className="meta-badge equipment-badge"
                            title={exercise.exercise?.equipment?.name}
                        >
                            {exercise.exercise?.equipment?.name}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExerciseCard;
