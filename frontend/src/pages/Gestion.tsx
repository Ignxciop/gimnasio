import React, { useState, useEffect } from "react";
import { Dumbbell, Users, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { EquipmentList } from "../components/EquipmentList";
import { EquipmentModal } from "../components/EquipmentModal";
import { MuscleGroupList } from "../components/MuscleGroupList";
import { MuscleGroupModal } from "../components/MuscleGroupModal";
import { ExerciseList } from "../components/ExerciseList";
import { ExerciseModal } from "../components/ExerciseModal";
import { equipmentService, type Equipment } from "../services/equipmentService";
import {
    muscleGroupService,
    type MuscleGroup,
} from "../services/muscleGroupService";
import { exerciseService, type Exercise } from "../services/exerciseService";
import { authService } from "../services/authService";
import "../styles/gestion.css";

type TabType = "equipamiento" | "grupos" | "ejercicios";

export const Gestion: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>("equipamiento");
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(
        null
    );
    const [editingMuscleGroup, setEditingMuscleGroup] =
        useState<MuscleGroup | null>(null);
    const [editingExercise, setEditingExercise] = useState<Exercise | null>(
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

    const fetchMuscleGroups = async () => {
        const token = authService.getToken();
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setFetchLoading(true);
            const data = await muscleGroupService.getAll(token);
            setMuscleGroups(data);
        } catch (error) {
            console.error("Error al cargar grupos musculares:", error);
        } finally {
            setFetchLoading(false);
        }
    };

    const fetchExercises = async () => {
        const token = authService.getToken();
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setFetchLoading(true);
            const data = await exerciseService.getAll(token);
            setExercises(data);
        } catch (error) {
            console.error("Error al cargar ejercicios:", error);
        } finally {
            setFetchLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === "equipamiento") {
            fetchEquipment();
        } else if (activeTab === "grupos") {
            fetchMuscleGroups();
        } else if (activeTab === "ejercicios") {
            fetchExercises();
            if (equipment.length === 0) fetchEquipment();
            if (muscleGroups.length === 0) fetchMuscleGroups();
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

    const handleAddMuscleGroup = () => {
        setEditingMuscleGroup(null);
        setIsModalOpen(true);
    };

    const handleEditMuscleGroup = (muscleGroup: MuscleGroup) => {
        setEditingMuscleGroup(muscleGroup);
        setIsModalOpen(true);
    };

    const handleSubmitMuscleGroup = async (name: string) => {
        const token = authService.getToken();
        if (!token) return;

        if (editingMuscleGroup) {
            await muscleGroupService.update(editingMuscleGroup.id, name, token);
        } else {
            await muscleGroupService.create(name, token);
        }

        await fetchMuscleGroups();
    };

    const handleDeleteMuscleGroup = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar este grupo muscular?")) return;

        const token = authService.getToken();
        if (!token) return;

        try {
            setLoading(id);
            await muscleGroupService.delete(id, token);
            await fetchMuscleGroups();
        } catch (error) {
            console.error("Error al eliminar grupo muscular:", error);
        } finally {
            setLoading(null);
        }
    };

    const handleAddExercise = () => {
        setEditingExercise(null);
        setIsModalOpen(true);
    };

    const handleEditExercise = (exercise: Exercise) => {
        setEditingExercise(exercise);
        setIsModalOpen(true);
    };

    const handleSubmitExercise = async (
        name: string,
        equipmentId: number,
        muscleGroupId: number
    ) => {
        const token = authService.getToken();
        if (!token) return;

        if (editingExercise) {
            await exerciseService.update(
                editingExercise.id,
                name,
                equipmentId,
                muscleGroupId,
                token
            );
        } else {
            await exerciseService.create(
                name,
                equipmentId,
                muscleGroupId,
                token
            );
        }

        await fetchExercises();
    };

    const handleDeleteExercise = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar este ejercicio?")) return;

        const token = authService.getToken();
        if (!token) return;

        try {
            setLoading(id);
            await exerciseService.delete(id, token);
            await fetchExercises();
        } catch (error) {
            console.error("Error al eliminar ejercicio:", error);
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
                                <button
                                    className="gestion__add-button"
                                    onClick={handleAddMuscleGroup}
                                >
                                    Agregar Grupo Muscular
                                </button>
                            </div>
                            {fetchLoading ? (
                                <div className="gestion__placeholder">
                                    <p>Cargando grupos musculares...</p>
                                </div>
                            ) : (
                                <MuscleGroupList
                                    muscleGroups={muscleGroups}
                                    onEdit={handleEditMuscleGroup}
                                    onDelete={handleDeleteMuscleGroup}
                                    loading={loading}
                                />
                            )}
                        </div>
                    )}

                    {activeTab === "ejercicios" && (
                        <div className="gestion__section">
                            <div className="gestion__section-header">
                                <h2 className="gestion__section-title">
                                    Ejercicios
                                </h2>
                                <button
                                    className="gestion__add-button"
                                    onClick={handleAddExercise}
                                >
                                    Agregar Ejercicio
                                </button>
                            </div>
                            {fetchLoading ? (
                                <div className="gestion__placeholder">
                                    <p>Cargando ejercicios...</p>
                                </div>
                            ) : (
                                <ExerciseList
                                    exercises={exercises}
                                    onEdit={handleEditExercise}
                                    onDelete={handleDeleteExercise}
                                    loading={loading}
                                />
                            )}
                        </div>
                    )}
                </div>

                {activeTab === "equipamiento" && (
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
                )}

                {activeTab === "grupos" && (
                    <MuscleGroupModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={handleSubmitMuscleGroup}
                        muscleGroup={editingMuscleGroup}
                        title={
                            editingMuscleGroup
                                ? "Editar Grupo Muscular"
                                : "Agregar Grupo Muscular"
                        }
                    />
                )}

                {activeTab === "ejercicios" && (
                    <ExerciseModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={handleSubmitExercise}
                        exercise={editingExercise}
                        equipment={equipment}
                        muscleGroups={muscleGroups}
                        title={
                            editingExercise
                                ? "Editar Ejercicio"
                                : "Agregar Ejercicio"
                        }
                    />
                )}
            </section>
        </MainLayout>
    );
};
