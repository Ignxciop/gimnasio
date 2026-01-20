import React from "react";
import { AlertTriangle } from "lucide-react";
import { Modal } from "./Modal";
import "./confirmDialog.css";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirmar acción",
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    variant = "danger",
}) => {
    console.log("ConfirmDialog render:", { isOpen, title, message });
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="confirm-dialog">
                <div
                    className={`confirm-dialog__icon confirm-dialog__icon--${variant}`}
                >
                    <AlertTriangle size={48} />
                </div>
                <p className="confirm-dialog__message">{message}</p>
                <div className="confirm-dialog__actions">
                    <button
                        onClick={onClose}
                        className="confirm-dialog__button confirm-dialog__button--cancel"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`confirm-dialog__button confirm-dialog__button--confirm confirm-dialog__button--${variant}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
