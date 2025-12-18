import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import "./card.css";

interface BaseItem {
    id: number;
    name: string;
}

interface CardProps<T extends BaseItem> {
    item: T;
    onEdit: (item: T) => void;
    onDelete: (id: number) => void;
    loading: number | null;
    children?: React.ReactNode;
}

export function Card<T extends BaseItem>({
    item,
    onEdit,
    onDelete,
    loading,
    children,
}: CardProps<T>) {
    return (
        <div className="card">
            <div className="card__header">
                <h3 className="card__name">{item.name}</h3>
                <div className="card__actions">
                    <button
                        onClick={() => onEdit(item)}
                        disabled={loading === item.id}
                        className="card__button card__button--edit"
                        title="Editar"
                    >
                        <Edit2 size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(item.id)}
                        disabled={loading === item.id}
                        className="card__button card__button--delete"
                        title="Eliminar"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
            {children && <div className="card__content">{children}</div>}
        </div>
    );
}

interface CardListProps {
    children: React.ReactNode;
    emptyMessage?: string;
    isEmpty?: boolean;
}

export const CardList: React.FC<CardListProps> = ({
    children,
    emptyMessage = "No hay elementos registrados",
    isEmpty = false,
}) => {
    if (isEmpty) {
        return (
            <div className="card-list__empty">
                <p>{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="card-list">
            <div className="card-list__grid">{children}</div>
        </div>
    );
};
