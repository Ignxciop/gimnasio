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
import { useToast } from "../hooks/useToast";

export const ExerciseSection: React.FC = () => {
    const { showToast } = useToast();

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
        onSuccess: () => {
            exercisesFetch.execute();
            showToast("success", "Ejercicio eliminado correctamente");
        },
        onError: (error: any) => {
            const message =
                error?.response?.data?.message ||
                "Error al eliminar el ejercicio";
            showToast("error", message);
        },
        confirmTitle: "Eliminar Ejercicio",
        confirmMessage: "¿Estás seguro de eliminar este ejercicio?",
    });

    useEffect(() => {
        exercisesFetch.execute();
        equipmentFetch.execute();
        muscleGroupsFetch.execute();
    }, []);

    const handleSubmit = async (
        name: string,
        equipmentId: number,
        muscleGroupId: number,
        secondaryMuscleGroupIds: number[],
        videoFile?: File | null
    ) => {
        const token = authService.getToken();
        if (!token) return;

        try {
            if (exerciseModal.editingItem) {
                await exerciseService.update(
                    exerciseModal.editingItem.id,
                    name,
                    equipmentId,
                    muscleGroupId,
                    secondaryMuscleGroupIds,
                    token,
                    videoFile
                );
                showToast("success", "Ejercicio actualizado correctamente");
            } else {
                await exerciseService.create(
                    name,
                    equipmentId,
                    muscleGroupId,
                    secondaryMuscleGroupIds,
                    token,
                    videoFile
                );
                showToast("success", "Ejercicio creado correctamente");
            }
            await exercisesFetch.execute();
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                "Error al guardar el ejercicio";
            showToast("error", message);
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
