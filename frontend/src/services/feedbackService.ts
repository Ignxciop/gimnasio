import { API_BASE_URL } from "../config/constants";
import type {
    Feedback,
    FeedbackWithUser,
    CreateFeedbackRequest,
    UpdateFeedbackStatusRequest,
} from "../types/feedback.types";

export interface FeedbackResponse {
    success: boolean;
    message?: string;
    data?: Feedback;
}

const createFeedback = async (
    feedbackData: CreateFeedbackRequest,
    token: string
): Promise<Feedback> => {
    const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(feedbackData),
    });

    const data: FeedbackResponse = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al enviar feedback");
    }

    return data.data!;
};

const getUserFeedbacks = async (token: string): Promise<Feedback[]> => {
    const response = await fetch(`${API_BASE_URL}/feedback/my-feedbacks`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al obtener feedbacks");
    }

    return data.data;
};

const getAllFeedbacks = async (
    token: string,
    type?: string,
    status?: string
): Promise<FeedbackWithUser[]> => {
    const params = new URLSearchParams();
    if (type) params.append("type", type);
    if (status) params.append("status", status);

    const url = `${API_BASE_URL}/feedback/all${
        params.toString() ? `?${params.toString()}` : ""
    }`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al obtener feedbacks");
    }

    return data.data;
};

const updateFeedbackStatus = async (
    feedbackId: number,
    statusData: UpdateFeedbackStatusRequest,
    token: string
): Promise<Feedback> => {
    const response = await fetch(
        `${API_BASE_URL}/feedback/${feedbackId}/status`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(statusData),
        }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al actualizar estado");
    }

    return data.data;
};

export const feedbackService = {
    createFeedback,
    getUserFeedbacks,
    getAllFeedbacks,
    updateFeedbackStatus,
};
