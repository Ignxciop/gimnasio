import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Folder as FolderIcon, FileText, Plus } from "lucide-react";
import FolderModal from "./FolderModal";
import RoutineModal from "./RoutineModal";
import { ConfirmDialog } from "./ui/ConfirmDialog";
import { FolderItem } from "./routines/FolderItem";
import { RoutineItem } from "./routines/RoutineItem";
import { useFetch } from "../hooks/useFetch";
import { useModal } from "../hooks/useModal";
import { useDelete } from "../hooks/useDelete";
import { useApiCall } from "../hooks/useApiCall";
import { folderService } from "../services/folderService";
import { routineService } from "../services/routineService";
import { authService } from "../services/authService";
import {
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    UI_TEXTS,
    LOADING_MESSAGES,
} from "../config/messages";
import type {
    Folder,
    Routine,
    FolderFormData,
    RoutineFormData,
} from "../types/routine";
import "../styles/rutinas-new.css";

export default function RoutinesManager() {
    const navigate = useNavigate();
    const folderModal = useModal<Folder>();
    const routineModal = useModal<Routine>();
    const [draggedFolder, setDraggedFolder] = useState<Folder | null>(null);
    const [draggedRoutine, setDraggedRoutine] = useState<Routine | null>(null);
    const [dragOverFolder, setDragOverFolder] = useState<number | null>(null);
    // const [isTouchDragging, setIsTouchDragging] = useState(false); // Eliminado porque no se usa
    const [longPressTimer, setLongPressTimer] = useState<number | null>(null);

    const foldersFetch = useFetch<Folder[]>({ fetchFn: folderService.getAll });
    const routinesFetch = useFetch<Routine[]>({
        fetchFn: routineService.getAll,
    });

    const folderDelete = useDelete({
        deleteFn: folderService.delete,
        onSuccess: () => {
            foldersFetch.execute();
            routinesFetch.execute();
        },
        onError: () => {},
        confirmTitle: "Eliminar Carpeta",
        confirmMessage: UI_TEXTS.DELETE_FOLDER_CONFIRM,
        successMessage: SUCCESS_MESSAGES.FOLDERS.DELETED,
        errorMessage: ERROR_MESSAGES.FOLDERS.DELETE,
    });
    const routineDelete = useDelete({
        deleteFn: routineService.delete,
        onSuccess: () => routinesFetch.execute(),
        onError: () => {},
        confirmTitle: "Eliminar Rutina",
        confirmMessage: UI_TEXTS.DELETE_ROUTINE_CONFIRM,
        successMessage: SUCCESS_MESSAGES.ROUTINES.DELETED,
        errorMessage: ERROR_MESSAGES.ROUTINES.DELETE,
    });

    useEffect(() => {
        foldersFetch.execute();
        routinesFetch.execute();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const createFolder = useApiCall(
        (data: FolderFormData, token: string) =>
            folderService.create(data, token),
        {
            successMessage: SUCCESS_MESSAGES.FOLDERS.CREATED,
            errorMessage: ERROR_MESSAGES.FOLDERS.CREATE,
            onSuccess: () => {
                foldersFetch.execute();
                folderModal.closeModal();
            },
        },
    );
    const updateFolder = useApiCall(
        (id: number, data: FolderFormData, token: string) =>
            folderService.update(id, data, token),
        {
            successMessage: SUCCESS_MESSAGES.FOLDERS.UPDATED,
            errorMessage: ERROR_MESSAGES.FOLDERS.UPDATE,
            onSuccess: () => {
                foldersFetch.execute();
                folderModal.closeModal();
            },
        },
    );
    const createRoutine = useApiCall(
        (data: RoutineFormData, token: string) =>
            routineService.create(data, token),
        {
            successMessage: SUCCESS_MESSAGES.ROUTINES.CREATED,
            errorMessage: ERROR_MESSAGES.ROUTINES.CREATE,
            onSuccess: () => {
                routinesFetch.execute();
                routineModal.closeModal();
            },
        },
    );
    const updateRoutine = useApiCall(
        (id: number, data: RoutineFormData, token: string) =>
            routineService.update(id, data, token),
        {
            successMessage: SUCCESS_MESSAGES.ROUTINES.UPDATED,
            errorMessage: ERROR_MESSAGES.ROUTINES.UPDATE,
            onSuccess: () => {
                routinesFetch.execute();
                routineModal.closeModal();
            },
        },
    );
    const reorderFolders = useApiCall(
        (folders: { id: number; order: number }[], token: string) =>
            folderService.reorder(folders, token),
        {
            successMessage: SUCCESS_MESSAGES.ROUTINES.ORDER_UPDATED,
            errorMessage: ERROR_MESSAGES.ROUTINES.UPDATE_ORDER,
            onSuccess: () => foldersFetch.execute(),
        },
    );
    const moveRoutine = useApiCall(
        (
            routines: { id: number; order: number; folderId: number | null }[],
            token: string,
        ) => routineService.reorder(routines, token),
        {
            successMessage: SUCCESS_MESSAGES.ROUTINES.MOVED,
            errorMessage: ERROR_MESSAGES.ROUTINES.MOVE,
            onSuccess: () => routinesFetch.execute(),
        },
    );

    // --- DRAG & DROP HANDLERS ---
    // Carpetas
    const handleFolderDragStart = (e: React.DragEvent, folder: Folder) => {
        setDraggedFolder(folder);
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", folder.id.toString());
        }
    };
    const handleFolderDragEnd = () => {
        setDraggedFolder(null);
        setDragOverFolder(null);
    };
    const handleFolderDragOver = (e: React.DragEvent, folderId: number) => {
        e.preventDefault();
        if (draggedFolder && folderId !== draggedFolder.id) {
            setDragOverFolder(folderId);
        }
    };
    const handleFolderDrop = async (e: React.DragEvent, folderId: number) => {
        e.preventDefault();
        if (!draggedFolder || folderId === draggedFolder.id) return;
        const folders = foldersFetch.data || [];
        const draggedIndex = folders.findIndex(
            (f) => f.id === draggedFolder.id,
        );
        const targetIndex = folders.findIndex((f) => f.id === folderId);
        if (draggedIndex === -1 || targetIndex === -1) return;
        const reorderedFolders = [...folders];
        reorderedFolders.splice(draggedIndex, 1);
        reorderedFolders.splice(targetIndex, 0, draggedFolder);
        const updatedFolders = reorderedFolders.map((f, idx) => ({
            id: f.id,
            order: idx,
        }));
        const token = authService.getToken();
        if (token) await reorderFolders.execute(updatedFolders, token);
        setDraggedFolder(null);
        setDragOverFolder(null);
    };
    // Touch long press para carpetas
    const handleFolderTouchStart = (_: React.TouchEvent, folder: Folder) => {
        if (longPressTimer) return;
        const timer = window.setTimeout(() => {
            setDraggedFolder(folder);
        }, 500);
        setLongPressTimer(timer);
    };
    const handleFolderTouchEnd = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            setLongPressTimer(null);
        }
        setDraggedFolder(null);
        setDragOverFolder(null);
    };

    // Rutinas
    const handleRoutineDragStart = (e: React.DragEvent, routine: Routine) => {
        setDraggedRoutine(routine);
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", routine.id.toString());
        }
    };
    const handleRoutineDragEnd = () => {
        setDraggedRoutine(null);
    };
    const handleRoutineDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };
    const handleRoutineDropInFolder = async (
        e: React.DragEvent,
        targetFolderId: number | null,
    ) => {
        e.preventDefault();
        e.stopPropagation();
        if (!draggedRoutine) return;
        if (draggedRoutine.folderId === targetFolderId) {
            setDraggedRoutine(null);
            return;
        }
        const token = authService.getToken();
        if (!token) return;
        const routines = routinesFetch.data || [];
        const targetRoutines = routines.filter(
            (r) => r.folderId === targetFolderId,
        );
        const updatedRoutines = [
            {
                id: draggedRoutine.id,
                order: targetRoutines.length,
                folderId: targetFolderId,
            },
        ];
        await moveRoutine.execute(updatedRoutines, token);
        setDraggedRoutine(null);
    };
    // Permite reordenar rutinas dentro de la misma carpeta (drag & drop entre rutinas)
    const handleRoutineDragOverItem = (
        e: React.DragEvent,
        _targetRoutine: Routine,
    ) => {
        e.preventDefault();
    };
    const handleRoutineDropOnItem = async (
        e: React.DragEvent,
        targetRoutine: Routine,
    ) => {
        e.preventDefault();
        if (!draggedRoutine || draggedRoutine.id === targetRoutine.id) return;
        const routines = routinesFetch.data || [];
        // Solo permite reordenar dentro de la misma carpeta
        if (draggedRoutine.folderId !== targetRoutine.folderId) return;
        const folderId = draggedRoutine.folderId;
        const routinesInFolder = routines.filter(
            (r) => r.folderId === folderId,
        );
        const fromIdx = routinesInFolder.findIndex(
            (r) => r.id === draggedRoutine.id,
        );
        const toIdx = routinesInFolder.findIndex(
            (r) => r.id === targetRoutine.id,
        );
        if (fromIdx === -1 || toIdx === -1) return;
        const reordered = [...routinesInFolder];
        const [removed] = reordered.splice(fromIdx, 1);
        reordered.splice(toIdx, 0, removed);
        const updatedRoutines = reordered.map((r, idx) => ({
            id: r.id,
            order: idx,
            folderId: folderId ?? null,
        }));
        const token = authService.getToken();
        if (token) await moveRoutine.execute(updatedRoutines, token);
        setDraggedRoutine(null);
    };
    // Touch long press para rutinas
    const handleRoutineTouchStart = (_: React.TouchEvent, routine: Routine) => {
        if (longPressTimer) return;
        const timer = window.setTimeout(() => {
            setDraggedRoutine(routine);
        }, 500);
        setLongPressTimer(timer);
    };
    const handleRoutineTouchEnd = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            setLongPressTimer(null);
        }
        setDraggedRoutine(null);
    };

    // --- UI HANDLERS ---
    const handleCreateFolder = () => folderModal.openModal();
    const handleEditFolder = (folder: Folder) =>
        folderModal.openEditModal(folder);
    const handleCreateRoutine = () => routineModal.openModal();
    const handleEditRoutine = (routine: Routine) =>
        routineModal.openEditModal(routine);
    const handleOpenRoutine = (routineId: number) =>
        navigate(`/rutinas/${routineId}`);
    const handleFolderSubmit = async (data: FolderFormData) => {
        const token = authService.getToken();
        if (!token) return;
        if (folderModal.editingItem) {
            await updateFolder.execute(folderModal.editingItem.id, data, token);
        } else {
            await createFolder.execute(data, token);
        }
    };
    const handleRoutineSubmit = async (data: RoutineFormData) => {
        const token = authService.getToken();
        if (!token) return;
        if (routineModal.editingItem) {
            await updateRoutine.execute(
                routineModal.editingItem.id,
                data,
                token,
            );
        } else {
            await createRoutine.execute(data, token);
        }
    };
    const getRoutinesByFolder = (folderId: number | null) =>
        routinesFetch.data?.filter(
            (routine) => routine.folderId === folderId,
        ) || [];

    // --- RENDER ---
    if (foldersFetch.loading || routinesFetch.loading) {
        return <div className="loading">{LOADING_MESSAGES.ROUTINES}</div>;
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
                            <FolderIcon size={20} /> Nueva Carpeta
                        </button>
                        <button
                            onClick={handleCreateRoutine}
                            className="btn-create-routine"
                        >
                            <FileText size={20} /> Nueva Rutina
                        </button>
                    </div>
                </div>
                <div className="rutinas-content">
                    {foldersFetch.data && foldersFetch.data.length > 0 && (
                        <>
                            {foldersFetch.data.map((folder) => {
                                const folderDragHandlers = {
                                    onDragStart: (e: React.DragEvent) =>
                                        handleFolderDragStart(e, folder),
                                    onDragEnd: handleFolderDragEnd,
                                    onTouchStart: (e: React.TouchEvent) =>
                                        handleFolderTouchStart(e, folder),
                                    onTouchEnd: handleFolderTouchEnd,
                                };
                                return (
                                    <FolderItem
                                        key={folder.id}
                                        folder={folder}
                                        isDragOver={
                                            dragOverFolder === folder.id
                                        }
                                        isLifted={
                                            !!draggedFolder &&
                                            draggedFolder.id === folder.id
                                        }
                                        onEdit={() => handleEditFolder(folder)}
                                        onDelete={() =>
                                            folderDelete.deleteItem(folder.id)
                                        }
                                        dragHandlers={folderDragHandlers}
                                        onDragOver={(e) =>
                                            handleFolderDragOver(e, folder.id)
                                        }
                                        onDrop={(e) =>
                                            handleFolderDrop(e, folder.id)
                                        }
                                    >
                                        <div
                                            onDragOver={handleRoutineDragOver}
                                            onDrop={(e) =>
                                                handleRoutineDropInFolder(
                                                    e,
                                                    folder.id,
                                                )
                                            }
                                        >
                                            {getRoutinesByFolder(folder.id).map(
                                                (routine) => {
                                                    const routineDragHandlers =
                                                        {
                                                            onDragStart: (
                                                                e: React.DragEvent,
                                                            ) =>
                                                                handleRoutineDragStart(
                                                                    e,
                                                                    routine,
                                                                ),
                                                            onDragEnd:
                                                                handleRoutineDragEnd,
                                                            onTouchStart: (
                                                                e: React.TouchEvent,
                                                            ) =>
                                                                handleRoutineTouchStart(
                                                                    e,
                                                                    routine,
                                                                ),
                                                            onTouchEnd:
                                                                handleRoutineTouchEnd,
                                                        };
                                                    return (
                                                        <div
                                                            key={routine.id}
                                                            onDragOver={(e) =>
                                                                handleRoutineDragOverItem(
                                                                    e,
                                                                    routine,
                                                                )
                                                            }
                                                            onDrop={(e) =>
                                                                handleRoutineDropOnItem(
                                                                    e,
                                                                    routine,
                                                                )
                                                            }
                                                        >
                                                            <RoutineItem
                                                                routine={
                                                                    routine
                                                                }
                                                                isLifted={
                                                                    !!draggedRoutine &&
                                                                    draggedRoutine.id ===
                                                                        routine.id
                                                                }
                                                                onEdit={() =>
                                                                    handleEditRoutine(
                                                                        routine,
                                                                    )
                                                                }
                                                                onDelete={() =>
                                                                    routineDelete.deleteItem(
                                                                        routine.id,
                                                                    )
                                                                }
                                                                onOpen={() =>
                                                                    handleOpenRoutine(
                                                                        routine.id,
                                                                    )
                                                                }
                                                                dragHandlers={
                                                                    routineDragHandlers
                                                                }
                                                            />
                                                        </div>
                                                    );
                                                },
                                            )}
                                            {getRoutinesByFolder(folder.id)
                                                .length === 0 && (
                                                <div
                                                    className="empty-folder-dropzone"
                                                    style={{
                                                        minHeight: 40,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        border: "1.5px dashed #d1d5db", // gris claro
                                                        borderRadius: 8,
                                                        margin: 8,
                                                        background:
                                                            "rgba(220,220,220,0.08)",
                                                        color: "#888",
                                                        fontSize: 13,
                                                        transition:
                                                            "border-color 0.2s, background 0.2s",
                                                    }}
                                                    onDragOver={(e) => {
                                                        e.preventDefault();
                                                        e.currentTarget.style.borderColor =
                                                            "#ffb347"; // acento suave solo al arrastrar
                                                        e.currentTarget.style.background =
                                                            "rgba(255,179,71,0.08)";
                                                    }}
                                                    onDragLeave={(e) => {
                                                        e.currentTarget.style.borderColor =
                                                            "#d1d5db";
                                                        e.currentTarget.style.background =
                                                            "rgba(220,220,220,0.08)";
                                                    }}
                                                    onDrop={(e) => {
                                                        handleRoutineDropInFolder(
                                                            e,
                                                            folder.id,
                                                        );
                                                        e.currentTarget.style.borderColor =
                                                            "#d1d5db";
                                                        e.currentTarget.style.background =
                                                            "rgba(220,220,220,0.08)";
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            color: "#aaa",
                                                            fontSize: 13,
                                                        }}
                                                    >
                                                        Suelta aquí para mover
                                                        rutina
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </FolderItem>
                                );
                            })}
                        </>
                    )}
                    {getRoutinesByFolder(null).length > 0 && (
                        <div
                            className="no-folder-section"
                            onDragOver={handleRoutineDragOver}
                            onDrop={(e) => handleRoutineDropInFolder(e, null)}
                        >
                            <h3>Sin Carpeta</h3>
                            <div className="folder-routines">
                                {getRoutinesByFolder(null).map((routine) => {
                                    const routineDragHandlers = {
                                        onDragStart: (e: React.DragEvent) =>
                                            handleRoutineDragStart(e, routine),
                                        onDragEnd: handleRoutineDragEnd,
                                        onTouchStart: (e: React.TouchEvent) =>
                                            handleRoutineTouchStart(e, routine),
                                        onTouchEnd: handleRoutineTouchEnd,
                                    };
                                    return (
                                        <div
                                            key={routine.id}
                                            onDragOver={(e) =>
                                                handleRoutineDragOverItem(
                                                    e,
                                                    routine,
                                                )
                                            }
                                            onDrop={(e) =>
                                                handleRoutineDropOnItem(
                                                    e,
                                                    routine,
                                                )
                                            }
                                        >
                                            <RoutineItem
                                                routine={routine}
                                                isLifted={
                                                    !!draggedRoutine &&
                                                    draggedRoutine.id ===
                                                        routine.id
                                                }
                                                onEdit={() =>
                                                    handleEditRoutine(routine)
                                                }
                                                onDelete={() =>
                                                    routineDelete.deleteItem(
                                                        routine.id,
                                                    )
                                                }
                                                onOpen={() =>
                                                    handleOpenRoutine(
                                                        routine.id,
                                                    )
                                                }
                                                dragHandlers={
                                                    routineDragHandlers
                                                }
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    {(!foldersFetch.data || foldersFetch.data.length === 0) &&
                        (!routinesFetch.data ||
                            routinesFetch.data.length === 0) && (
                            <div className="empty-state">
                                <h3>Comienza a organizar tus entrenamientos</h3>
                                <p>
                                    Crea rutinas personalizadas con los
                                    ejercicios que necesitas para alcanzar tus
                                    objetivos.
                                </p>
                                <div className="empty-state-actions">
                                    <button
                                        onClick={handleCreateRoutine}
                                        className="btn-primary-action"
                                    >
                                        <Plus size={20} /> Crear mi primera
                                        rutina
                                    </button>
                                    <p className="empty-state-hint">
                                        También puedes crear carpetas para
                                        organizar rutinas por objetivos o fases
                                    </p>
                                </div>
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
