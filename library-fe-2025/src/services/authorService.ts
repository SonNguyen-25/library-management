import axiosClient from '../api/axiosClient';
import type {Author} from '../types/author';

export const AuthorService = {
    getAll: async (): Promise<Author[]> => {
        const response = await axiosClient.get<Author[]>('/admin/authors');
        return response.data;
    },

    create: async (name: string) => {
        return await axiosClient.post('/admin/authors', { name });
    },

    update: async (id: number, name: string) => {
        return await axiosClient.put(`/admin/authors/${id}`, { name });
    },

    delete: async (id: number) => {
        return await axiosClient.delete(`/admin/authors/${id}`);
    }
};