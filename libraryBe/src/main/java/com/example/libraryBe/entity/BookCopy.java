package com.example.libraryBe.entity;

import com.example.libraryBe.model.BookCopyStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "book_copies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookCopy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    @JsonIgnoreProperties({"copies", "bookCopies", "hibernateLazyInitializer", "handler"})
    private Book book;

    @Enumerated(EnumType.STRING)
    private BookCopyStatus status;

    private String condition; // 'New', 'Good', 'Worn'
}
