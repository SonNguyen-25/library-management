import axiosClient from '../api/axiosClient';
import type {User} from '../types/user';

export interface UpdateProfileRequest {
    name: string;
    email: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export const userService = {
    //Admin
    getAll: async (): Promise<User[]> => {
        const response = await axiosClient.get<User[]>('/admin/users');
        return response.data.map(user => ({
            ...user,
            role: user.roles && user.roles.length > 0 ? user.roles[0].name : 'USER'
        }));
    },

    create: async (data: any) => {
        return await axiosClient.post('/admin/users', data);
    },

    update: async (id: number, data: any) => {
        return await axiosClient.put(`/admin/users/${id}`, data);
    },

    delete: async (id: number) => {
        return await axiosClient.delete(`/admin/users/${id}`);
    },

    // User
    updateProfile: async (data: UpdateProfileRequest) => {
        const response = await axiosClient.put('/users/profile', data);
        return response.data;
    },

    changePassword: async (data: ChangePasswordRequest) => {
        return await axiosClient.put('/users/change-password', data);
    }
};