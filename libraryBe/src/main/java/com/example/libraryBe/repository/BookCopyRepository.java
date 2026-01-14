package com.example.libraryBe.repository;
import com.example.libraryBe.entity.BookCopy;
import com.example.libraryBe.model.BookCopyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookCopyRepository extends JpaRepository<BookCopy, Long> {
    Optional<BookCopy> findFirstByBookIdAndStatus(Long bookId, BookCopyStatus status);
    long countByBookIdAndStatus(Long bookId, BookCopyStatus status);
}