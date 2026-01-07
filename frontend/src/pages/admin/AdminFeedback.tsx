import React, { useState, useEffect, useMemo } from "react";
import { Select } from "../../components/ui/Select";
import { SearchInput } from "../../components/ui/SearchInput";
import { feedbackService } from "../../services/feedbackService";
import { authService } from "../../services/authService";
import { useFetch } from "../../hooks/useFetch";
import { useToast } from "../../hooks/useToast";
import {
    MessageSquare,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Clock,
} from "lucide-react";
import type {
    FeedbackWithUser,
    UpdateFeedbackStatusRequest,
} from "../../types/feedback.types";
import {
    FEEDBACK_TYPE_LABELS,
    FEEDBACK_STATUS_LABELS,
} from "../../types/feedback.types";
import { LOADING_MESSAGES } from "../../config/messages";
import "../../styles/adminFeedback.css";

export const AdminFeedback: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedFeedback, setSelectedFeedback] =
        useState<FeedbackWithUser | null>(null);

    const { showToast } = useToast();

    const fetchFeedbacks = async () => {
        const token = authService.getToken();
        if (!token) throw new Error("No token");

        const type = typeFilter !== "all" ? typeFilter : undefined;
        const status = statusFilter !== "all" ? statusFilter : undefined;

        return feedbackService.getAllFeedbacks(token, type, status);
    };

    const feedbacksFetch = useFetch<FeedbackWithUser[]>({
        fetchFn: fetchFeedbacks,
    });

    useEffect(() => {
        feedbacksFetch.execute();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [typeFilter, statusFilter]);

    const handleStatusChange = async (
        feedbackId: number,
        newStatus: string
    ) => {
        const token = authService.getToken();
        if (!token) return;

        try {
            const statusData: UpdateFeedbackStatusRequest = {
                status: newStatus as UpdateFeedbackStatusRequest["status"],
            };
            await feedbackService.updateFeedbackStatus(
                feedbackId,
                statusData,
                token
            );
            showToast("success", "Estado actualizado correctamente");
            feedbacksFetch.execute();
            if (selectedFeedback?.id === feedbackId) {
                setSelectedFeedback(null);
            }
        } catch (error) {
            showToast(
                "error",
                error instanceof Error
                    ? error.message
                    : "Error al actualizar estado"
            );
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending":
                return (
                    <Clock
                        size={16}
                        className="status-icon status-icon--pending"
                    />
                );
            case "in_review":
                return (
                    <AlertCircle
                        size={16}
                        className="status-icon status-icon--review"
                    />
                );
            case "resolved":
                return (
                    <CheckCircle2
                        size={16}
                        className="status-icon status-icon--resolved"
                    />
                );
            case "dismissed":
                return (
                    <XCircle
                        size={16}
                        className="status-icon status-icon--dismissed"
                    />
                );
            default:
                return null;
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "suggestion":
                return (
                    <MessageSquare
                        size={16}
                        className="type-icon type-icon--suggestion"
                    />
                );
            case "bug_report":
                return (
                    <AlertCircle
                        size={16}
                        className="type-icon type-icon--bug"
                    />
                );
            default:
                return null;
        }
    };

    const filteredFeedbacks = useMemo(() => {
        const feedbacks = feedbacksFetch.data || [];
        return feedbacks.filter((feedback) => {
            const matchesSearch =
                searchTerm === "" ||
                feedback.user.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                feedback.user.lastname
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                feedback.user.username
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                feedback.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                (feedback.title &&
                    feedback.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()));

            return matchesSearch;
        });
    }, [feedbacksFetch.data, searchTerm]);

    return (
        <section className="admin-feedback">
            <div className="admin-feedback__header">
                <div className="admin-feedback__title-section">
                    <h1 className="admin-feedback__title">
                        Administración de Feedback
                    </h1>
                    <p className="admin-feedback__subtitle">
                        Gestiona sugerencias y reportes de usuarios
                    </p>
                </div>

                <div className="admin-feedback__filters">
                    <SearchInput
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Buscar por usuario o contenido..."
                        className="admin-feedback__search"
                    />

                    <div className="admin-feedback__filter-group">
                        <Select
                            value={typeFilter}
                            onChange={(value) => {
                                if (Array.isArray(value)) return;
                                setTypeFilter(value);
                            }}
                            options={[
                                { value: "all", label: "Todos los tipos" },
                                { value: "suggestion", label: "Sugerencias" },
                                { value: "bug_report", label: "Reportes" },
                            ]}
                            className="admin-feedback__select"
                        />

                        <Select
                            value={statusFilter}
                            onChange={(value) => {
                                if (Array.isArray(value)) return;
                                setStatusFilter(value);
                            }}
                            options={[
                                { value: "all", label: "Todos los estados" },
                                { value: "pending", label: "Pendiente" },
                                { value: "in_review", label: "En Revisión" },
                                { value: "resolved", label: "Resuelto" },
                                { value: "dismissed", label: "Descartado" },
                            ]}
                            className="admin-feedback__select"
                        />
                    </div>
                </div>

                <div className="admin-feedback__results">
                    Mostrando {filteredFeedbacks.length} de{" "}
                    {feedbacksFetch.data?.length || 0} feedbacks
                </div>
            </div>

            {feedbacksFetch.loading ? (
                <div className="admin-feedback__loading">
                    {LOADING_MESSAGES.GENERIC}
                </div>
            ) : (
                <div className="admin-feedback__grid">
                    {filteredFeedbacks.map((feedback) => (
                        <div key={feedback.id} className="feedback-card">
                            <div className="feedback-card__header">
                                <div className="feedback-card__meta">
                                    <div className="feedback-card__type">
                                        {getTypeIcon(feedback.type)}
                                        <span>
                                            {
                                                FEEDBACK_TYPE_LABELS[
                                                    feedback.type
                                                ]
                                            }
                                        </span>
                                    </div>
                                    <div className="feedback-card__status">
                                        {getStatusIcon(feedback.status)}
                                        <span>
                                            {
                                                FEEDBACK_STATUS_LABELS[
                                                    feedback.status
                                                ]
                                            }
                                        </span>
                                    </div>
                                </div>
                                <div className="feedback-card__date">
                                    {new Date(
                                        feedback.createdAt
                                    ).toLocaleDateString("es-ES", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </div>
                            </div>

                            <div className="feedback-card__content">
                                {feedback.title && (
                                    <h3 className="feedback-card__title">
                                        {feedback.title}
                                    </h3>
                                )}
                                <p className="feedback-card__description">
                                    {feedback.description}
                                </p>
                            </div>

                            <div className="feedback-card__footer">
                                <div className="feedback-card__user">
                                    <span className="feedback-card__user-name">
                                        {feedback.user.name}{" "}
                                        {feedback.user.lastname}
                                    </span>
                                    <span className="feedback-card__username">
                                        @{feedback.user.username}
                                    </span>
                                </div>

                                <Select
                                    value={feedback.status}
                                    onChange={(value) => {
                                        if (Array.isArray(value)) return;
                                        handleStatusChange(feedback.id, value);
                                    }}
                                    options={[
                                        {
                                            value: "pending",
                                            label: "Pendiente",
                                        },
                                        {
                                            value: "in_review",
                                            label: "En Revisión",
                                        },
                                        {
                                            value: "resolved",
                                            label: "Resuelto",
                                        },
                                        {
                                            value: "dismissed",
                                            label: "Descartado",
                                        },
                                    ]}
                                    className="feedback-card__status-select"
                                />
                            </div>
                        </div>
                    ))}

                    {filteredFeedbacks.length === 0 &&
                        !feedbacksFetch.loading && (
                            <div className="admin-feedback__empty">
                                <MessageSquare size={48} />
                                <p>
                                    No se encontraron feedbacks con los filtros
                                    seleccionados
                                </p>
                            </div>
                        )}
                </div>
            )}
        </section>
    );
};
