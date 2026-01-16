import axiosClient from '../api/axiosClient';
import type {Review} from '../types/review';

export const reviewService = {
    getReviewsByBookId: async (bookId: number): Promise<Review[]> => {
        const response = await axiosClient.get<Review[]>('/reviews', {
            params: { bookId }
        });
        return response.data;
    },
    // Khớp với addOrUpdate ở Backend
    addOrUpdateReview: async (bookId: number, rating: number, comment: string): Promise<Review> => {
        const response = await axiosClient.post<Review>('/reviews', {
            bookId,
            rating,
            comment
        });
        return response.data;
    },

    deleteReview: async (reviewId: number) => {
        return await axiosClient.delete(`/reviews/${reviewId}`);
    }
};