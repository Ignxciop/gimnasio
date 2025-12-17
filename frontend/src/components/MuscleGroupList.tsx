import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import type { MuscleGroup } from "../services/muscleGroupService";
import "./muscleGroupList.css";

interface MuscleGroupListProps {
    muscleGroups: MuscleGroup[];
    onEdit: (muscleGroup: MuscleGroup) => void;
    onDelete: (id: number) => void;
    loading: number | null;
}

export const MuscleGroupList: React.FC<MuscleGroupListProps> = ({
    muscleGroups,
    onEdit,
    onDelete,
    loading,
}) => {
    if (muscleGroups.length === 0) {
        return (
            <div className="muscle-group-list__empty">
                <p>No hay grupos musculares registrados</p>
            </div>
        );
    }

    return (
        <div className="muscle-group-list">
            <div className="muscle-group-list__grid">
                {muscleGroups.map((item) => (
                    <div key={item.id} className="muscle-group-card">
                        <div className="muscle-group-card__content">
                            <h3 className="muscle-group-card__name">
                                {item.name}
                            </h3>
                            <div className="muscle-group-card__actions">
                                <button
                                    onClick={() => onEdit(item)}
                                    disabled={loading === item.id}
                                    className="muscle-group-card__button muscle-group-card__button--edit"
                                    title="Editar"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => onDelete(item.id)}
                                    disabled={loading === item.id}
                                    className="muscle-group-card__button muscle-group-card__button--delete"
                                    title="Eliminar"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
