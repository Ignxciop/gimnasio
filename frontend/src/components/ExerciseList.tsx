import React from "react";
import { Dumbbell, Users, Target } from "lucide-react";
import { Card, CardList } from "./ui/Card";
import type { Exercise } from "../services/exerciseService";

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
    return (
        <CardList
            isEmpty={exercises.length === 0}
            emptyMessage="No hay ejercicios registrados"
        >
            {exercises.map((item) => (
                <Card
                    key={item.id}
                    item={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    loading={loading}
                >
                    <div className="card__detail">
                        <Dumbbell size={16} />
                        <span>{item.equipment.name}</span>
                    </div>
                    <div className="card__detail">
                        <Users size={16} />
                        <span>
                            <strong>Principal:</strong> {item.muscleGroup.name}
                        </span>
                    </div>
                    {item.secondaryMuscleGroups &&
                        item.secondaryMuscleGroups.length > 0 && (
                            <div className="card__detail">
                                <Target size={16} />
                                <span>
                                    <strong>Secundarios:</strong>{" "}
                                    {item.secondaryMuscleGroups
                                        .map((smg) => smg.muscleGroup.name)
                                        .join(", ")}
                                </span>
                            </div>
                        )}
                </Card>
            ))}
        </CardList>
    );
};
