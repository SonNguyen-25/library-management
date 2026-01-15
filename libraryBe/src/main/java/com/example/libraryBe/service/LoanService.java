package com.example.libraryBe.service;

import com.example.libraryBe.entity.*;
import com.example.libraryBe.model.BookCopyStatus;
import com.example.libraryBe.model.LoanStatus;
import com.example.libraryBe.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanService {

    private final BookLoanRepository loanRepository;
    private final BookCopyRepository bookCopyRepository;
    private final UserRepository userRepository;
    private final FineRepository fineRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final NotificationService notificationService;

    @Transactional
    public BookLoan createLoanFromRequest(User user, Book book) {
        // Tìm bản Copy đang AVAILABLE
        BookCopy copy = bookCopyRepository.findFirstByBookIdAndStatus(book.getId(), BookCopyStatus.AVAILABLE)
                .orElseThrow(() -> new RuntimeException("Sách '" + book.getTitle() + "' hiện đã hết bản lưu kho, không thể duyệt!"));

        copy.setStatus(BookCopyStatus.BORROWED);
        bookCopyRepository.save(copy);

        BookLoan loan = BookLoan.builder()
                .user(user)
                .bookCopy(copy)
                .loanDate(LocalDateTime.now())
                .dueDate(LocalDateTime.now().plusDays(30))
                .status(LoanStatus.BORROWED)
                .build();

        return loanRepository.save(loan);
    }
    @Transactional
    public void returnBook(Long loanId) {
        BookLoan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu mượn!"));

        if (loan.getStatus() == LoanStatus.RETURNED) {
            throw new RuntimeException("Phiếu mượn này đã được trả trước đó rồi!");
        }

        LocalDateTime returnDate = LocalDateTime.now();

        loan.setStatus(LoanStatus.RETURNED);
        loan.setReturnDate(returnDate);
        loanRepository.save(loan);

        // Trả sách về kho
        BookCopy copy = loan.getBookCopy();
        copy.setStatus(BookCopyStatus.AVAILABLE);
        bookCopyRepository.save(copy);

        List<Subscription> subs = subscriptionRepository.findByBookId(copy.getBook().getId());

        for (Subscription sub : subs) {
            notificationService.createNotification(
                    sub.getUser(),
                    "Sách '" + copy.getBook().getTitle() + "' đã có hàng! Hãy mượn ngay."
            );
        }
        // LOGIC TÍNH PHẠT TỰ ĐỘNG
        long overdueDays = ChronoUnit.DAYS.between(loan.getDueDate().toLocalDate(), returnDate.toLocalDate());

        if (overdueDays > 0) {
            // Quy định: 5.000 VND / ngày quá hạn
            double fineAmount = overdueDays * 5000.0;

            Fine fine = Fine.builder()
                    .user(loan.getUser())
                    .bookLoan(loan)
                    .amount(fineAmount)
                    .description("Quá hạn " + overdueDays + " ngày (Hạn trả: "
                            + loan.getDueDate().toLocalDate() + ")")
                    .build();

            fineRepository.save(fine);
        }
    }
    public List<BookLoan> getMyLoans(String username, String statusStr) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (statusStr == null || statusStr.isEmpty() || statusStr.equals("ALL")) {
            return loanRepository.findByUserOrderByLoanDateDesc(user);
        }
        // Nếu có filter -> Convert String sang Enum và gọi hàm lọc
        try {
            LoanStatus status = LoanStatus.valueOf(statusStr.toUpperCase());
            return loanRepository.findByUserAndStatusOrderByLoanDateDesc(user, status);
        } catch (IllegalArgumentException e) {
            // lỗi: lấy hết
            return loanRepository.findByUserOrderByLoanDateDesc(user);
        }
    }
    public List<BookLoan> getAllLoans() {
        return loanRepository.findAllByOrderByLoanDateDesc();
    }
}