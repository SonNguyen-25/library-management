package com.example.libraryBe.repository;

import com.example.libraryBe.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    // Tìm theo Keyword + Category + Author
    @Query("SELECT DISTINCT b FROM Book b " +
            "LEFT JOIN b.authors a " +
            "LEFT JOIN b.categories c " +
            "WHERE (:keyword IS NULL OR :keyword = '' OR LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(a.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:authorId IS NULL OR a.id = :authorId) " +
            "AND (:categoryId IS NULL OR c.id = :categoryId)")
    Page<Book> searchBooks(String keyword, Long authorId, Long categoryId, Pageable pageable);
}