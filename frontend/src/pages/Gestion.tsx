import React, { useState, useEffect } from "react";
import { Dumbbell, Users, Target } from "lucide-react";
import { MainLayout } from "../layouts/MainLayout";
import { EquipmentList } from "../components/EquipmentList";
import { EquipmentModal } from "../components/EquipmentModal";
import { MuscleGroupList } from "../components/MuscleGroupList";
import { MuscleGroupModal } from "../components/MuscleGroupModal";
import { ExerciseList } from "../components/ExerciseList";
import { ExerciseModal } from "../components/ExerciseModal";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { equipmentService, type Equipment } from "../services/equipmentService";
import {
    muscleGroupService,
    type MuscleGroup,
} from "../services/muscleGroupService";
import { exerciseService, type Exercise } from "../services/exerciseService";
import { authService } from "../services/authService";
import { useModal } from "../hooks/useModal";
import { useDelete } from "../hooks/useDelete";
import { useFetch } from "../hooks/useFetch";
import { useToast } from "../hooks/useToast";
import "../styles/gestion.css";

type TabType = "equipamiento" | "grupos" | "ejercicios";

export const Gestion: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>("equipamiento");
    const { showToast } = useToast();

    const equipmentFetch = useFetch<Equipment[]>({
        fetchFn: equipmentService.getAll,
    });

    const muscleGroupsFetch = useFetch<MuscleGroup[]>({
        fetchFn: muscleGroupService.getAll,
    });

    const exercisesFetch = useFetch<Exercise[]>({
        fetchFn: exerciseService.getAll,
    });

    const equipmentModal = useModal<Equipment>();
    const muscleGroupModal = useModal<MuscleGroup>();
    const exerciseModal = useModal<Exercise>();

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

    const muscleGroupDelete = useDelete({
        deleteFn: muscleGroupService.delete,
        onSuccess: () => {
            muscleGroupsFetch.execute();
            showToast("success", "Grupo muscular eliminado correctamente");
        },
        onError: (error: any) => {
            const message =
                error?.response?.data?.message ||
                "Error al eliminar el grupo muscular";
            showToast("error", message);
        },
        confirmTitle: "Eliminar Grupo Muscular",
        confirmMessage: "¿Estás seguro de eliminar este grupo muscular?",
    });

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
        if (activeTab === "equipamiento") {
            equipmentFetch.execute();
        } else if (activeTab === "grupos") {
            muscleGroupsFetch.execute();
        } else if (activeTab === "ejercicios") {
            exercisesFetch.execute();
            if (!equipmentFetch.data) equipmentFetch.execute();
            if (!muscleGroupsFetch.data) muscleGroupsFetch.execute();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    const handleSubmitEquipment = async (name: string) => {
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

    const handleSubmitMuscleGroup = async (name: string) => {
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
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                "Error al guardar el grupo muscular";
            showToast("error", message);
        }
    };

    const handleSubmitExercise = async (
        name: string,
        equipmentId: number,
        muscleGroupId: number,
        secondaryMuscleGroupIds: number[]
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
                    token
                );
                showToast("success", "Ejercicio actualizado correctamente");
            } else {
                await exerciseService.create(
                    name,
                    equipmentId,
                    muscleGroupId,
                    secondaryMuscleGroupIds,
                    token
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
        <MainLayout>
            <section className="gestion">
                <div className="gestion__header">
                    <div className="gestion__title-section">
                        <h1 className="gestion__title">
                            Gestión de Entrenamiento
                        </h1>
                        <p className="gestion__subtitle">
                            Administra equipamiento, grupos musculares y
                            ejercicios
                        </p>
                    </div>

                    <div className="gestion__tabs">
                        <button
                            className={`gestion__tab ${
                                activeTab === "equipamiento"
                                    ? "gestion__tab--active"
                                    : ""
                            }`}
                            onClick={() => setActiveTab("equipamiento")}
                        >
                            <Dumbbell size={20} />
                            <span>Equipamiento</span>
                        </button>
                        <button
                            className={`gestion__tab ${
                                activeTab === "grupos"
                                    ? "gestion__tab--active"
                                    : ""
                            }`}
                            onClick={() => setActiveTab("grupos")}
                        >
                            <Users size={20} />
                            <span>Grupos Musculares</span>
                        </button>
                        <button
                            className={`gestion__tab ${
                                activeTab === "ejercicios"
                                    ? "gestion__tab--active"
                                    : ""
                            }`}
                            onClick={() => setActiveTab("ejercicios")}
                        >
                            <Target size={20} />
                            <span>Ejercicios</span>
                        </button>
                    </div>
                </div>

                <div className="gestion__content">
                    {activeTab === "equipamiento" && (
                        <div className="gestion__section">
                            <div className="gestion__section-header">
                                <h2 className="gestion__section-title">
                                    Equipamiento
                                </h2>
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
                    )}

                    {activeTab === "grupos" && (
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
                                        muscleGroups={
                                            muscleGroupsFetch.data || []
                                        }
                                        onEdit={muscleGroupModal.openEditModal}
                                        onDelete={muscleGroupDelete.deleteItem}
                                        loading={muscleGroupDelete.deletingId}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "ejercicios" && (
                        <div className="gestion__section">
                            <div className="gestion__section-header">
                                <h2 className="gestion__section-title">
                                    Ejercicios
                                </h2>
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
                    )}
                </div>

                {activeTab === "equipamiento" && (
                    <>
                        <EquipmentModal
                            isOpen={equipmentModal.isOpen}
                            onClose={equipmentModal.closeModal}
                            onSubmit={handleSubmitEquipment}
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
                )}

                {activeTab === "grupos" && (
                    <>
                        <MuscleGroupModal
                            isOpen={muscleGroupModal.isOpen}
                            onClose={muscleGroupModal.closeModal}
                            onSubmit={handleSubmitMuscleGroup}
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
                )}

                {activeTab === "ejercicios" && (
                    <>
                        <ExerciseModal
                            isOpen={exerciseModal.isOpen}
                            onClose={exerciseModal.closeModal}
                            onSubmit={handleSubmitExercise}
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
                )}
            </section>
        </MainLayout>
    );
};
