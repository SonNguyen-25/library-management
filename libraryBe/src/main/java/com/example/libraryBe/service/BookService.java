package com.example.libraryBe.service;

import com.example.libraryBe.dto.BookResponse;
import com.example.libraryBe.dto.PageResponse;
import com.example.libraryBe.entity.Author;
import com.example.libraryBe.entity.Book;
import com.example.libraryBe.entity.BookCopy;
import com.example.libraryBe.entity.Category;
import com.example.libraryBe.model.BookCopyStatus;
import com.example.libraryBe.repository.BookCopyRepository;
import com.example.libraryBe.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;
    private final BookCopyRepository bookCopyRepository;

    public PageResponse<BookResponse> getAllBooks(int page, int size, String keyword) {
        // Tạo đối tượng Pageable (Page trong JPA bắt đầu từ 0, còn Fe gửi từ 1)
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("id").descending());
        // Gọi Repository
        Page<Book> bookPage = bookRepository.findByTitleOrAuthorContaining(keyword, pageable);
        // Map Entity sang DTO
        List<BookResponse> bookResponses = bookPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        // Đóng gói vào PageResponse
        return PageResponse.<BookResponse>builder()
                .currentPage(page)
                .pageSize(size)
                .totalPages(bookPage.getTotalPages())
                .totalElements(bookPage.getTotalElements())
                .data(bookResponses)
                .build();
    }

    public BookResponse getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        return mapToResponse(book);
    }

    private BookResponse mapToResponse(Book book) {
        // Kiểm tra xem sách này có bản sao nào AVAILABLE không
        List<BookCopy> copies = bookCopyRepository.findAll();
        boolean isAvailable = copies.stream()
                .anyMatch(c -> c.getBook().getId().equals(book.getId())
                        && c.getStatus() == BookCopyStatus.AVAILABLE);

        return BookResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .description(book.getDescription())
                .coverUrl(book.getCoverUrl())
                .rating(book.getRating() != null ? book.getRating() : 0.0)
                .publisherName(book.getPublisher() != null ? book.getPublisher().getName() : "Unknown")
                .authors(book.getAuthors().stream().map(Author::getName).collect(Collectors.toList()))
                .categories(book.getCategories().stream().map(Category::getName).collect(Collectors.toList()))
                .available(isAvailable)
                .build();
    }
}