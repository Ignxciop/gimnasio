import { useState, useCallback } from "react";

export function useModal<T = unknown>() {
    const [isOpen, setIsOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<T | null>(null);

    const openModal = useCallback(() => {
        setEditingItem(null);
        setIsOpen(true);
    }, []);

    const openEditModal = useCallback((item: T) => {
        setEditingItem(item);
        setIsOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setEditingItem(null);
    }, []);

    return {
        isOpen,
        editingItem,
        openModal,
        openEditModal,
        closeModal,
    };
}
