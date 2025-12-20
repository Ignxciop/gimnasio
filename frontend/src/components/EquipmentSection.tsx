import React, { useEffect } from "react";
import { EquipmentList } from "./EquipmentList";
import { EquipmentModal } from "./EquipmentModal";
import { ConfirmDialog } from "./ui/ConfirmDialog";
import { equipmentService, type Equipment } from "../services/equipmentService";
import { authService } from "../services/authService";
import { useModal } from "../hooks/useModal";
import { useDelete } from "../hooks/useDelete";
import { useFetch } from "../hooks/useFetch";
import { useToast } from "../hooks/useToast";

export const EquipmentSection: React.FC = () => {
    const { showToast } = useToast();

    const equipmentFetch = useFetch<Equipment[]>({
        fetchFn: equipmentService.getAll,
    });

    const equipmentModal = useModal<Equipment>();

    const equipmentDelete = useDelete({
        deleteFn: equipmentService.delete,
        onSuccess: () => {
            equipmentFetch.execute();
            showToast("success", "Equipamiento eliminado correctamente");
        },
        onError: (error: any) => {
            const message =
                error?.response?.data?.message ||
                "Error al eliminar el equipamiento";
            showToast("error", message);
        },
        confirmTitle: "Eliminar Equipamiento",
        confirmMessage: "¿Estás seguro de eliminar este equipamiento?",
    });

    useEffect(() => {
        equipmentFetch.execute();
    }, []);

    const handleSubmit = async (name: string) => {
        const token = authService.getToken();
        if (!token) return;

        try {
            if (equipmentModal.editingItem) {
                await equipmentService.update(
                    equipmentModal.editingItem.id,
                    name,
                    token
                );
                showToast("success", "Equipamiento actualizado correctamente");
            } else {
                await equipmentService.create(name, token);
                showToast("success", "Equipamiento creado correctamente");
            }
            await equipmentFetch.execute();
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                "Error al guardar el equipamiento";
            showToast("error", message);
        }
    };

    return (
        <>
            <div className="gestion__section">
                <div className="gestion__section-header">
                    <h2 className="gestion__section-title">Equipamiento</h2>
                    <button
                        className="gestion__add-button"
                        onClick={equipmentModal.openModal}
                    >
                        Agregar Equipamiento
                    </button>
                </div>
                <div className="gestion__section-content">
                    {equipmentFetch.loading ? (
                        <div className="gestion__placeholder">
                            <p>Cargando equipamiento...</p>
                        </div>
                    ) : (
                        <EquipmentList
                            equipment={equipmentFetch.data || []}
                            onEdit={equipmentModal.openEditModal}
                            onDelete={equipmentDelete.deleteItem}
                            loading={equipmentDelete.deletingId}
                        />
                    )}
                </div>
            </div>

            <EquipmentModal
                isOpen={equipmentModal.isOpen}
                onClose={equipmentModal.closeModal}
                onSubmit={handleSubmit}
                equipment={equipmentModal.editingItem}
                title={
                    equipmentModal.editingItem
                        ? "Editar Equipamiento"
                        : "Agregar Equipamiento"
                }
            />

            <ConfirmDialog
                isOpen={equipmentDelete.showConfirm}
                onClose={equipmentDelete.cancelDelete}
                onConfirm={equipmentDelete.confirmDelete}
                title={equipmentDelete.confirmTitle}
                message={equipmentDelete.confirmMessage}
                variant="danger"
            />
        </>
    );
};
