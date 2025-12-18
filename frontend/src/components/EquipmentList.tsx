import React from "react";
import { Card, CardList } from "./ui/Card";
import type { Equipment } from "../services/equipmentService";

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
    return (
        <CardList
            isEmpty={equipment.length === 0}
            emptyMessage="No hay equipamiento registrado"
        >
            {equipment.map((item) => (
                <Card
                    key={item.id}
                    item={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    loading={loading}
                />
            ))}
        </CardList>
    );
};
