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
    dragHandlers: React.HTMLAttributes<HTMLSpanElement>;
}

export function RoutineItem({
    routine,
    isLifted = false,
    onEdit,
    onDelete,
    onOpen,
    dragHandlers,
}: RoutineItemProps) {
    return (
        <div
            className={`routine-item ${isLifted ? "lifted" : ""}`}
            data-routine-id={routine.id}
        >
            <div className="routine-left">
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
                    <GripVertical size={16} className="drag-icon" />
                </span>
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
