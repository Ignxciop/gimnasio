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
import { useToast } from "../hooks/useToast";

export const MuscleGroupSection: React.FC = () => {
    const { showToast } = useToast();

    const muscleGroupsFetch = useFetch<MuscleGroup[]>({
        fetchFn: muscleGroupService.getAll,
    });

    const muscleGroupModal = useModal<MuscleGroup>();

    const muscleGroupDelete = useDelete({
        deleteFn: muscleGroupService.delete,
        onSuccess: () => {
            muscleGroupsFetch.execute();
            showToast("success", "Grupo muscular eliminado correctamente");
        },
        onError: (error: unknown) => {
            const message =
                (error as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message ||
                "Error al eliminar el grupo muscular";
            showToast("error", message);
        },
        confirmTitle: "Eliminar Grupo Muscular",
        confirmMessage: "¿Estás seguro de eliminar este grupo muscular?",
    });

    useEffect(() => {
        muscleGroupsFetch.execute();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async (name: string) => {
        const token = authService.getToken();
        if (!token) return;

        try {
            if (muscleGroupModal.editingItem) {
                await muscleGroupService.update(
                    muscleGroupModal.editingItem.id,
                    name,
                    token
                );
                showToast(
                    "success",
                    "Grupo muscular actualizado correctamente"
                );
            } else {
                await muscleGroupService.create(name, token);
                showToast("success", "Grupo muscular creado correctamente");
            }
            await muscleGroupsFetch.execute();
        } catch (error: unknown) {
            const message =
                (error as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message ||
                "Error al guardar el grupo muscular";
            showToast("error", message);
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
