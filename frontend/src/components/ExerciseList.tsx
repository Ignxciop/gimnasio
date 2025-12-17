import React from "react";
import { Edit2, Trash2, Dumbbell, Users } from "lucide-react";
import type { Exercise } from "../services/exerciseService";
import "./exerciseList.css";

interface ExerciseListProps {
    exercises: Exercise[];
    onEdit: (exercise: Exercise) => void;
    onDelete: (id: number) => void;
    loading: number | null;
}

export const ExerciseList: React.FC<ExerciseListProps> = ({
    exercises,
    onEdit,
    onDelete,
    loading,
}) => {
    if (exercises.length === 0) {
        return (
            <div className="exercise-list__empty">
                <p>No hay ejercicios registrados</p>
            </div>
        );
    }

    return (
        <div className="exercise-list">
            <div className="exercise-list__grid">
                {exercises.map((item) => (
                    <div key={item.id} className="exercise-card">
                        <div className="exercise-card__header">
                            <h3 className="exercise-card__name">{item.name}</h3>
                            <div className="exercise-card__actions">
                                <button
                                    onClick={() => onEdit(item)}
                                    disabled={loading === item.id}
                                    className="exercise-card__button exercise-card__button--edit"
                                    title="Editar"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => onDelete(item.id)}
                                    disabled={loading === item.id}
                                    className="exercise-card__button exercise-card__button--delete"
                                    title="Eliminar"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="exercise-card__details">
                            <div className="exercise-card__detail">
                                <Dumbbell size={16} />
                                <span>{item.equipment.name}</span>
                            </div>
                            <div className="exercise-card__detail">
                                <Users size={16} />
                                <span>{item.muscleGroup.name}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
