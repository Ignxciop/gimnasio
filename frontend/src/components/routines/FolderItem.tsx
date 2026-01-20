import { GripVertical, Folder, Pencil, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

interface FolderItemProps {
    folder: {
        id: number;
        name: string;
        description?: string | null;
    };
    children: ReactNode;
    isDragOver: boolean;
    isLifted?: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onDragStart: (e: React.DragEvent) => void;
    onDragEnd?: () => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    onMouseDown?: (e: React.MouseEvent) => void;
    onMouseUp?: () => void;
    onMouseLeave?: () => void;
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
}

export function FolderItem({
    folder,
    children,
    isDragOver,
    isLifted = false,
    onEdit,
    onDelete,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDragLeave,
    onDrop,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
}: FolderItemProps) {
    return (
        <div
            className={`folder-item ${isDragOver ? "drag-over" : ""} ${
                isLifted ? "lifted" : ""
            }`}
            data-folder-id={folder.id}
            draggable={true}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <div className="folder-header-row">
                <div className="folder-left">
                    <GripVertical size={18} className="drag-icon" />
                    <Folder size={20} className="folder-icon" />
                    <h3 className="folder-name" title={folder.name}>
                        {folder.name}
                    </h3>
                </div>
                <div className="folder-right">
                    <button
                        onClick={onEdit}
                        className="action-btn"
                        aria-label="Editar"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={onDelete}
                        className="action-btn danger"
                        aria-label="Eliminar"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
            {folder.description && (
                <p className="folder-description">{folder.description}</p>
            )}
            <div className="folder-routines">{children}</div>
        </div>
    );
}
