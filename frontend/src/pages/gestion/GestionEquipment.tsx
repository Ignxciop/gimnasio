import React, { useState, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import { SearchInput } from "../../components/ui/SearchInput";
import { Button } from "../../components/ui/Button";
import { EquipmentList } from "../../components/EquipmentList";
import { EquipmentModal } from "../../components/EquipmentModal";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import {
    equipmentService,
    type Equipment,
} from "../../services/equipmentService";
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

export const GestionEquipment: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");

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

    const filteredEquipment = useMemo(() => {
        const equipment = equipmentFetch.data || [];
        return equipment.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [equipmentFetch.data, searchTerm]);

    return (
        <>
            <div className="gestion-page">
                <div className="gestion-page__header">
                    <div className="gestion-page__header-left">
                        <h2 className="gestion-page__title">Equipamiento</h2>
                        <p className="gestion-page__subtitle">
                            {filteredEquipment.length} tipo
                            {filteredEquipment.length !== 1 ? "s" : ""} de
                            equipamiento
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        onClick={equipmentModal.openModal}
                    >
                        <Plus size={18} />
                        Agregar Equipamiento
                    </Button>
                </div>

                <div className="gestion-page__filters">
                    <SearchInput
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Buscar equipamiento..."
                    />
                </div>

                <div className="gestion-page__content">
                    {equipmentFetch.loading ? (
                        <div className="gestion-page__empty">
                            <p>Cargando equipamiento...</p>
                        </div>
                    ) : (
                        <EquipmentList
                            equipment={filteredEquipment}
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
