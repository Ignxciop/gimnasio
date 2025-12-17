import React, { useState } from "react";
import { X, Edit2, Trash2 } from "lucide-react";
import type { Equipment } from "../services/equipmentService";
import "./equipmentList.css";

interface EquipmentListProps {
    equipment: Equipment[];
    onEdit: (equipment: Equipment) => void;
    onDelete: (id: number) => void;
    loading: number | null;
}

export const EquipmentList: React.FC<EquipmentListProps> = ({
    equipment,
    onEdit,
    onDelete,
    loading,
}) => {
    if (equipment.length === 0) {
        return (
            <div className="equipment-list__empty">
                <p>No hay equipamiento registrado</p>
            </div>
        );
    }

    return (
        <div className="equipment-list">
            <div className="equipment-list__grid">
                {equipment.map((item) => (
                    <div key={item.id} className="equipment-card">
                        <div className="equipment-card__content">
                            <h3 className="equipment-card__name">
                                {item.name}
                            </h3>
                            <div className="equipment-card__actions">
                                <button
                                    onClick={() => onEdit(item)}
                                    disabled={loading === item.id}
                                    className="equipment-card__button equipment-card__button--edit"
                                    title="Editar"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => onDelete(item.id)}
                                    disabled={loading === item.id}
                                    className="equipment-card__button equipment-card__button--delete"
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
