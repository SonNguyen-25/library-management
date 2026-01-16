package com.example.libraryBe.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class DashboardResponse {
    // Các chỉ số thẻ
    private long totalBooks;
    private long totalCategories;
    private long totalAuthors;
    private long totalPublishers;
    private long activeUsers;
    private long activeLoans;
    private long pendingRequests;

    // Dữ liệu biểu đồ (7 ngày qua)
    private List<ChartData> loanChart;

    // Sách Trending
    private List<TrendingBook> trendingBooks;

    @Data
    @Builder
    public static class ChartData {
        private String date;
        private long value;
    }

    @Data
    @Builder
    public static class TrendingBook {
        private Long id;
        private String title;
        private long borrowCount;
    }
}