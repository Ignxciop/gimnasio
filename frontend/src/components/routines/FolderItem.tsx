import { GripVertical, Folder, Pencil, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { ActionMenu } from "../ui/ActionMenu";

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
    dragHandlers: React.HTMLAttributes<HTMLSpanElement>;
}

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
    dragHandlers: React.HTMLAttributes<HTMLSpanElement>;
    onDragOver?: React.DragEventHandler<HTMLDivElement>;
    onDrop?: React.DragEventHandler<HTMLDivElement>;
}

export function FolderItem({
    folder,
    children,
    isDragOver,
    isLifted = false,
    onEdit,
    onDelete,
    dragHandlers,
    onDragOver,
    onDrop,
}: FolderItemProps) {
    return (
        <div
            className={`folder-item ${isDragOver ? "drag-over" : ""} ${isLifted ? "lifted" : ""}`}
            data-folder-id={folder.id}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            <div className="folder-header-row">
                <div className="folder-left">
                    <span
                        draggable={true}
                        {...dragHandlers}
                        className="drag-icon-wrapper"
                        tabIndex={0}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            cursor: "grab",
                        }}
                    >
                        <GripVertical size={18} className="drag-icon" />
                    </span>
                    <Folder size={20} className="folder-icon" />
                    <h3 className="folder-name" title={folder.name}>
                        {folder.name}
                    </h3>
                </div>
                <div className="folder-right">
                    <ActionMenu menuId={`folder-${folder.id}`}>
                        <button onClick={onEdit} type="button">
                            <Pencil size={16} /> Editar
                        </button>
                        <button
                            onClick={onDelete}
                            type="button"
                            className="danger"
                        >
                            <Trash2 size={16} /> Eliminar
                        </button>
                    </ActionMenu>
                </div>
            </div>
            {folder.description && (
                <p className="folder-description">{folder.description}</p>
            )}
            <div className="folder-routines">{children}</div>
        </div>
    );
}
