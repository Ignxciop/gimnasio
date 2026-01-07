import { api } from "./api";
import type { User } from "../types/auth.types";

interface UpdateRoleRequest {
    roleId: number;
}

interface UpdateStatusRequest {
    isActive: boolean;
}

export const adminService = {
    async getUsers(token: string): Promise<User[]> {
        const response = await api.get<{ success: boolean; data: User[] }>(
            "/admin/users",
            token
        );
        return response.data;
    },

    async updateUserRole(
        userId: string,
        roleId: number,
        token: string
    ): Promise<User> {
        const response = await api.put<
            { success: boolean; data: User },
            UpdateRoleRequest
        >(`/admin/users/${userId}/role`, { roleId }, token);
        return response.data;
    },

    async updateUserStatus(
        userId: string,
        isActive: boolean,
        token: string
    ): Promise<User> {
        const response = await api.put<
            { success: boolean; data: User },
            UpdateStatusRequest
        >(`/admin/users/${userId}/status`, { isActive }, token);
        return response.data;
    },
};
