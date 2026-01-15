import axiosClient from '../api/axiosClient';
import type {Notification} from '../types/notification';

export const notificationService = {
    getUnreadCount: async () => {
        const response = await axiosClient.get<number>('/notifications/unread-count');
        return response.data;
    },

    getMyNotifications: async () => {
        const response = await axiosClient.get<Notification[]>('/notifications');
        return response.data;
    },

    markAllAsRead: async () => {
        return await axiosClient.put('/notifications/read-all');
    },

    delete: async (id: number) => {
        return await axiosClient.delete(`/notifications/${id}`);
    },

    deleteAll: async () => {
        return await axiosClient.delete('/notifications/delete-all');
    }
};