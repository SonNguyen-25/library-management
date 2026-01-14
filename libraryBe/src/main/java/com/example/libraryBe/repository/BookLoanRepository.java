package com.example.libraryBe.repository;

import com.example.libraryBe.entity.BookLoan;
import com.example.libraryBe.entity.User;
import com.example.libraryBe.model.LoanStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookLoanRepository extends JpaRepository<BookLoan, Long> {
    List<BookLoan> findByUserOrderByLoanDateDesc(User user);
    List<BookLoan> findByUserAndStatusOrderByLoanDateDesc(User user, LoanStatus status);
    // Admin: Lấy tất cả sắp xếp ngày giảm dần
    List<BookLoan> findAllByOrderByLoanDateDesc();
}