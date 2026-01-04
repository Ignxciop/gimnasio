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

export default function RoutinesManager() {
    const navigate = useNavigate();
    const folderModal = useModal<Folder>();
    const routineModal = useModal<Routine>();
    const [draggedFolder, setDraggedFolder] = useState<Folder | null>(null);
    const [draggedRoutine, setDraggedRoutine] = useState<Routine | null>(null);
    const [dragOverFolder, setDragOverFolder] = useState<number | null>(null);
    const [isTouchDragging, setIsTouchDragging] = useState<boolean>(false);

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
        }
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
        }
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
        }
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
        }
    );

    const reorderFolders = useApiCall(
        (folders: { id: number; order: number }[], token: string) =>
            folderService.reorder(folders, token),
        {
            successMessage: SUCCESS_MESSAGES.ROUTINES.ORDER_UPDATED,
            errorMessage: ERROR_MESSAGES.ROUTINES.UPDATE_ORDER,
            onSuccess: () => foldersFetch.execute(),
        }
    );

    const moveRoutine = useApiCall(
        (
            routines: { id: number; order: number; folderId: number | null }[],
            token: string
        ) => routineService.reorder(routines, token),
        {
            successMessage: SUCCESS_MESSAGES.ROUTINES.MOVED,
            errorMessage: ERROR_MESSAGES.ROUTINES.MOVE,
            onSuccess: () => routinesFetch.execute(),
        }
    );

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
                token
            );
        } else {
            await createRoutine.execute(data, token);
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

        const token = authService.getToken();
        if (!token) return;

        const folders = foldersFetch.data || [];
        const draggedIndex = folders.findIndex(
            (f) => f.id === draggedFolder.id
        );
        const targetIndex = folders.findIndex((f) => f.id === targetFolder.id);

        const reorderedFolders = [...folders];
        reorderedFolders.splice(draggedIndex, 1);
        reorderedFolders.splice(targetIndex, 0, draggedFolder);

        const updatedFolders = reorderedFolders.map((folder, index) => ({
            id: folder.id,
            order: index,
        }));

        await reorderFolders.execute(updatedFolders, token);
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

        await moveRoutine.execute(updatedRoutines, token);
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

        const token = authService.getToken();
        if (!token) return;

        const routines = routinesFetch.data || [];
        const sameFolder = draggedRoutine.folderId === targetRoutine.folderId;
        const folderRoutines = routines.filter(
            (r) => r.folderId === targetRoutine.folderId
        );

        let updatedRoutines;

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

            updatedRoutines = reordered.map((routine, index) => ({
                id: routine.id,
                order: index,
                folderId: routine.folderId ?? null,
            }));
        } else {
            const targetIndex = folderRoutines.findIndex(
                (r) => r.id === targetRoutine.id
            );
            const otherRoutines = folderRoutines.filter(
                (r) => r.id !== targetRoutine.id
            );
            otherRoutines.splice(targetIndex, 0, draggedRoutine);

            updatedRoutines = otherRoutines.map((routine, index) => ({
                id: routine.id,
                order: index,
                folderId: targetRoutine.folderId ?? null,
            }));
        }

        await moveRoutine.execute(updatedRoutines, token);
        setDraggedRoutine(null);
    };

    const handleFolderTouchStart = (_e: React.TouchEvent, folder: Folder) => {
        setDraggedFolder(folder);
        setIsTouchDragging(true);
    };

    const handleFolderTouchMove = (e: React.TouchEvent) => {
        if (!isTouchDragging) return;
        e.preventDefault();

        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);

        const folderCard = element?.closest(".folder-card");
        if (folderCard) {
            const folderId = parseInt(
                folderCard.getAttribute("data-folder-id") || "0"
            );
            if (folderId && draggedFolder && folderId !== draggedFolder.id) {
                setDragOverFolder(folderId);
            }
        } else {
            setDragOverFolder(null);
        }
    };

    const handleFolderTouchEnd = async (e: React.TouchEvent) => {
        if (!isTouchDragging || !draggedFolder) {
            setIsTouchDragging(false);
            setDraggedFolder(null);
            setDragOverFolder(null);
            return;
        }

        const touch = e.changedTouches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);

        const folderCard = element?.closest(".folder-card");
        if (folderCard && dragOverFolder) {
            const targetFolderId = parseInt(
                folderCard.getAttribute("data-folder-id") || "0"
            );
            const folders = foldersFetch.data || [];
            const targetFolder = folders.find((f) => f.id === targetFolderId);

            if (targetFolder && targetFolder.id !== draggedFolder.id) {
                const token = authService.getToken();
                if (token) {
                    const draggedIndex = folders.findIndex(
                        (f) => f.id === draggedFolder.id
                    );
                    const targetIndex = folders.findIndex(
                        (f) => f.id === targetFolder.id
                    );

                    const reorderedFolders = [...folders];
                    reorderedFolders.splice(draggedIndex, 1);
                    reorderedFolders.splice(targetIndex, 0, draggedFolder);

                    const updatedFolders = reorderedFolders.map(
                        (folder, index) => ({
                            id: folder.id,
                            order: index,
                        })
                    );

                    await reorderFolders.execute(updatedFolders, token);
                }
            }
        }

        setIsTouchDragging(false);
        setDraggedFolder(null);
        setDragOverFolder(null);
        setDraggedRoutine(null);
    };

    const handleRoutineTouchStart = (
        _e: React.TouchEvent,
        routine: Routine
    ) => {
        setDraggedRoutine(routine);
        setIsTouchDragging(true);
    };

    const handleRoutineTouchMove = (e: React.TouchEvent) => {
        if (!isTouchDragging) return;
        e.preventDefault();
    };

    const handleRoutineTouchEnd = async (e: React.TouchEvent) => {
        if (!isTouchDragging || !draggedRoutine) {
            setIsTouchDragging(false);
            setDraggedRoutine(null);
            return;
        }

        const touch = e.changedTouches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);

        const routineCard = element?.closest(".routine-card");
        const folderCard = element?.closest(".folder-card");
        const routinesListInFolder = element?.closest(".routines-list");

        const token = authService.getToken();
        if (!token) {
            setIsTouchDragging(false);
            setDraggedRoutine(null);
            return;
        }

        const routines = routinesFetch.data || [];

        if (routineCard) {
            const targetRoutineId = parseInt(
                routineCard.getAttribute("data-routine-id") || "0"
            );
            const targetRoutine = routines.find(
                (r) => r.id === targetRoutineId
            );

            if (targetRoutine && targetRoutine.id !== draggedRoutine.id) {
                const sameFolder =
                    draggedRoutine.folderId === targetRoutine.folderId;
                const folderRoutines = routines.filter(
                    (r) => r.folderId === targetRoutine.folderId
                );

                let updatedRoutines;

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

                    updatedRoutines = reordered.map((routine, index) => ({
                        id: routine.id,
                        order: index,
                        folderId: routine.folderId ?? null,
                    }));
                } else {
                    const targetIndex = folderRoutines.findIndex(
                        (r) => r.id === targetRoutine.id
                    );
                    const otherRoutines = folderRoutines.filter(
                        (r) => r.id !== targetRoutine.id
                    );
                    otherRoutines.splice(targetIndex, 0, draggedRoutine);

                    updatedRoutines = otherRoutines.map((routine, index) => ({
                        id: routine.id,
                        order: index,
                        folderId: targetRoutine.folderId ?? null,
                    }));
                }

                await moveRoutine.execute(updatedRoutines, token);
            }
        } else if (folderCard && routinesListInFolder) {
            const targetFolderId = parseInt(
                folderCard.getAttribute("data-folder-id") || "0"
            );

            if (draggedRoutine.folderId !== targetFolderId) {
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

                await moveRoutine.execute(updatedRoutines, token);
            }
        } else if (element?.closest(".no-folder-section")) {
            if (draggedRoutine.folderId !== null) {
                const targetRoutines = routines.filter(
                    (r) => r.folderId === null
                );

                const updatedRoutines = [
                    {
                        id: draggedRoutine.id,
                        order: targetRoutines.length,
                        folderId: null,
                    },
                ];

                await moveRoutine.execute(updatedRoutines, token);
            }
        }

        setIsTouchDragging(false);
        setDraggedRoutine(null);
    };

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
                                        data-folder-id={folder.id}
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
                                        onTouchStart={(e) =>
                                            handleFolderTouchStart(e, folder)
                                        }
                                        onTouchMove={handleFolderTouchMove}
                                        onTouchEnd={handleFolderTouchEnd}
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
                                                        data-routine-id={
                                                            routine.id
                                                        }
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
                                                        onTouchStart={(e) =>
                                                            handleRoutineTouchStart(
                                                                e,
                                                                routine
                                                            )
                                                        }
                                                        onTouchMove={
                                                            handleRoutineTouchMove
                                                        }
                                                        onTouchEnd={
                                                            handleRoutineTouchEnd
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
                                        data-routine-id={routine.id}
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
                                        onTouchStart={(e) =>
                                            handleRoutineTouchStart(e, routine)
                                        }
                                        onTouchMove={handleRoutineTouchMove}
                                        onTouchEnd={handleRoutineTouchEnd}
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
