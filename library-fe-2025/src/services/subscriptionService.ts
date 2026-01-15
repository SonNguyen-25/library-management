import axiosClient from '../api/axiosClient';
import type {Subscription} from '../types/subscription';

export const subscriptionService = {
    getMySubscriptions: async () => {
        const response = await axiosClient.get<Subscription[]>('/subscriptions/my-subscriptions');
        return response.data;
    },

    subscribe: async (bookId: number) => {
        return await axiosClient.post(`/subscriptions?bookId=${bookId}`);
    },
    
    unsubscribe: async (id: number) => {
        return await axiosClient.delete(`/subscriptions/${id}`);
    }
};