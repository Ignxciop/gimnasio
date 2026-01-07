import React, { useEffect } from "react";
import { Users, MessageSquare, AlertCircle } from "lucide-react";
import { adminService } from "../../services/adminService";
import { feedbackService } from "../../services/feedbackService";
import { authService } from "../../services/authService";
import { useFetch } from "../../hooks/useFetch";
import { LOADING_MESSAGES } from "../../config/messages";
import type { User } from "../../types/auth.types";
import type { FeedbackWithUser } from "../../types/feedback.types";
import "../../styles/adminDashboard.css";

export const AdminDashboard: React.FC = () => {
    const usersFetch = useFetch<User[]>({
        fetchFn: adminService.getUsers,
    });

    const fetchAllFeedbacks = async () => {
        const token = authService.getToken();
        if (!token) throw new Error("No token");
        return feedbackService.getAllFeedbacks(token);
    };

    const feedbacksFetch = useFetch<FeedbackWithUser[]>({
        fetchFn: fetchAllFeedbacks,
    });

    useEffect(() => {
        usersFetch.execute();
        feedbacksFetch.execute();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const totalUsers = usersFetch.data?.length || 0;
    const activeUsers = usersFetch.data?.filter((u) => u.is_active).length || 0;

    const feedbacks = feedbacksFetch.data || [];
    const pendingFeedbacks = feedbacks.filter(
        (f) => f.status === "pending"
    ).length;
    const bugReports = feedbacks.filter((f) => f.type === "bug_report").length;
    const activeBugReports = feedbacks.filter(
        (f) =>
            f.type === "bug_report" &&
            f.status !== "resolved" &&
            f.status !== "dismissed"
    ).length;

    const isLoading = usersFetch.loading || feedbacksFetch.loading;

    return (
        <section className="admin-dashboard">
            <div className="admin-dashboard__header">
                <h2 className="admin-dashboard__title">Resumen General</h2>
                <p className="admin-dashboard__subtitle">
                    Vista general del sistema y actividad reciente
                </p>
            </div>

            {isLoading ? (
                <div className="admin-dashboard__loading">
                    {LOADING_MESSAGES.GENERIC}
                </div>
            ) : (
                <div className="admin-dashboard__grid">
                    <div className="stat-card stat-card--users">
                        <div className="stat-card__icon">
                            <Users size={32} />
                        </div>
                        <div className="stat-card__content">
                            <h3 className="stat-card__label">
                                Total de Usuarios
                            </h3>
                            <p className="stat-card__value">{totalUsers}</p>
                            <p className="stat-card__detail">
                                {activeUsers} activos
                            </p>
                        </div>
                    </div>

                    <div className="stat-card stat-card--feedback">
                        <div className="stat-card__icon">
                            <MessageSquare size={32} />
                        </div>
                        <div className="stat-card__content">
                            <h3 className="stat-card__label">
                                Feedbacks Pendientes
                            </h3>
                            <p className="stat-card__value">
                                {pendingFeedbacks}
                            </p>
                            <p className="stat-card__detail">
                                {feedbacks.length} total
                            </p>
                        </div>
                    </div>

                    <div className="stat-card stat-card--reports">
                        <div className="stat-card__icon">
                            <AlertCircle size={32} />
                        </div>
                        <div className="stat-card__content">
                            <h3 className="stat-card__label">
                                Reportes Activos
                            </h3>
                            <p className="stat-card__value">
                                {activeBugReports}
                            </p>
                            <p className="stat-card__detail">
                                {bugReports} total
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};
