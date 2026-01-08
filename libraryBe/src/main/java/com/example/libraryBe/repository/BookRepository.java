package com.example.libraryBe.repository;

import com.example.libraryBe.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    // Tìm kiếm sách theo Title hoặc Tên Tác Giả, có phân trang
    @Query("SELECT b FROM Book b JOIN b.authors a WHERE " +
            "(:keyword IS NULL OR :keyword = '' OR LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(a.name) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Book> findByTitleOrAuthorContaining(String keyword, Pageable pageable);
}