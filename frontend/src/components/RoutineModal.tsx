import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Select } from "./ui/Select";
import type { Routine, RoutineFormData, Folder } from "../types/routine";
import "./routineModal.css";

interface RoutineModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: RoutineFormData) => void;
    routine?: Routine | null;
    folders: Folder[];
}

export default function RoutineModal({
    isOpen,
    onClose,
    onSubmit,
    routine,
    folders,
}: RoutineModalProps) {
    const [formData, setFormData] = useState<RoutineFormData>({
        name: "",
        description: "",
        folderId: null,
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
        if (routine) {
            setFormData({
                name: routine.name,
                description: routine.description || "",
                folderId: routine.folderId || null,
            });
        } else {
            setFormData({
                name: "",
                description: "",
                folderId: null,
            });
        }
    }, [routine]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({ name: "", description: "", folderId: null });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{routine ? "Editar Rutina" : "Nueva Rutina"}</h2>
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
                            maxLength={100}
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

                    <div className="form-group">
                        <label htmlFor="folderId">Carpeta</label>
                        <Select
                            value={formData.folderId?.toString() || ""}
                            onChange={(value) =>
                                setFormData({
                                    ...formData,
                                    folderId: value
                                        ? parseInt(value as string)
                                        : null,
                                })
                            }
                            options={[
                                { value: "", label: "Sin carpeta" },
                                ...folders.map((folder) => ({
                                    value: folder.id.toString(),
                                    label: folder.name,
                                })),
                            ]}
                            placeholder="Selecciona una carpeta"
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
                            {routine ? "Actualizar" : "Crear"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
