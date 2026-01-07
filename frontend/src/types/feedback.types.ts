export interface Feedback {
    id: number;
    userId: string;
    type: "suggestion" | "bug_report";
    title: string | null;
    description: string;
    status: "pending" | "in_review" | "resolved" | "dismissed";
    createdAt: string;
    updatedAt: string;
}

export interface FeedbackWithUser extends Feedback {
    user: {
        id: string;
        name: string;
        lastname: string;
        username: string;
        email: string;
    };
}

export interface CreateFeedbackRequest {
    type: "suggestion" | "bug_report";
    title?: string;
    description: string;
}

export interface UpdateFeedbackStatusRequest {
    status: "pending" | "in_review" | "resolved" | "dismissed";
}

export const FEEDBACK_TYPES = {
    SUGGESTION: "suggestion" as const,
    BUG_REPORT: "bug_report" as const,
};

export const FEEDBACK_STATUSES = {
    PENDING: "pending" as const,
    IN_REVIEW: "in_review" as const,
    RESOLVED: "resolved" as const,
    DISMISSED: "dismissed" as const,
};

export const FEEDBACK_TYPE_LABELS = {
    suggestion: "Sugerencia",
    bug_report: "Reporte de Bug",
};

export const FEEDBACK_STATUS_LABELS = {
    pending: "Pendiente",
    in_review: "En Revisión",
    resolved: "Resuelto",
    dismissed: "Descartado",
};
