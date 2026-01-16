package com.example.libraryBe.repository;

import com.example.libraryBe.entity.BookRequest;
import com.example.libraryBe.entity.User;
import com.example.libraryBe.model.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRequestRepository extends JpaRepository<BookRequest, Long> {
    List<BookRequest> findByUserOrderByCreatedAtDesc(User user);
    // Kiểm tra xem user này có đang yêu cầu cuốn sách này không (tránh spam nút mượn)
    boolean existsByUserIdAndBookIdAndStatus(Long userId, Long bookId, RequestStatus status);
    long countByStatus(RequestStatus status);
}