import axiosClient from '../api/axiosClient';
import type {Publisher} from '../types/publisher';

export const PublisherService = {
    getAll: async (): Promise<Publisher[]> => {
        const response = await axiosClient.get<Publisher[]>('/admin/publishers');
        return response.data;
    },

    create: async (name: string) => {
        return await axiosClient.post('/admin/publishers', { name });
    },

    update: async (id: number, name: string) => {
        return await axiosClient.put(`/admin/publishers/${id}`, { name });
    },

    delete: async (id: number) => {
        return await axiosClient.delete(`/admin/publishers/${id}`);
    }
};