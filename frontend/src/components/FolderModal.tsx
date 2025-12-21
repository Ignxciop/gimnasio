import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Folder, FolderFormData } from "../types/routine";
import "./folderModal.css";

interface FolderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: FolderFormData) => void;
    folder?: Folder | null;
}

export default function FolderModal({
    isOpen,
    onClose,
    onSubmit,
    folder,
}: FolderModalProps) {
    const [formData, setFormData] = useState<FolderFormData>({
        name: "",
        description: "",
    });

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    useEffect(() => {
        if (folder) {
            setFormData({
                name: folder.name,
                description: folder.description || "",
            });
        } else {
            setFormData({
                name: "",
                description: "",
            });
        }
    }, [folder]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({ name: "", description: "" });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{folder ? "Editar Carpeta" : "Nueva Carpeta"}</h2>
                    <button onClick={onClose} className="modal-close">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Nombre *</label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            required
                            minLength={2}
                            maxLength={50}
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Descripción</label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            maxLength={200}
                            rows={3}
                        />
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary"
                        >
                            Cancelar
                        </button>
                        <button type="submit" className="btn-primary">
                            {folder ? "Actualizar" : "Crear"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
