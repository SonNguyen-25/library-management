import axiosClient from '../api/axiosClient';
import type {Book, PageResponse} from '../types/book';

export interface Author { id: number; name: string; }
export interface Category { id: number; name: string; }

export const bookService = {
    getPublicBooks: async (page: number = 1, size: number = 8, search: string = '', authorId?: number, categoryId?: number) => {
        const response = await axiosClient.get<PageResponse<Book>>('/public/books', {
            params: {
                page,
                size,
                search,
                authorId,
                categoryId
            }
        });
        return response.data;
    },

    getBookById: async (id: number) => {
        const response = await axiosClient.get<Book>(`/public/books/${id}`);
        return response.data;
    },
    getAuthors: async () => {
        const response = await axiosClient.get<Author[]>('/public/authors');
        return response.data;
    },

    getCategories: async () => {
        const response = await axiosClient.get<Category[]>('/public/categories');
        return response.data;
    },
    deleteBook: async (id: number) => axiosClient.delete(`/admin/books/${id}`),
    createBook: async (data: any) => axiosClient.post('/admin/books', data),
    updateBook: async (id: number, data: any) => axiosClient.put(`/admin/books/${id}`, data),
};