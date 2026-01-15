import axiosClient from '../api/axiosClient';
import type {Fine} from '../types/fine';

export const FineService = {
    getMyFines: async (): Promise<Fine[]> => {
        const response = await axiosClient.get<Fine[]>('/fines/my-fines');
        return response.data;
    },

    getAll: async (): Promise<Fine[]> => {
        const response = await axiosClient.get<Fine[]>('/fines/admin/all');
        return response.data;
    },

    create: async (fineData: { username: string, amount: number, description: string, bookLoanId?: string }): Promise<Fine> => {
        // Convert bookLoanId string sang number nếu có
        const payload = {
            ...fineData,
            bookLoanId: fineData.bookLoanId ? Number(fineData.bookLoanId) : null
        };
        const response = await axiosClient.post<Fine>('/fines/admin/create', payload);
        return response.data;
    },

    settleFine: async (id: number): Promise<void> => {
        await axiosClient.delete(`/fines/admin/${id}`);
    }
};