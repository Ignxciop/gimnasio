import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FolderPlus,
    Plus,
    Folder as FolderIcon,
    FileText,
    GripVertical,
} from "lucide-react";
import FolderModal from "./FolderModal";
import RoutineModal from "./RoutineModal";
import { ConfirmDialog } from "./ui/ConfirmDialog";
import { useFetch } from "../hooks/useFetch";
import { useModal } from "../hooks/useModal";
import { useDelete } from "../hooks/useDelete";
import { useToast } from "../hooks/useToast";
import { folderService } from "../services/folderService";
import { routineService } from "../services/routineService";
import { authService } from "../services/authService";
import type {
    Folder,
    Routine,
    FolderFormData,
    RoutineFormData,
} from "../types/routine";

export default function RoutinesManager() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const folderModal = useModal<Folder>();
    const routineModal = useModal<Routine>();
    const [draggedFolder, setDraggedFolder] = useState<Folder | null>(null);
    const [draggedRoutine, setDraggedRoutine] = useState<Routine | null>(null);
    const [dragOverFolder, setDragOverFolder] = useState<number | null>(null);

    const foldersFetch = useFetch<Folder[]>({
        fetchFn: folderService.getAll,
    });
    const routinesFetch = useFetch<Routine[]>({
        fetchFn: routineService.getAll,
    });

    const folderDelete = useDelete({
        deleteFn: folderService.delete,
        onSuccess: () => {
            foldersFetch.execute();
            routinesFetch.execute();
            showToast("success", "Carpeta eliminada exitosamente");
        },
        onError: (error: unknown) => {
            const message =
                (error as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message || "Error al eliminar carpeta";
            showToast("error", message);
        },
        confirmTitle: "Eliminar Carpeta",
        confirmMessage:
            "¿Estás seguro de eliminar esta carpeta? Las rutinas dentro se moverán a 'Sin carpeta'.",
    });

    const routineDelete = useDelete({
        deleteFn: routineService.delete,
        onSuccess: () => {
            routinesFetch.execute();
            showToast("success", "Rutina eliminada exitosamente");
        },
        onError: (error: unknown) => {
            const message =
                (error as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message || "Error al eliminar rutina";
            showToast("error", message);
        },
        confirmTitle: "Eliminar Rutina",
        confirmMessage: "¿Estás seguro de eliminar esta rutina?",
    });

    useEffect(() => {
        foldersFetch.execute();
        routinesFetch.execute();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const handleOpenRoutine = (routineId: number) => {
        navigate(`/rutinas/${routineId}`);
    };

    const handleFolderSubmit = async (data: FolderFormData) => {
        try {
            const token = authService.getToken();
            if (!token) return;

            if (folderModal.editingItem) {
                await folderService.update(
                    folderModal.editingItem.id,
                    data,
                    token
                );
                showToast("success", "Carpeta actualizada exitosamente");
            } else {
                await folderService.create(data, token);
                showToast("success", "Carpeta creada exitosamente");
            }
            foldersFetch.execute();
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
            const token = authService.getToken();
            if (!token) return;

            if (routineModal.editingItem) {
                await routineService.update(
                    routineModal.editingItem.id,
                    data,
                    token
                );
                showToast("success", "Rutina actualizada exitosamente");
            } else {
                await routineService.create(data, token);
                showToast("success", "Rutina creada exitosamente");
            }
            routinesFetch.execute();
        } catch (error) {
            showToast(
                "error",
                error instanceof Error
                    ? error.message
                    : "Error al guardar rutina"
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

    const handleFolderDragStart = (folder: Folder) => {
        setDraggedFolder(folder);
    };

    const handleFolderDragOver = (e: React.DragEvent, folder: Folder) => {
        e.preventDefault();
        if (draggedFolder && draggedFolder.id !== folder.id) {
            setDragOverFolder(folder.id);
        }
    };

    const handleFolderDragLeave = () => {
        setDragOverFolder(null);
    };

    const handleFolderDrop = async (
        e: React.DragEvent,
        targetFolder: Folder
    ) => {
        if (draggedRoutine) {
            await handleRoutineDropInFolder(e, targetFolder.id);
            return;
        }

        e.preventDefault();
        setDragOverFolder(null);

        if (!draggedFolder || draggedFolder.id === targetFolder.id) {
            setDraggedFolder(null);
            return;
        }

        try {
            const token = authService.getToken();
            if (!token) return;

            const folders = foldersFetch.data || [];
            const draggedIndex = folders.findIndex(
                (f) => f.id === draggedFolder.id
            );
            const targetIndex = folders.findIndex(
                (f) => f.id === targetFolder.id
            );

            const reorderedFolders = [...folders];
            reorderedFolders.splice(draggedIndex, 1);
            reorderedFolders.splice(targetIndex, 0, draggedFolder);

            const updatedFolders = reorderedFolders.map((folder, index) => ({
                id: folder.id,
                order: index,
                folderId: folder.folderId,
            }));

            await folderService.reorder(updatedFolders, token);
            foldersFetch.execute();
            showToast("success", "Orden actualizado exitosamente");
        } catch {
            showToast("error", "Error al actualizar el orden");
        }

        setDraggedFolder(null);
    };

    const handleRoutineDragStart = (routine: Routine) => {
        setDraggedRoutine(routine);
    };

    const handleRoutineDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleRoutineDropInFolder = async (
        e: React.DragEvent,
        targetFolderId: number | null
    ) => {
        e.preventDefault();
        e.stopPropagation();

        if (!draggedRoutine) return;

        if (draggedRoutine.folderId === targetFolderId) {
            setDraggedRoutine(null);
            return;
        }

        try {
            const token = authService.getToken();
            if (!token) return;

            const routines = routinesFetch.data || [];
            const targetRoutines = routines.filter(
                (r) => r.folderId === targetFolderId
            );

            const updatedRoutines = [
                {
                    id: draggedRoutine.id,
                    order: targetRoutines.length,
                    folderId: targetFolderId,
                },
            ];

            await routineService.reorder(updatedRoutines, token);
            routinesFetch.execute();
            showToast("success", "Rutina movida exitosamente");
        } catch {
            showToast("error", "Error al mover la rutina");
        }

        setDraggedRoutine(null);
    };

    const handleRoutineDropOnRoutine = async (
        e: React.DragEvent,
        targetRoutine: Routine
    ) => {
        e.preventDefault();
        e.stopPropagation();

        if (!draggedRoutine || draggedRoutine.id === targetRoutine.id) {
            setDraggedRoutine(null);
            return;
        }

        try {
            const token = authService.getToken();
            if (!token) return;

            const routines = routinesFetch.data || [];
            const sameFolder =
                draggedRoutine.folderId === targetRoutine.folderId;
            const folderRoutines = routines.filter(
                (r) => r.folderId === targetRoutine.folderId
            );

            if (sameFolder) {
                const draggedIndex = folderRoutines.findIndex(
                    (r) => r.id === draggedRoutine.id
                );
                const targetIndex = folderRoutines.findIndex(
                    (r) => r.id === targetRoutine.id
                );

                const reordered = [...folderRoutines];
                reordered.splice(draggedIndex, 1);
                reordered.splice(targetIndex, 0, draggedRoutine);

                const updatedRoutines = reordered.map((routine, index) => ({
                    id: routine.id,
                    order: index,
                }));

                await routineService.reorder(updatedRoutines, token);
            } else {
                const targetIndex = folderRoutines.findIndex(
                    (r) => r.id === targetRoutine.id
                );

                const updatedRoutines = [
                    {
                        id: draggedRoutine.id,
                        order: targetIndex,
                        folderId: targetRoutine.folderId,
                    },
                ];

                await routineService.reorder(updatedRoutines, token);
            }

            routinesFetch.execute();
            showToast("success", "Orden actualizado exitosamente");
        } catch {
            showToast("error", "Error al actualizar el orden");
        }

        setDraggedRoutine(null);
    };

    if (foldersFetch.loading || routinesFetch.loading) {
        return <div className="loading">Cargando...</div>;
    }

    return (
        <>
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
                                        className={`folder-card ${
                                            dragOverFolder === folder.id
                                                ? "drag-over"
                                                : ""
                                        }`}
                                        draggable
                                        onDragStart={() =>
                                            handleFolderDragStart(folder)
                                        }
                                        onDragOver={(e) =>
                                            handleFolderDragOver(e, folder)
                                        }
                                        onDragLeave={handleFolderDragLeave}
                                        onDrop={(e) =>
                                            handleFolderDrop(e, folder)
                                        }
                                    >
                                        <div className="folder-header">
                                            <div className="folder-info">
                                                <GripVertical
                                                    size={20}
                                                    className="drag-handle"
                                                />
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
                                                        folderDelete.deleteItem(
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
                                        <div
                                            className="routines-list"
                                            onDragOver={handleRoutineDragOver}
                                            onDrop={(e) =>
                                                handleRoutineDropInFolder(
                                                    e,
                                                    folder.id
                                                )
                                            }
                                        >
                                            {getRoutinesByFolder(folder.id).map(
                                                (routine) => (
                                                    <div
                                                        key={routine.id}
                                                        className="routine-card"
                                                        draggable
                                                        onDragStart={() =>
                                                            handleRoutineDragStart(
                                                                routine
                                                            )
                                                        }
                                                        onDragOver={
                                                            handleRoutineDragOver
                                                        }
                                                        onDrop={(e) =>
                                                            handleRoutineDropOnRoutine(
                                                                e,
                                                                routine
                                                            )
                                                        }
                                                    >
                                                        <div className="routine-info">
                                                            <GripVertical
                                                                size={16}
                                                                className="drag-handle"
                                                            />
                                                            <FileText
                                                                size={18}
                                                            />
                                                            <span
                                                                onClick={() =>
                                                                    handleOpenRoutine(
                                                                        routine.id
                                                                    )
                                                                }
                                                                style={{
                                                                    cursor: "pointer",
                                                                }}
                                                            >
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
                                                                    routineDelete.deleteItem(
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
                        <div
                            className="no-folder-section"
                            onDragOver={handleRoutineDragOver}
                            onDrop={(e) => handleRoutineDropInFolder(e, null)}
                        >
                            <h3>Sin Carpeta</h3>
                            <div className="routines-list">
                                {getRoutinesByFolder(null).map((routine) => (
                                    <div
                                        key={routine.id}
                                        className="routine-card"
                                        draggable
                                        onDragStart={() =>
                                            handleRoutineDragStart(routine)
                                        }
                                        onDragOver={handleRoutineDragOver}
                                        onDrop={(e) =>
                                            handleRoutineDropOnRoutine(
                                                e,
                                                routine
                                            )
                                        }
                                    >
                                        <div className="routine-info">
                                            <GripVertical
                                                size={16}
                                                className="drag-handle"
                                            />
                                            <FileText size={18} />
                                            <span
                                                onClick={() =>
                                                    handleOpenRoutine(
                                                        routine.id
                                                    )
                                                }
                                                style={{ cursor: "pointer" }}
                                            >
                                                {routine.name}
                                            </span>
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
                                                    routineDelete.deleteItem(
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

            <ConfirmDialog
                isOpen={folderDelete.showConfirm}
                onClose={folderDelete.cancelDelete}
                onConfirm={folderDelete.confirmDelete}
                title={folderDelete.confirmTitle}
                message={folderDelete.confirmMessage}
                variant="danger"
            />

            <ConfirmDialog
                isOpen={routineDelete.showConfirm}
                onClose={routineDelete.cancelDelete}
                onConfirm={routineDelete.confirmDelete}
                title={routineDelete.confirmTitle}
                message={routineDelete.confirmMessage}
                variant="danger"
            />
        </>
    );
}
