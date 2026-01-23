import { GripVertical, FileText, Pencil, Trash2 } from "lucide-react";
import { ActionMenu } from "../ui/ActionMenu";

interface RoutineItemProps {
    routine: {
        id: number;
        name: string;
    };
    isLifted?: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onOpen: () => void;
    onDragStart: (e: React.DragEvent) => void;
    onDragEnd?: () => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    onMouseDown?: (e: React.MouseEvent) => void;
    onMouseUp?: () => void;
    onMouseLeave?: () => void;
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
}

export function RoutineItem({
    routine,
    isLifted = false,
    onEdit,
    onDelete,
    onOpen,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
}: RoutineItemProps) {
    return (
        <div
            className={`routine-item ${isLifted ? "lifted" : ""}`}
            data-routine-id={routine.id}
            draggable={true}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <div className="routine-left">
                <GripVertical size={16} className="drag-icon" />
                <FileText size={18} className="routine-icon" />
                <span
                    className="routine-name"
                    onClick={onOpen}
                    title={routine.name}
                >
                    {routine.name}
                </span>
            </div>
            <div className="routine-right">
                <ActionMenu menuId={`routine-${routine.id}`}>
                    <button onClick={onEdit} type="button">
                        <Pencil size={16} /> Editar
                    </button>
                    <button onClick={onDelete} type="button" className="danger">
                        <Trash2 size={16} /> Eliminar
                    </button>
                </ActionMenu>
            </div>
        </div>
    );
}
