import React from "react";
import { X } from "lucide-react";
import "./modal.css";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal__overlay" onClick={onClose} />
            <div className="modal__content">
                <div className="modal__header">
                    <h2 className="modal__title">{title}</h2>
                    <button
                        onClick={onClose}
                        className="modal__close"
                        type="button"
                    >
                        <X size={24} />
                    </button>
                </div>
                <div className="modal__body">{children}</div>
            </div>
        </div>
    );
};
