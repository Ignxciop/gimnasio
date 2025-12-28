import React, { useEffect } from "react";
import { MuscleGroupList } from "./MuscleGroupList";
import { MuscleGroupModal } from "./MuscleGroupModal";
import { ConfirmDialog } from "./ui/ConfirmDialog";
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

export const MuscleGroupSection: React.FC = () => {
    const muscleGroupsFetch = useFetch<MuscleGroup[]>({
        fetchFn: muscleGroupService.getAll,
    });

    const muscleGroupModal = useModal<MuscleGroup>();

    const muscleGroupDelete = useDelete({
        deleteFn: muscleGroupService.delete,
        onSuccess: () => muscleGroupsFetch.execute(),
        onError: () => {},
        confirmTitle: "Eliminar Grupo Muscular",
        confirmMessage: UI_TEXTS.DELETE_MUSCLE_GROUP_CONFIRM,
        successMessage: SUCCESS_MESSAGES.MUSCLE_GROUPS.DELETED,
        errorMessage: ERROR_MESSAGES.MUSCLE_GROUPS.DELETE,
    });

    useEffect(() => {
        muscleGroupsFetch.execute();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const createMuscleGroup = useApiCall(
        (name: string, token: string) => muscleGroupService.create(name, token),
        {
            successMessage: SUCCESS_MESSAGES.MUSCLE_GROUPS.CREATED,
            errorMessage: ERROR_MESSAGES.MUSCLE_GROUPS.CREATE,
            onSuccess: () => {
                muscleGroupsFetch.execute();
                muscleGroupModal.closeModal();
            },
        }
    );

    const updateMuscleGroup = useApiCall(
        (id: number, name: string, token: string) =>
            muscleGroupService.update(id, name, token),
        {
            successMessage: SUCCESS_MESSAGES.MUSCLE_GROUPS.UPDATED,
            errorMessage: ERROR_MESSAGES.MUSCLE_GROUPS.UPDATE,
            onSuccess: () => {
                muscleGroupsFetch.execute();
                muscleGroupModal.closeModal();
            },
        }
    );

    const handleSubmit = async (name: string) => {
        const token = authService.getToken();
        if (!token) return;

        if (muscleGroupModal.editingItem) {
            await updateMuscleGroup.execute(
                muscleGroupModal.editingItem.id,
                name,
                token
            );
        } else {
            await createMuscleGroup.execute(name, token);
        }
    };

    return (
        <>
            <div className="gestion__section">
                <div className="gestion__section-header">
                    <h2 className="gestion__section-title">
                        Grupos Musculares
                    </h2>
                    <button
                        className="gestion__add-button"
                        onClick={muscleGroupModal.openModal}
                    >
                        Agregar Grupo Muscular
                    </button>
                </div>
                <div className="gestion__section-content">
                    {muscleGroupsFetch.loading ? (
                        <div className="gestion__placeholder">
                            <p>Cargando grupos musculares...</p>
                        </div>
                    ) : (
                        <MuscleGroupList
                            muscleGroups={muscleGroupsFetch.data || []}
                            onEdit={muscleGroupModal.openEditModal}
                            onDelete={muscleGroupDelete.deleteItem}
                            loading={muscleGroupDelete.deletingId}
                        />
                    )}
                </div>
            </div>

            <MuscleGroupModal
                isOpen={muscleGroupModal.isOpen}
                onClose={muscleGroupModal.closeModal}
                onSubmit={handleSubmit}
                muscleGroup={muscleGroupModal.editingItem}
                title={
                    muscleGroupModal.editingItem
                        ? "Editar Grupo Muscular"
                        : "Agregar Grupo Muscular"
                }
            />

            <ConfirmDialog
                isOpen={muscleGroupDelete.showConfirm}
                onClose={muscleGroupDelete.cancelDelete}
                onConfirm={muscleGroupDelete.confirmDelete}
                title={muscleGroupDelete.confirmTitle}
                message={muscleGroupDelete.confirmMessage}
                variant="danger"
            />
        </>
    );
};
