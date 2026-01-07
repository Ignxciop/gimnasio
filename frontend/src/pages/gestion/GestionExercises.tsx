import React, { useState, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import { SearchInput } from "../../components/ui/SearchInput";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { ExerciseTable } from "../../components/gestion/ExerciseTable";
import { ExerciseModal } from "../../components/ExerciseModal";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { exerciseService, type Exercise } from "../../services/exerciseService";
import {
    equipmentService,
    type Equipment,
} from "../../services/equipmentService";
import {
    muscleGroupService,
    type MuscleGroup,
} from "../../services/muscleGroupService";
import { authService } from "../../services/authService";
import { useModal } from "../../hooks/useModal";
import { useDelete } from "../../hooks/useDelete";
import { useFetch } from "../../hooks/useFetch";
import { useApiCall } from "../../hooks/useApiCall";
import {
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    UI_TEXTS,
} from "../../config/messages";
import "../../styles/gestionExercises.css";

export const GestionExercises: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [equipmentFilter, setEquipmentFilter] = useState<number | "all">(
        "all"
    );
    const [muscleGroupFilter, setMuscleGroupFilter] = useState<number | "all">(
        "all"
    );

    const exercisesFetch = useFetch<Exercise[]>({
        fetchFn: exerciseService.getAll,
    });

    const equipmentFetch = useFetch<Equipment[]>({
        fetchFn: equipmentService.getAll,
    });

    const muscleGroupsFetch = useFetch<MuscleGroup[]>({
        fetchFn: muscleGroupService.getAll,
    });

    const exerciseModal = useModal<Exercise>();

    const exerciseDelete = useDelete({
        deleteFn: exerciseService.delete,
        onSuccess: () => exercisesFetch.execute(),
        onError: () => {},
        confirmTitle: "Eliminar Ejercicio",
        confirmMessage: UI_TEXTS.DELETE_EXERCISE_CONFIRM,
        successMessage: SUCCESS_MESSAGES.EXERCISES.DELETED,
        errorMessage: ERROR_MESSAGES.EXERCISES.DELETE,
    });

    useEffect(() => {
        exercisesFetch.execute();
        equipmentFetch.execute();
        muscleGroupsFetch.execute();
    }, []);

    const createExercise = useApiCall(
        (
            name: string,
            equipmentId: number,
            muscleGroupId: number,
            secondaryMuscleGroupIds: number[],
            token: string,
            videoFile?: File | null
        ) =>
            exerciseService.create(
                name,
                equipmentId,
                muscleGroupId,
                secondaryMuscleGroupIds,
                token,
                videoFile
            ),
        {
            successMessage: SUCCESS_MESSAGES.EXERCISES.CREATED,
            errorMessage: ERROR_MESSAGES.EXERCISES.SAVE,
            onSuccess: () => {
                exercisesFetch.execute();
                exerciseModal.closeModal();
            },
        }
    );

    const updateExercise = useApiCall(
        (
            id: number,
            name: string,
            equipmentId: number,
            muscleGroupId: number,
            secondaryMuscleGroupIds: number[],
            token: string,
            videoFile?: File | null
        ) =>
            exerciseService.update(
                id,
                name,
                equipmentId,
                muscleGroupId,
                secondaryMuscleGroupIds,
                token,
                videoFile
            ),
        {
            successMessage: SUCCESS_MESSAGES.EXERCISES.UPDATED,
            errorMessage: ERROR_MESSAGES.EXERCISES.SAVE,
            onSuccess: () => {
                exercisesFetch.execute();
                exerciseModal.closeModal();
            },
        }
    );

    const handleSubmit = async (
        name: string,
        equipmentId: number,
        muscleGroupId: number,
        secondaryMuscleGroupIds: number[],
        videoFile?: File | null
    ) => {
        const token = authService.getToken();
        if (!token) return;

        if (exerciseModal.editingItem) {
            await updateExercise.execute(
                exerciseModal.editingItem.id,
                name,
                equipmentId,
                muscleGroupId,
                secondaryMuscleGroupIds,
                token,
                videoFile
            );
        } else {
            await createExercise.execute(
                name,
                equipmentId,
                muscleGroupId,
                secondaryMuscleGroupIds,
                token,
                videoFile
            );
        }
    };

    const filteredExercises = useMemo(() => {
        const exercises = exercisesFetch.data || [];
        return exercises.filter((exercise) => {
            const matchesSearch =
                searchTerm === "" ||
                exercise.name.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesEquipment =
                equipmentFilter === "all" ||
                exercise.equipmentId === equipmentFilter;

            const matchesMuscleGroup =
                muscleGroupFilter === "all" ||
                exercise.muscleGroupId === muscleGroupFilter ||
                exercise.secondaryMuscleGroups?.some(
                    (smg) => smg.muscleGroupId === muscleGroupFilter
                );

            return matchesSearch && matchesEquipment && matchesMuscleGroup;
        });
    }, [exercisesFetch.data, searchTerm, equipmentFilter, muscleGroupFilter]);

    const equipmentOptions = [
        { value: "all", label: "Todos los equipamientos" },
        ...(equipmentFetch.data || []).map((eq) => ({
            value: eq.id,
            label: eq.name,
        })),
    ];

    const muscleGroupOptions = [
        { value: "all", label: "Todos los grupos musculares" },
        ...(muscleGroupsFetch.data || []).map((mg) => ({
            value: mg.id,
            label: mg.name,
        })),
    ];

    return (
        <>
            <div className="gestion-exercises">
                <div className="gestion-exercises__header">
                    <div className="gestion-exercises__header-left">
                        <h2 className="gestion-exercises__title">Ejercicios</h2>
                        <p className="gestion-exercises__subtitle">
                            {filteredExercises.length} ejercicio
                            {filteredExercises.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                    <Button variant="primary" onClick={exerciseModal.openModal}>
                        <Plus size={18} />
                        Agregar Ejercicio
                    </Button>
                </div>

                <div className="gestion-exercises__filters">
                    <SearchInput
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Buscar por nombre..."
                    />
                    <Select
                        value={equipmentFilter}
                        onChange={(value) =>
                            setEquipmentFilter(
                                value === "all" ? "all" : Number(value)
                            )
                        }
                        options={equipmentOptions}
                        placeholder="Filtrar por equipamiento"
                    />
                    <Select
                        value={muscleGroupFilter}
                        onChange={(value) =>
                            setMuscleGroupFilter(
                                value === "all" ? "all" : Number(value)
                            )
                        }
                        options={muscleGroupOptions}
                        placeholder="Filtrar por músculo"
                    />
                </div>

                <ExerciseTable
                    exercises={filteredExercises}
                    onEdit={exerciseModal.openEditModal}
                    onDelete={exerciseDelete.deleteItem}
                    loading={exercisesFetch.loading}
                    deletingId={exerciseDelete.deletingId}
                />
            </div>

            <ExerciseModal
                isOpen={exerciseModal.isOpen}
                onClose={exerciseModal.closeModal}
                onSubmit={handleSubmit}
                exercise={exerciseModal.editingItem}
                equipment={equipmentFetch.data || []}
                muscleGroups={muscleGroupsFetch.data || []}
                title={
                    exerciseModal.editingItem
                        ? "Editar Ejercicio"
                        : "Agregar Ejercicio"
                }
            />

            <ConfirmDialog
                isOpen={exerciseDelete.showConfirm}
                onClose={exerciseDelete.cancelDelete}
                onConfirm={exerciseDelete.confirmDelete}
                title={exerciseDelete.confirmTitle}
                message={exerciseDelete.confirmMessage}
                variant="danger"
            />
        </>
    );
};
