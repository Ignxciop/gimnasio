import React, { useEffect } from "react";
import { EquipmentList } from "./EquipmentList";
import { EquipmentModal } from "./EquipmentModal";
import { ConfirmDialog } from "./ui/ConfirmDialog";
import { equipmentService, type Equipment } from "../services/equipmentService";
import { authService } from "../services/authService";
import { useModal } from "../hooks/useModal";
import { useDelete } from "../hooks/useDelete";
import { useFetch } from "../hooks/useFetch";
import { useApiCall } from "../hooks/useApiCall";
import { ERROR_MESSAGES, SUCCESS_MESSAGES, UI_TEXTS } from "../config/messages";

export const EquipmentSection: React.FC = () => {
    const equipmentFetch = useFetch<Equipment[]>({
        fetchFn: equipmentService.getAll,
    });

    const equipmentModal = useModal<Equipment>();

    const equipmentDelete = useDelete({
        deleteFn: equipmentService.delete,
        onSuccess: () => equipmentFetch.execute(),
        onError: () => {},
        confirmTitle: "Eliminar Equipamiento",
        confirmMessage: UI_TEXTS.DELETE_EQUIPMENT_CONFIRM,
        successMessage: SUCCESS_MESSAGES.EQUIPMENT.DELETED,
        errorMessage: ERROR_MESSAGES.EQUIPMENT.DELETE,
    });

    useEffect(() => {
        equipmentFetch.execute();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const createEquipment = useApiCall(
        (name: string, token: string) => equipmentService.create(name, token),
        {
            successMessage: SUCCESS_MESSAGES.EQUIPMENT.CREATED,
            errorMessage: ERROR_MESSAGES.EQUIPMENT.CREATE,
            onSuccess: () => {
                equipmentFetch.execute();
                equipmentModal.closeModal();
            },
        }
    );

    const updateEquipment = useApiCall(
        (id: number, name: string, token: string) =>
            equipmentService.update(id, name, token),
        {
            successMessage: SUCCESS_MESSAGES.EQUIPMENT.UPDATED,
            errorMessage: ERROR_MESSAGES.EQUIPMENT.UPDATE,
            onSuccess: () => {
                equipmentFetch.execute();
                equipmentModal.closeModal();
            },
        }
    );

    const handleSubmit = async (name: string) => {
        const token = authService.getToken();
        if (!token) return;

        if (equipmentModal.editingItem) {
            await updateEquipment.execute(
                equipmentModal.editingItem.id,
                name,
                token
            );
        } else {
            await createEquipment.execute(name, token);
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
