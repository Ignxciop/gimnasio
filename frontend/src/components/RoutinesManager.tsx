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
    const [isTouchDragging, setIsTouchDragging] = useState<boolean>(false);
    const [longPressTimer, setLongPressTimer] = useState<number | null>(null);
    const [longPressTarget, setLongPressTarget] = useState<{
        type: "folder" | "routine";
        id: number;
    } | null>(null);

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

    const handleFolderDragStart = (e: React.DragEvent, folder: Folder) => {
        if (
            longPressTarget?.type === "folder" &&
            longPressTarget.id === folder.id
        ) {
            setDraggedFolder(folder);
            if (e.dataTransfer) {
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", folder.id.toString());
            }
        }
    };

    const handleFolderDragEnd = () => {
        setDraggedFolder(null);
        setDragOverFolder(null);
        setLongPressTarget(null);
    };

    const handleFolderMouseDown = (e: React.MouseEvent, folder: Folder) => {
        const target = e.target as HTMLElement;
        if (!target.closest(".drag-icon")) {
            return;
        }
        if (longPressTimer) {
            return;
        }
        const timer = window.setTimeout(() => {
            setLongPressTarget({ type: "folder", id: folder.id });
        }, 500);
        setLongPressTimer(timer);
    };

    const handleFolderMouseUp = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            setLongPressTimer(null);
        }
        if (!draggedFolder) {
            setLongPressTarget(null);
        }
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
        e.preventDefault();
        e.stopPropagation();
        setDragOverFolder(null);

        if (draggedRoutine) {
            await handleRoutineDropInFolder(e, targetFolder.id);
            return;
        }

        if (!draggedFolder || draggedFolder.id === targetFolder.id) {
            setDraggedFolder(null);
            setLongPressTarget(null);
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
        setLongPressTarget(null);
    };

    const handleRoutineDragStart = (e: React.DragEvent, routine: Routine) => {
        if (
            longPressTarget?.type === "routine" &&
            longPressTarget.id === routine.id
        ) {
            setDraggedRoutine(routine);
            if (e.dataTransfer) {
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", routine.id.toString());
            }
        }
    };

    const handleRoutineDragEnd = () => {
        setDraggedRoutine(null);
        setLongPressTarget(null);
    };

    const handleRoutineMouseDown = (e: React.MouseEvent, routine: Routine) => {
        e.stopPropagation();
        const target = e.target as HTMLElement;
        if (!target.closest(".drag-icon")) {
            return;
        }
        if (longPressTimer) {
            clearTimeout(longPressTimer);
        }
        const timer = window.setTimeout(() => {
            setLongPressTarget({ type: "routine", id: routine.id });
        }, 500);
        setLongPressTimer(timer);
    };

    const handleRoutineMouseUp = (e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
        }
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            setLongPressTimer(null);
        }
        if (!draggedRoutine) {
            setLongPressTarget(null);
        }
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

    const handleFolderTouchStart = (e: React.TouchEvent, folder: Folder) => {
        const target = e.target as HTMLElement;
        if (!target.closest(".drag-icon")) {
            return;
        }
        if (longPressTimer) {
            return;
        }
        const timer = window.setTimeout(() => {
            setLongPressTarget({ type: "folder", id: folder.id });
            setDraggedFolder(folder);
            setIsTouchDragging(true);
        }, 500);
        setLongPressTimer(timer);
    };

    const handleFolderTouchMove = (e: React.TouchEvent) => {
        if (!isTouchDragging || !draggedFolder) return;

        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);

        const folderItem = element?.closest(".folder-item");
        if (folderItem) {
            const folderId = parseInt(
                folderItem.getAttribute("data-folder-id") || "0"
            );
            if (folderId && draggedFolder && folderId !== draggedFolder.id) {
                setDragOverFolder(folderId);
            }
        } else {
            setDragOverFolder(null);
        }
    };

    const handleFolderTouchEnd = async (e: React.TouchEvent) => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            setLongPressTimer(null);
        }

        if (!isTouchDragging || !draggedFolder) {
            setIsTouchDragging(false);
            setDraggedFolder(null);
            setDragOverFolder(null);
            setLongPressTarget(null);
            return;
        }

        const touch = e.changedTouches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);

        const folderItem = element?.closest(".folder-item");
        if (folderItem && dragOverFolder) {
            const targetFolderId = parseInt(
                folderItem.getAttribute("data-folder-id") || "0"
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
        setLongPressTarget(null);
    };

    const handleRoutineTouchStart = (e: React.TouchEvent, routine: Routine) => {
        e.stopPropagation();
        const target = e.target as HTMLElement;
        if (!target.closest(".drag-icon")) {
            return;
        }
        if (longPressTimer) {
            clearTimeout(longPressTimer);
        }
        const timer = window.setTimeout(() => {
            setLongPressTarget({ type: "routine", id: routine.id });
            setDraggedRoutine(routine);
            setIsTouchDragging(true);
        }, 500);
        setLongPressTimer(timer);
    };

    const handleRoutineTouchMove = (e: React.TouchEvent) => {
        if (!isTouchDragging || !draggedRoutine) return;
        e.stopPropagation();
    };

    const handleRoutineTouchEnd = async (e: React.TouchEvent) => {
        e.stopPropagation();
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            setLongPressTimer(null);
        }

        if (!isTouchDragging || !draggedRoutine) {
            setIsTouchDragging(false);
            setDraggedRoutine(null);
            setLongPressTarget(null);
            return;
        }

        const touch = e.changedTouches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);

        const routineItem = element?.closest(".routine-item");
        const folderItem = element?.closest(".folder-item");
        const noFolderSection = element?.closest(".no-folder-section");

        const token = authService.getToken();
        if (!token) {
            setIsTouchDragging(false);
            setDraggedRoutine(null);
            setLongPressTarget(null);
            return;
        }

        const routines = routinesFetch.data || [];

        if (routineItem && !folderItem) {
            const targetRoutineId = parseInt(
                routineItem.getAttribute("data-routine-id") || "0"
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
        } else if (folderItem) {
            const targetFolderId = parseInt(
                folderItem.getAttribute("data-folder-id") || "0"
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
        } else if (noFolderSection) {
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
        setLongPressTarget(null);
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
                            <FolderIcon size={20} />
                            Nueva Carpeta
                        </button>
                        <button
                            onClick={handleCreateRoutine}
                            className="btn-create-routine"
                        >
                            <FileText size={20} />
                            Nueva Rutina
                        </button>
                    </div>
                </div>

                <div className="rutinas-content">
                    {foldersFetch.data && foldersFetch.data.length > 0 && (
                        <>
                            {foldersFetch.data.map((folder) => (
                                <FolderItem
                                    key={folder.id}
                                    folder={folder}
                                    isDragOver={dragOverFolder === folder.id}
                                    isLifted={
                                        longPressTarget?.type === "folder" &&
                                        longPressTarget.id === folder.id
                                    }
                                    onEdit={() => handleEditFolder(folder)}
                                    onDelete={() =>
                                        folderDelete.deleteItem(folder.id)
                                    }
                                    onDragStart={(e) =>
                                        handleFolderDragStart(e, folder)
                                    }
                                    onDragEnd={handleFolderDragEnd}
                                    onDragOver={(e) =>
                                        handleFolderDragOver(e, folder)
                                    }
                                    onDragLeave={handleFolderDragLeave}
                                    onDrop={(e) => handleFolderDrop(e, folder)}
                                    onMouseDown={(e) =>
                                        handleFolderMouseDown(e, folder)
                                    }
                                    onMouseUp={handleFolderMouseUp}
                                    onMouseLeave={handleFolderMouseUp}
                                    onTouchStart={(e) =>
                                        handleFolderTouchStart(e, folder)
                                    }
                                    onTouchMove={handleFolderTouchMove}
                                    onTouchEnd={handleFolderTouchEnd}
                                >
                                    <div
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
                                                <RoutineItem
                                                    key={routine.id}
                                                    routine={routine}
                                                    isLifted={
                                                        longPressTarget?.type ===
                                                            "routine" &&
                                                        longPressTarget.id ===
                                                            routine.id
                                                    }
                                                    onEdit={() =>
                                                        handleEditRoutine(
                                                            routine
                                                        )
                                                    }
                                                    onDelete={() =>
                                                        routineDelete.deleteItem(
                                                            routine.id
                                                        )
                                                    }
                                                    onOpen={() =>
                                                        handleOpenRoutine(
                                                            routine.id
                                                        )
                                                    }
                                                    onDragStart={(e) =>
                                                        handleRoutineDragStart(
                                                            e,
                                                            routine
                                                        )
                                                    }
                                                    onDragEnd={
                                                        handleRoutineDragEnd
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
                                                    onMouseDown={(e) =>
                                                        handleRoutineMouseDown(
                                                            e,
                                                            routine
                                                        )
                                                    }
                                                    onMouseUp={
                                                        handleRoutineMouseUp
                                                    }
                                                    onMouseLeave={
                                                        handleRoutineMouseUp
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
                                                />
                                            )
                                        )}
                                    </div>
                                </FolderItem>
                            ))}
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
                                {getRoutinesByFolder(null).map((routine) => (
                                    <RoutineItem
                                        key={routine.id}
                                        routine={routine}
                                        isLifted={
                                            longPressTarget?.type ===
                                                "routine" &&
                                            longPressTarget.id === routine.id
                                        }
                                        onEdit={() =>
                                            handleEditRoutine(routine)
                                        }
                                        onDelete={() =>
                                            routineDelete.deleteItem(routine.id)
                                        }
                                        onOpen={() =>
                                            handleOpenRoutine(routine.id)
                                        }
                                        onDragStart={(e) =>
                                            handleRoutineDragStart(e, routine)
                                        }
                                        onDragEnd={handleRoutineDragEnd}
                                        onDragOver={handleRoutineDragOver}
                                        onDrop={(e) =>
                                            handleRoutineDropOnRoutine(
                                                e,
                                                routine
                                            )
                                        }
                                        onMouseDown={(e) =>
                                            handleRoutineMouseDown(e, routine)
                                        }
                                        onMouseUp={handleRoutineMouseUp}
                                        onMouseLeave={handleRoutineMouseUp}
                                        onTouchStart={(e) =>
                                            handleRoutineTouchStart(e, routine)
                                        }
                                        onTouchMove={handleRoutineTouchMove}
                                        onTouchEnd={handleRoutineTouchEnd}
                                    />
                                ))}
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
                                        <Plus size={20} />
                                        Crear mi primera rutina
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
