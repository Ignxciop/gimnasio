import { prisma } from "../config/prisma.js";

export const createFeedback = async (
    userId,
    type,
    description,
    title = null
) => {
    return await prisma.feedback.create({
        data: {
            userId,
            type,
            title,
            description,
        },
    });
};

export const getUserFeedbacks = async (userId) => {
    return await prisma.feedback.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            type: true,
            title: true,
            description: true,
            status: true,
            createdAt: true,
        },
    });
};

export const getAllFeedbacks = async (type = null, status = null) => {
    const where = {};
    if (type) where.type = type;
    if (status) where.status = status;

    return await prisma.feedback.findMany({
        where,
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                    name: true,
                    lastname: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
};

export const updateFeedbackStatus = async (feedbackId, status) => {
    return await prisma.feedback.update({
        where: { id: feedbackId },
        data: { status },
    });
};

export default {
    createFeedback,
    getUserFeedbacks,
    getAllFeedbacks,
    updateFeedbackStatus,
};
