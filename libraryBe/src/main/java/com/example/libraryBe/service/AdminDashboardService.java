package com.example.libraryBe.service;

import com.example.libraryBe.dto.DashboardResponse;
import com.example.libraryBe.entity.Book;
import com.example.libraryBe.entity.BookLoan;
import com.example.libraryBe.model.LoanStatus;
import com.example.libraryBe.model.RequestStatus;
import com.example.libraryBe.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final AuthorRepository authorRepository;
    private final PublisherRepository publisherRepository;
    private final UserRepository userRepository;
    private final BookLoanRepository loanRepository;
    private final BookRequestRepository requestRepository;

    public DashboardResponse getDashboardData() {
        // Lấy các chỉ số Count
        long totalBooks = bookRepository.count();
        long totalCategories = categoryRepository.count();
        long totalAuthors = authorRepository.count();
        long totalPublishers = publisherRepository.count();
        long activeUsers = userRepository.countByStatus("Active"); // Giả sử có hàm này hoặc dùng findAll filter
        long activeLoans = loanRepository.countByStatus(LoanStatus.BORROWED);
        long pendingRequests = requestRepository.countByStatus(RequestStatus.PENDING);

        // Tính biểu đồ mượn sách 7 ngày qua
        List<DashboardResponse.ChartData> chartData = getLoanChartData();

        // Tính sách Trending Top 5 sách được mượn nhiều nhất
        List<DashboardResponse.TrendingBook> trendingBooks = getTrendingBooks();

        return DashboardResponse.builder()
                .totalBooks(totalBooks)
                .totalCategories(totalCategories)
                .totalAuthors(totalAuthors)
                .totalPublishers(totalPublishers)
                .activeUsers(activeUsers)
                .activeLoans(activeLoans)
                .pendingRequests(pendingRequests)
                .loanChart(chartData)
                .trendingBooks(trendingBooks)
                .build();
    }

    // Helper tính biểu đồ
    private List<DashboardResponse.ChartData> getLoanChartData() {
        List<DashboardResponse.ChartData> data = new ArrayList<>();
        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM");

        // Lấy tất cả loan (tối ưu bằng query sau)
        List<BookLoan> allLoans = loanRepository.findAll();

        // Duyệt ngược 7 ngày
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            long count = allLoans.stream()
                    .filter(l -> l.getLoanDate().toLocalDate().isEqual(date))
                    .count();

            data.add(DashboardResponse.ChartData.builder()
                    .date(date.format(formatter))
                    .value(count)
                    .build());
        }
        return data;
    }

    // Helper: Tính Trending
    private List<DashboardResponse.TrendingBook> getTrendingBooks() {
        // Map<BookId, Count>
        Map<Long, Long> borrowCounts = loanRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        loan -> loan.getBookCopy().getBook().getId(),
                        Collectors.counting()
                ));

        // Sort map theo value giảm dần, lấy top 5
        return borrowCounts.entrySet().stream()
                .sorted(Map.Entry.<Long, Long>comparingByValue().reversed())
                .limit(5)
                .map(entry -> {
                    Book book = bookRepository.findById(entry.getKey()).orElse(null);
                    return DashboardResponse.TrendingBook.builder()
                            .id(entry.getKey())
                            .title(book != null ? book.getTitle() : "Unknown Book")
                            .borrowCount(entry.getValue())
                            .build();
                })
                .collect(Collectors.toList());
    }
}