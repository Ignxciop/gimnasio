import React, { useState, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import { SearchInput } from "../../components/ui/SearchInput";
import { Button } from "../../components/ui/Button";
import { MuscleGroupList } from "../../components/MuscleGroupList";
import { MuscleGroupModal } from "../../components/MuscleGroupModal";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
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
import "../../styles/gestionCommon.css";

export const GestionMuscleGroups: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");

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

    const filteredMuscleGroups = useMemo(() => {
        const muscleGroups = muscleGroupsFetch.data || [];
        return muscleGroups.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [muscleGroupsFetch.data, searchTerm]);

    return (
        <>
            <div className="gestion-page">
                <div className="gestion-page__header">
                    <div className="gestion-page__header-left">
                        <h2 className="gestion-page__title">
                            Grupos Musculares
                        </h2>
                        <p className="gestion-page__subtitle">
                            {filteredMuscleGroups.length} grupo
                            {filteredMuscleGroups.length !== 1 ? "s" : ""}{" "}
                            muscular
                            {filteredMuscleGroups.length !== 1 ? "es" : ""}
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        onClick={muscleGroupModal.openModal}
                    >
                        <Plus size={18} />
                        Agregar Grupo Muscular
                    </Button>
                </div>

                <div className="gestion-page__filters">
                    <SearchInput
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Buscar grupo muscular..."
                    />
                </div>

                <div className="gestion-page__content">
                    {muscleGroupsFetch.loading ? (
                        <div className="gestion-page__empty">
                            <p>Cargando grupos musculares...</p>
                        </div>
                    ) : (
                        <MuscleGroupList
                            muscleGroups={filteredMuscleGroups}
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
