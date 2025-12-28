import React, { useEffect } from "react";
import { ExerciseList } from "./ExerciseList";
import { ExerciseModal } from "./ExerciseModal";
import { ConfirmDialog } from "./ui/ConfirmDialog";
import { exerciseService, type Exercise } from "../services/exerciseService";
import { equipmentService, type Equipment } from "../services/equipmentService";
import {
    muscleGroupService,
    type MuscleGroup,
} from "../services/muscleGroupService";
import { authService } from "../services/authService";
import { useModal } from "../hooks/useModal";
import { useDelete } from "../hooks/useDelete";
import { useFetch } from "../hooks/useFetch";
import { useApiCall } from "../hooks/useApiCall";
import { ERROR_MESSAGES, SUCCESS_MESSAGES, UI_TEXTS } from "../config/messages";

export const ExerciseSection: React.FC = () => {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    return (
        <>
            <div className="gestion__section">
                <div className="gestion__section-header">
                    <h2 className="gestion__section-title">Ejercicios</h2>
                    <button
                        className="gestion__add-button"
                        onClick={exerciseModal.openModal}
                    >
                        Agregar Ejercicio
                    </button>
                </div>
                <div className="gestion__section-content">
                    {exercisesFetch.loading ? (
                        <div className="gestion__placeholder">
                            <p>Cargando ejercicios...</p>
                        </div>
                    ) : (
                        <ExerciseList
                            exercises={exercisesFetch.data || []}
                            onEdit={exerciseModal.openEditModal}
                            onDelete={exerciseDelete.deleteItem}
                            loading={exerciseDelete.deletingId}
                        />
                    )}
                </div>
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
