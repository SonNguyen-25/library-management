import books from '../data/books';
import users from '../data/users';
import bookLoans from '../data/bookLoans';
import bookRequests from '../data/bookRequests';
import authors from '../data/authors';
import categories from '../data/categories';
import publishers from '../data/publishers';

export interface MetricsData {
    books: number;
    categories: number;
    authors: number;
    publishers: number;
    users: number;
    loans: number;
    requests: number;
}

export const DashboardService = {
    getMetrics: async (): Promise<MetricsData> => {
        // Giả lập độ trễ mạng (loading) cho giống thật
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
            books: books.length,
            categories: categories.length,
            authors: authors.length,
            publishers: publishers.length,
            users: users ? users.length : 0, // Fallback nếu chưa import được users
            loans: bookLoans.length,
            requests: bookRequests.length
        };
    }
};