package com.example.libraryBe.service;

import com.example.libraryBe.entity.Book;
import com.example.libraryBe.entity.BookLoan;
import com.example.libraryBe.entity.BookRequest;
import com.example.libraryBe.entity.User;
import com.example.libraryBe.model.BookCopyStatus;
import com.example.libraryBe.model.RequestStatus;
import com.example.libraryBe.model.RequestType;
import com.example.libraryBe.repository.BookCopyRepository;
import com.example.libraryBe.repository.BookRepository;
import com.example.libraryBe.repository.BookRequestRepository;
import com.example.libraryBe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookRequestService {

    private final BookRequestRepository requestRepository;
    private final BookRepository bookRepository;
    private final BookCopyRepository bookCopyRepository;
    private final UserRepository userRepository;
    private final LoanService loanService;

    // user tạo yêu cầu mượn
    public void createBorrowRequest(String username, Long bookId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        boolean alreadyRequested = requestRepository.existsByUserIdAndBookIdAndStatus(
                user.getId(), bookId, RequestStatus.PENDING);
        if (alreadyRequested) {
            throw new RuntimeException("Bạn đang có yêu cầu chờ duyệt cho cuốn sách này rồi!");
        }

        long availableCopies = bookCopyRepository.countByBookIdAndStatus(bookId, BookCopyStatus.AVAILABLE);
        if (availableCopies <= 0) {
            throw new RuntimeException("Sách này hiện đã hết bản lưu kho!");
        }

        BookRequest request = BookRequest.builder()
                .user(user)
                .book(book)
                .type(RequestType.BORROWING)
                .status(RequestStatus.PENDING)
                .build();

        requestRepository.save(request);
    }

    // Lấy danh sách cho Admin
    public List<BookRequest> getAllRequests() {
        return requestRepository.findAll(Sort.by("status").ascending().and(Sort.by("createdAt").descending()));
    }

    // Lấy danh sách cá nhân
    public List<BookRequest> getMyRequests(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return requestRepository.findByUserOrderByCreatedAtDesc(user);
    }

    // Xử lý Duyệt/Từ chối
    @Transactional
    public void processRequest(Long requestId, String statusStr) {
        BookRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Request này đã được xử lý rồi!");
        }

        RequestStatus newStatus;
        try {
            newStatus = RequestStatus.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Trạng thái không hợp lệ!");
        }

        if (newStatus == RequestStatus.DENIED) {
            request.setStatus(RequestStatus.DENIED);
            requestRepository.save(request);
        } else if (newStatus == RequestStatus.ACCEPTED) {
            BookLoan newLoan = loanService.createLoanFromRequest(request.getUser(), request.getBook());
            request.setStatus(RequestStatus.ACCEPTED);
            request.setBookLoan(newLoan);
            requestRepository.save(request);
        }
    }

    public void cancelRequest(Long requestId, String username) {
        BookRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu!"));

        if (!request.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Bạn không có quyền hủy yêu cầu này!");
        }

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Không thể hủy yêu cầu đã được xử lý (Duyệt hoặc Từ chối)!");
        }

        requestRepository.delete(request);
    }
}