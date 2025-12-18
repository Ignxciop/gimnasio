import { useState } from "react";
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
    const {
        isOpen: isFolderModalOpen,
        open: openFolderModal,
        close: closeFolderModal,
    } = useModal();
    const {
        isOpen: isRoutineModalOpen,
        open: openRoutineModal,
        close: closeRoutineModal,
    } = useModal();
    const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
    const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(
        null
    );

    const {
        data: folders,
        loading: loadingFolders,
        refetch: refetchFolders,
    } = useFetch<Folder[]>(folderService.getAll);
    const {
        data: routines,
        loading: loadingRoutines,
        refetch: refetchRoutines,
    } = useFetch<Routine[]>(routineService.getAll);

    const handleCreateFolder = () => {
        setSelectedFolder(null);
        openFolderModal();
    };

    const handleEditFolder = (folder: Folder) => {
        setSelectedFolder(folder);
        openFolderModal();
    };

    const handleCreateRoutine = () => {
        setSelectedRoutine(null);
        openRoutineModal();
    };

    const handleEditRoutine = (routine: Routine) => {
        setSelectedRoutine(routine);
        openRoutineModal();
    };

    const handleFolderSubmit = async (data: FolderFormData) => {
        try {
            if (selectedFolder) {
                await folderService.update(selectedFolder.id, data);
                showToast("Carpeta actualizada exitosamente", "success");
            } else {
                await folderService.create(data);
                showToast("Carpeta creada exitosamente", "success");
            }
            refetchFolders();
            closeFolderModal();
        } catch (error) {
            showToast(
                error instanceof Error
                    ? error.message
                    : "Error al guardar carpeta",
                "error"
            );
        }
    };

    const handleRoutineSubmit = async (data: RoutineFormData) => {
        try {
            if (selectedRoutine) {
                await routineService.update(selectedRoutine.id, data);
                showToast("Rutina actualizada exitosamente", "success");
            } else {
                await routineService.create(data);
                showToast("Rutina creada exitosamente", "success");
            }
            refetchRoutines();
            closeRoutineModal();
        } catch (error) {
            showToast(
                error instanceof Error
                    ? error.message
                    : "Error al guardar rutina",
                "error"
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
            showToast("Carpeta eliminada exitosamente", "success");
            refetchFolders();
            refetchRoutines();
        } catch (error) {
            showToast(
                error instanceof Error
                    ? error.message
                    : "Error al eliminar carpeta",
                "error"
            );
        }
    };

    const handleDeleteRoutine = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar esta rutina?")) return;

        try {
            await routineService.delete(id);
            showToast("Rutina eliminada exitosamente", "success");
            refetchRoutines();
        } catch (error) {
            showToast(
                error instanceof Error
                    ? error.message
                    : "Error al eliminar rutina",
                "error"
            );
        }
    };

    const getRoutinesByFolder = (folderId: number | null) => {
        return (
            routines?.filter((routine) => routine.folderId === folderId) || []
        );
    };

    if (loadingFolders || loadingRoutines) {
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
                        {folders && folders.length > 0 && (
                            <>
                                {folders.map((folder) => (
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

                    {(!folders || folders.length === 0) &&
                        (!routines || routines.length === 0) && (
                            <div className="empty-state">
                                <p>No tienes carpetas ni rutinas aún</p>
                                <p>Comienza creando una carpeta o una rutina</p>
                            </div>
                        )}
                </div>
            </div>

            <FolderModal
                isOpen={isFolderModalOpen}
                onClose={closeFolderModal}
                onSubmit={handleFolderSubmit}
                folder={selectedFolder}
            />

            <RoutineModal
                isOpen={isRoutineModalOpen}
                onClose={closeRoutineModal}
                onSubmit={handleRoutineSubmit}
                routine={selectedRoutine}
                folders={folders || []}
            />
        </MainLayout>
    );
}
