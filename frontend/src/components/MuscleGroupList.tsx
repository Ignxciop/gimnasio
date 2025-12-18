import React from "react";
import { Card, CardList } from "./ui/Card";
import type { MuscleGroup } from "../services/muscleGroupService";

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
    return (
        <CardList
            isEmpty={muscleGroups.length === 0}
            emptyMessage="No hay grupos musculares registrados"
        >
            {muscleGroups.map((item) => (
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
