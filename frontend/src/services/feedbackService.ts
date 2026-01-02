export interface CreateFeedbackRequest {
    type: "suggestion" | "bug_report";
    title?: string;
    description: string;
}

export interface Feedback {
    id: number;
    userId: string;
    type: "suggestion" | "bug_report";
    title: string | null;
    description: string;
    status: "pending" | "in_review" | "resolved" | "dismissed";
    createdAt: string;
}

export interface FeedbackResponse {
    success: boolean;
    message?: string;
    data?: Feedback;
}

const createFeedback = async (
    feedbackData: CreateFeedbackRequest,
    token: string
): Promise<Feedback> => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/feedback`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(feedbackData),
        }
    );

    const data: FeedbackResponse = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al enviar feedback");
    }

    return data.data!;
};

const getUserFeedbacks = async (token: string): Promise<Feedback[]> => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/feedback/my-feedbacks`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al obtener feedbacks");
    }

    return data.data;
};

export const feedbackService = {
    createFeedback,
    getUserFeedbacks,
};
