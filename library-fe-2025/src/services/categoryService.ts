import axiosClient from '../api/axiosClient';
import type {Category} from '../types/category';

export const CategoryService = {
    getAll: async (): Promise<Category[]> => {
        const response = await axiosClient.get<Category[]>('/admin/categories');
        return response.data;
    },

    create: async (name: string) => {
        return await axiosClient.post('/admin/categories', { name });
    },

    update: async (id: number, name: string) => {
        return await axiosClient.put(`/admin/categories/${id}`, { name });
    },

    delete: async (id: number) => {
        return await axiosClient.delete(`/admin/categories/${id}`);
    }
};