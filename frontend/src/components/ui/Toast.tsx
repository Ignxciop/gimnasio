import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import type { ToastType } from "../../contexts/toast.context";
import "./toast.css";

interface ToastProps {
    type: ToastType;
    message: string;
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ type, message, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 10);

        const duration = 5000;
        const interval = 50;
        const decrement = (interval / duration) * 100;

        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                const next = prev - decrement;
                if (next <= 0) {
                    clearInterval(progressInterval);
                    setIsVisible(false);
                    setTimeout(onClose, 300);
                    return 0;
                }
                return next;
            });
        }, interval);

        return () => clearInterval(progressInterval);
    }, [onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const icons: Record<ToastType, React.ReactElement> = {
        success: <CheckCircle size={20} />,
        error: <XCircle size={20} />,
        warning: <AlertTriangle size={20} />,
        info: <Info size={20} />,
    };

    return (
        <div
            className={`toast toast--${type} ${
                isVisible ? "toast--visible" : ""
            }`}
        >
            <div className="toast__icon">{icons[type]}</div>
            <p className="toast__message">{message}</p>
            <button onClick={handleClose} className="toast__close">
                <X size={16} />
            </button>
            <div
                className="toast__progress"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
};
