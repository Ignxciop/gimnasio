import { GripVertical, Check, Trash2 } from "lucide-react";
import { formatWeight, kgToLbs } from "../../utils/unitConverter";

interface ActiveSetRowProps {
    set: {
        id: number;
        exerciseId: number;
        setNumber: number;
        targetWeight: number | null;
        targetRepsMin: number;
        targetRepsMax: number;
        actualWeight: number | null;
        actualReps: number | null;
        completed: boolean;
        isPR: boolean;
        order: number;
    };
    index: number;
    unit: string;
    weightInput: string | undefined;
    isDragging: boolean;
    isLongPressActive: boolean;
    onWeightChange: (value: string) => void;
    onWeightBlur: () => void;
    onRepsChange: (value: string) => void;
    onComplete: () => void;
    onRemove: () => void;
    onDragStart: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
}

export function ActiveSetRow({
    set,
    index,
    unit,
    weightInput,
    isDragging,
    isLongPressActive,
    onWeightChange,
    onWeightBlur,
    onRepsChange,
    onComplete,
    onRemove,
    onDragStart,
    onDragOver,
    onDrop,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
}: ActiveSetRowProps) {
    const getWeightDisplay = () => {
        if (weightInput !== undefined) return weightInput;
        if (set.actualWeight === null) return "";
        const weight =
            unit === "lbs" ? kgToLbs(set.actualWeight) : set.actualWeight;
        return formatWeight(weight).toString();
    };

    const getWeightPlaceholder = () => {
        if (!set.targetWeight) return "0";
        const weight =
            unit === "lbs" ? kgToLbs(set.targetWeight) : set.targetWeight;
        return formatWeight(weight).toString();
    };

    return (
        <div
            data-set-id={set.id}
            className={`set-row ${set.completed ? "completed" : ""} ${
                set.isPR ? "pr" : ""
            } ${isDragging ? "dragging" : ""} ${
                isLongPressActive ? "long-press-active" : ""
            }`}
            draggable
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <GripVertical size={14} className="drag-handle" />
            <span className="set-number">{index + 1}</span>
            <div className="input-wrapper">
                <input
                    type="text"
                    className="set-input"
                    value={getWeightDisplay()}
                    onChange={(e) => onWeightChange(e.target.value)}
                    onBlur={onWeightBlur}
                    disabled={set.completed}
                    placeholder={getWeightPlaceholder()}
                />
                <label className="input-label">{unit.toUpperCase()}</label>
            </div>
            <span className="separator">×</span>
            <div className="input-wrapper">
                <input
                    type="number"
                    className="set-input"
                    value={set.actualReps ?? ""}
                    onChange={(e) => onRepsChange(e.target.value)}
                    disabled={set.completed}
                    placeholder={set.targetRepsMax.toString()}
                />
                <label className="input-label">REPS</label>
            </div>
            <button onClick={onComplete} className="btn-complete-set">
                <Check size={16} />
            </button>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Remove button clicked for set:", set.id);
                    onRemove();
                }}
                className="btn-remove-set"
                title="Eliminar serie"
            >
                <Trash2 size={14} />
            </button>
        </div>
    );
}

export default ActiveSetRow;
