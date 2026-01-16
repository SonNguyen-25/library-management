import axiosClient from '../api/axiosClient';

export interface ChartData {
    date: string;
    value: number;
}

export interface TrendingBook {
    id: number;
    title: string;
    borrowCount: number;
}

export interface MetricsData {
    totalBooks: number;
    totalCategories: number;
    totalAuthors: number;
    totalPublishers: number;
    activeUsers: number;
    activeLoans: number;
    pendingRequests: number;
    loanChart: ChartData[];
    trendingBooks: TrendingBook[];
}

export const DashboardService = {
    getMetrics: async (): Promise<MetricsData> => {
        const response = await axiosClient.get<MetricsData>('/admin/dashboard');
        return response.data;
    }
};