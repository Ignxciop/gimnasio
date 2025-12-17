import React, { useState, useEffect } from "react";
import { Dumbbell, Users, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { EquipmentList } from "../components/EquipmentList";
import { EquipmentModal } from "../components/EquipmentModal";
import { equipmentService, type Equipment } from "../services/equipmentService";
import { authService } from "../services/authService";
import "../styles/gestion.css";

type TabType = "equipamiento" | "grupos" | "ejercicios";

export const Gestion: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>("equipamiento");
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(
        null
    );
    const [fetchLoading, setFetchLoading] = useState(false);
    const navigate = useNavigate();

    const fetchEquipment = async () => {
        const token = authService.getToken();
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setFetchLoading(true);
            const data = await equipmentService.getAll(token);
            setEquipment(data);
        } catch (error) {
            console.error("Error al cargar equipamiento:", error);
        } finally {
            setFetchLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === "equipamiento") {
            fetchEquipment();
        }
    }, [activeTab]);

    const handleAddEquipment = () => {
        setEditingEquipment(null);
        setIsModalOpen(true);
    };

    const handleEditEquipment = (equipment: Equipment) => {
        setEditingEquipment(equipment);
        setIsModalOpen(true);
    };

    const handleSubmitEquipment = async (name: string) => {
        const token = authService.getToken();
        if (!token) return;

        if (editingEquipment) {
            await equipmentService.update(editingEquipment.id, name, token);
        } else {
            await equipmentService.create(name, token);
        }

        await fetchEquipment();
    };

    const handleDeleteEquipment = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar este equipamiento?")) return;

        const token = authService.getToken();
        if (!token) return;

        try {
            setLoading(id);
            await equipmentService.delete(id, token);
            await fetchEquipment();
        } catch (error) {
            console.error("Error al eliminar equipamiento:", error);
        } finally {
            setLoading(null);
        }
    };

    return (
        <MainLayout>
            <section className="gestion">
                <div className="gestion__header">
                    <div className="gestion__title-section">
                        <h1 className="gestion__title">
                            Gestión de Entrenamiento
                        </h1>
                        <p className="gestion__subtitle">
                            Administra equipamiento, grupos musculares y
                            ejercicios
                        </p>
                    </div>

                    <div className="gestion__tabs">
                        <button
                            className={`gestion__tab ${
                                activeTab === "equipamiento"
                                    ? "gestion__tab--active"
                                    : ""
                            }`}
                            onClick={() => setActiveTab("equipamiento")}
                        >
                            <Dumbbell size={20} />
                            <span>Equipamiento</span>
                        </button>
                        <button
                            className={`gestion__tab ${
                                activeTab === "grupos"
                                    ? "gestion__tab--active"
                                    : ""
                            }`}
                            onClick={() => setActiveTab("grupos")}
                        >
                            <Users size={20} />
                            <span>Grupos Musculares</span>
                        </button>
                        <button
                            className={`gestion__tab ${
                                activeTab === "ejercicios"
                                    ? "gestion__tab--active"
                                    : ""
                            }`}
                            onClick={() => setActiveTab("ejercicios")}
                        >
                            <Target size={20} />
                            <span>Ejercicios</span>
                        </button>
                    </div>
                </div>

                <div className="gestion__content">
                    {activeTab === "equipamiento" && (
                        <div className="gestion__section">
                            <div className="gestion__section-header">
                                <h2 className="gestion__section-title">
                                    Equipamiento
                                </h2>
                                <button
                                    className="gestion__add-button"
                                    onClick={handleAddEquipment}
                                >
                                    Agregar Equipamiento
                                </button>
                            </div>
                            {fetchLoading ? (
                                <div className="gestion__placeholder">
                                    <p>Cargando equipamiento...</p>
                                </div>
                            ) : (
                                <EquipmentList
                                    equipment={equipment}
                                    onEdit={handleEditEquipment}
                                    onDelete={handleDeleteEquipment}
                                    loading={loading}
                                />
                            )}
                        </div>
                    )}

                    {activeTab === "grupos" && (
                        <div className="gestion__section">
                            <div className="gestion__section-header">
                                <h2 className="gestion__section-title">
                                    Grupos Musculares
                                </h2>
                                <button className="gestion__add-button">
                                    Agregar Grupo Muscular
                                </button>
                            </div>
                            <div className="gestion__placeholder">
                                <Users size={48} />
                                <p>Gestión de grupos musculares próximamente</p>
                            </div>
                        </div>
                    )}

                    {activeTab === "ejercicios" && (
                        <div className="gestion__section">
                            <div className="gestion__section-header">
                                <h2 className="gestion__section-title">
                                    Ejercicios
                                </h2>
                                <button className="gestion__add-button">
                                    Agregar Ejercicio
                                </button>
                            </div>
                            <div className="gestion__placeholder">
                                <Target size={48} />
                                <p>Gestión de ejercicios próximamente</p>
                            </div>
                        </div>
                    )}
                </div>

                <EquipmentModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmitEquipment}
                    equipment={editingEquipment}
                    title={
                        editingEquipment
                            ? "Editar Equipamiento"
                            : "Agregar Equipamiento"
                    }
                />
            </section>
        </MainLayout>
    );
};
