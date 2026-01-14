import axiosClient from '../api/axiosClient';

export interface BookRequest {
    id: number;
    book: {
        id: number;
        title: string;
        coverUrl: string;
    };

    user: {
        id: number;
        username: string;
        name: string;
    };
    type: 'BORROWING' | 'RETURNING';
    status: 'PENDING' | 'ACCEPTED' | 'DENIED';
    createdAt: string;
}

export const requestService = {
    createBorrowRequest: async (bookId: number) => {
        // Backend nhận { bookId: ... }
        return await axiosClient.post('/requests/borrow', { bookId });
    },
    getMyRequests: async () => {
        const response = await axiosClient.get<BookRequest[]>('/requests/my-requests');
        return response.data;
    },

    getAllRequestsAdmin: async () => {
        const response = await axiosClient.get<BookRequest[]>('/requests/admin/all');
        return response.data;
    },

    processRequestAdmin: async (id: number, status: 'ACCEPTED' | 'DENIED') => {
        // API PUT với query param status
        return await axiosClient.put(`/requests/admin/${id}`, null, {
            params: { status }
        });
    },

    cancelRequest: async (id: number) => {
        return await axiosClient.delete(`/requests/${id}`);
    }
};

export default requestService;