import { useState, useEffect } from "react";
import { FolderPlus, Plus, Folder as FolderIcon, FileText } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import FolderModal from "../components/FolderModal";
import RoutineModal from "../components/RoutineModal";
import { useFetch } from "../hooks/useFetch";
import { useModal } from "../hooks/useModal";
import { useToast } from "../hooks/useToast";
import { folderService } from "../services/folderService";
import { routineService } from "../services/routineService";
import type {
    Folder,
    Routine,
    FolderFormData,
    RoutineFormData,
} from "../types/routine";
import "../styles/rutinas.css";

export default function Rutinas() {
    const { showToast } = useToast();
    const folderModal = useModal<Folder>();
    const routineModal = useModal<Routine>();

    const foldersFetch = useFetch<Folder[]>({
        fetchFn: folderService.getAll,
    });
    const routinesFetch = useFetch<Routine[]>({
        fetchFn: routineService.getAll,
    });

    useEffect(() => {
        foldersFetch.execute();
        routinesFetch.execute();
    }, []);

    const handleCreateFolder = () => {
        folderModal.openModal();
    };

    const handleEditFolder = (folder: Folder) => {
        folderModal.openEditModal(folder);
    };

    const handleCreateRoutine = () => {
        routineModal.openModal();
    };

    const handleEditRoutine = (routine: Routine) => {
        routineModal.openEditModal(routine);
    };

    const handleFolderSubmit = async (data: FolderFormData) => {
        try {
            if (folderModal.editingItem) {
                await folderService.update(folderModal.editingItem.id, data);
                showToast("success", "Carpeta actualizada exitosamente");
            } else {
                await folderService.create(data);
                showToast("success", "Carpeta creada exitosamente");
            }
            foldersFetch.execute();
            folderModal.closeModal();
        } catch (error) {
            showToast(
                "error",
                error instanceof Error
                    ? error.message
                    : "Error al guardar carpeta"
            );
        }
    };

    const handleRoutineSubmit = async (data: RoutineFormData) => {
        try {
            if (routineModal.editingItem) {
                await routineService.update(routineModal.editingItem.id, data);
                showToast("success", "Rutina actualizada exitosamente");
            } else {
                await routineService.create(data);
                showToast("success", "Rutina creada exitosamente");
            }
            routinesFetch.execute();
            routineModal.closeModal();
        } catch (error) {
            showToast(
                "error",
                error instanceof Error
                    ? error.message
                    : "Error al guardar rutina"
            );
        }
    };

    const handleDeleteFolder = async (id: number) => {
        if (
            !confirm(
                "¿Estás seguro de eliminar esta carpeta? Las rutinas dentro se moverán a 'Sin carpeta'."
            )
        )
            return;

        try {
            await folderService.delete(id);
            showToast("success", "Carpeta eliminada exitosamente");
            foldersFetch.execute();
            routinesFetch.execute();
        } catch (error) {
            showToast(
                "error",
                error instanceof Error
                    ? error.message
                    : "Error al eliminar carpeta"
            );
        }
    };

    const handleDeleteRoutine = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar esta rutina?")) return;

        try {
            await routineService.delete(id);
            showToast("success", "Rutina eliminada exitosamente");
            routinesFetch.execute();
        } catch (error) {
            showToast(
                "error",
                error instanceof Error
                    ? error.message
                    : "Error al eliminar rutina"
            );
        }
    };

    const getRoutinesByFolder = (folderId: number | null) => {
        return (
            routinesFetch.data?.filter(
                (routine) => routine.folderId === folderId
            ) || []
        );
    };

    if (foldersFetch.loading || routinesFetch.loading) {
        return (
            <MainLayout>
                <div className="loading">Cargando...</div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="rutinas-container">
                <div className="rutinas-header">
                    <h1>Mis Rutinas</h1>
                    <div className="header-actions">
                        <button
                            onClick={handleCreateFolder}
                            className="btn-create-folder"
                        >
                            <FolderPlus size={20} />
                            Nueva Carpeta
                        </button>
                        <button
                            onClick={handleCreateRoutine}
                            className="btn-create-routine"
                        >
                            <Plus size={20} />
                            Nueva Rutina
                        </button>
                    </div>
                </div>

                <div className="rutinas-content">
                    <div className="folders-section">
                        {foldersFetch.data && foldersFetch.data.length > 0 && (
                            <>
                                {foldersFetch.data.map((folder) => (
                                    <div
                                        key={folder.id}
                                        className="folder-card"
                                    >
                                        <div className="folder-header">
                                            <div className="folder-info">
                                                <FolderIcon size={24} />
                                                <h3>{folder.name}</h3>
                                            </div>
                                            <div className="folder-actions">
                                                <button
                                                    onClick={() =>
                                                        handleEditFolder(folder)
                                                    }
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteFolder(
                                                            folder.id
                                                        )
                                                    }
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                        {folder.description && (
                                            <p className="folder-description">
                                                {folder.description}
                                            </p>
                                        )}
                                        <div className="routines-list">
                                            {getRoutinesByFolder(folder.id).map(
                                                (routine) => (
                                                    <div
                                                        key={routine.id}
                                                        className="routine-card"
                                                    >
                                                        <div className="routine-info">
                                                            <FileText
                                                                size={18}
                                                            />
                                                            <span>
                                                                {routine.name}
                                                            </span>
                                                        </div>
                                                        <div className="routine-actions">
                                                            <button
                                                                onClick={() =>
                                                                    handleEditRoutine(
                                                                        routine
                                                                    )
                                                                }
                                                            >
                                                                Editar
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDeleteRoutine(
                                                                        routine.id
                                                                    )
                                                                }
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>

                    {getRoutinesByFolder(null).length > 0 && (
                        <div className="no-folder-section">
                            <h3>Sin Carpeta</h3>
                            <div className="routines-list">
                                {getRoutinesByFolder(null).map((routine) => (
                                    <div
                                        key={routine.id}
                                        className="routine-card"
                                    >
                                        <div className="routine-info">
                                            <FileText size={18} />
                                            <span>{routine.name}</span>
                                        </div>
                                        <div className="routine-actions">
                                            <button
                                                onClick={() =>
                                                    handleEditRoutine(routine)
                                                }
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDeleteRoutine(
                                                        routine.id
                                                    )
                                                }
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {(!foldersFetch.data || foldersFetch.data.length === 0) &&
                        (!routinesFetch.data ||
                            routinesFetch.data.length === 0) && (
                            <div className="empty-state">
                                <p>No tienes carpetas ni rutinas aún</p>
                                <p>Comienza creando una carpeta o una rutina</p>
                            </div>
                        )}
                </div>
            </div>

            <FolderModal
                isOpen={folderModal.isOpen}
                onClose={folderModal.closeModal}
                onSubmit={handleFolderSubmit}
                folder={folderModal.editingItem}
            />

            <RoutineModal
                isOpen={routineModal.isOpen}
                onClose={routineModal.closeModal}
                onSubmit={handleRoutineSubmit}
                routine={routineModal.editingItem}
                folders={foldersFetch.data || []}
            />
        </MainLayout>
    );
}
