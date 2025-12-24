import reviewsData, {type Review } from "../data/reviews";

const STORAGE_KEY_PREFIX = "library_";
const REVIEWS_STORAGE_KEY = `${STORAGE_KEY_PREFIX}reviews`;

// Hàm lấy dữ liệu từ localStorage (nếu có), không thì lấy từ file mẫu
const getStoredReviews = (): Review[] => {
    const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    // Lần đầu chạy chưa có gì trong storage thì nạp dữ liệu mẫu vào
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviewsData));
    return reviewsData;
};

export const reviewService = {
    // Lấy tất cả review của 1 cuốn sách
    getReviewsByBookId: (bookId: number): Review[] => {
        const allReviews = getStoredReviews();
        // Lọc theo sách và sắp xếp mới nhất lên đầu
        return allReviews
            .filter((r) => r.bookId === bookId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },

    getAverageRating: (bookId: number): number => {
        const bookReviews = getStoredReviews().filter((r) => r.bookId === bookId);

        if (bookReviews.length === 0) return 0;

        const total = bookReviews.reduce((sum, review) => sum + review.rating, 0);
        // Làm tròn 1 chữ số thập phân
        return parseFloat((total / bookReviews.length).toFixed(1));
    },

    getReviewCount: (bookId: number): number => {
        return getStoredReviews().filter((r) => r.bookId === bookId).length;
    },

    addReview: (
        bookId: number,
        userId: string,
        userName: string,
        rating: number,
        comment: string
    ): Review => {
        const allReviews = getStoredReviews();

        const newReview: Review = {
            id: Date.now(),
            bookId,
            userId,
            userName,
            rating,
            comment,
            createdAt: new Date().toISOString(),
        };

        const updatedReviews = [...allReviews, newReview];
        // Lưu lại vào localStorage để giữ dữ liệu
        localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updatedReviews));

        return newReview;
    }
};