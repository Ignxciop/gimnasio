import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { VideoThumbnail } from "../ui/VideoThumbnail";
import { getVideoUrl } from "../../config/constants";
import type { Exercise } from "../../services/exerciseService";

interface ExerciseTableProps {
    exercises: Exercise[];
    onEdit: (exercise: Exercise) => void;
    onDelete: (id: number) => void;
    loading: boolean;
    deletingId: number | null;
}

export const ExerciseTable: React.FC<ExerciseTableProps> = ({
    exercises,
    onEdit,
    onDelete,
    loading,
    deletingId,
}) => {
    if (loading) {
        return (
            <div className="gestion-table__empty">
                <p>Cargando ejercicios...</p>
            </div>
        );
    }

    if (exercises.length === 0) {
        return (
            <div className="gestion-table__empty">
                <p>No se encontraron ejercicios</p>
                <span>
                    Intenta ajustar los filtros o agrega un nuevo ejercicio
                </span>
            </div>
        );
    }

    return (
        <div className="gestion-table">
            <table className="gestion-table__table">
                <thead>
                    <tr>
                        <th className="gestion-table__th gestion-table__th--video">
                            Video
                        </th>
                        <th className="gestion-table__th gestion-table__th--name">
                            Nombre
                        </th>
                        <th className="gestion-table__th">Equipamiento</th>
                        <th className="gestion-table__th">Músculo Principal</th>
                        <th className="gestion-table__th gestion-table__th--secondary">
                            Músculos Secundarios
                        </th>
                        <th className="gestion-table__th gestion-table__th--actions">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {exercises.map((exercise) => (
                        <tr key={exercise.id} className="gestion-table__tr">
                            <td className="gestion-table__td gestion-table__td--video">
                                {exercise.videoPath ? (
                                    <VideoThumbnail
                                        src={
                                            getVideoUrl(exercise.videoPath) ||
                                            ""
                                        }
                                        className="gestion-table__video-thumbnail"
                                    />
                                ) : (
                                    <div className="gestion-table__no-video">
                                        Sin video
                                    </div>
                                )}
                            </td>
                            <td className="gestion-table__td gestion-table__td--name">
                                <span className="gestion-table__exercise-name">
                                    {exercise.name}
                                </span>
                            </td>
                            <td className="gestion-table__td">
                                {exercise.equipment.name}
                            </td>
                            <td className="gestion-table__td">
                                {exercise.muscleGroup.name}
                            </td>
                            <td className="gestion-table__td gestion-table__td--secondary">
                                {exercise.secondaryMuscleGroups &&
                                exercise.secondaryMuscleGroups.length > 0 ? (
                                    <div className="gestion-table__secondary-muscles">
                                        {exercise.secondaryMuscleGroups
                                            .map((smg) => smg.muscleGroup.name)
                                            .join(", ")}
                                    </div>
                                ) : (
                                    <span className="gestion-table__no-data">
                                        Ninguno
                                    </span>
                                )}
                            </td>
                            <td className="gestion-table__td gestion-table__td--actions">
                                <div className="gestion-table__actions">
                                    <button
                                        className="gestion-table__action-btn gestion-table__action-btn--edit"
                                        onClick={() => onEdit(exercise)}
                                        title="Editar"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        className="gestion-table__action-btn gestion-table__action-btn--delete"
                                        onClick={() => onDelete(exercise.id)}
                                        disabled={deletingId === exercise.id}
                                        title="Eliminar"
                                    >
                                        {deletingId === exercise.id ? (
                                            <span className="gestion-table__spinner" />
                                        ) : (
                                            <Trash2 size={16} />
                                        )}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
