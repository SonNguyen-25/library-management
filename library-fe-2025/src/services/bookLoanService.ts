import axiosClient from '../api/axiosClient';

export interface BookLoan {
    id: number;
    user: {
        id: number;
        username: string;
        name: string;
    };
    bookCopy: {
        id: number;
        status: string;
        condition: string;
        book: {
            id: number;
            title: string;
            coverUrl: string;
        };
    };
    loanDate: string;
    dueDate: string;
    returnDate?: string;
    status: 'BORROWED' | 'RETURNED' | 'OVERDUE';
}

export const bookLoanService = {
    getMyLoans: async (status?: string) => {
        return (await axiosClient.get<BookLoan[]>('/loans/my-loans', {
            params: { status }
        })).data;
    },

    getAllLoansAdmin: async () => {
        const response = await axiosClient.get<BookLoan[]>('/loans/admin/all');
        return response.data;
    },

    returnBookAdmin: async (id: number) => {
        return await axiosClient.put(`/loans/admin/return/${id}`);
    }
};