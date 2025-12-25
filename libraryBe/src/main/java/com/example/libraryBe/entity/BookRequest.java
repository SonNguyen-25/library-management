package com.example.libraryBe.entity;

import com.example.libraryBe.model.RequestStatus;
import com.example.libraryBe.model.RequestType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "book_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;

    @ManyToOne
    @JoinColumn(name = "book_loan_id")
    private BookLoan bookLoan;

    @Enumerated(EnumType.STRING)
    private RequestType type;   // BORROWING / RETURNING

    @Enumerated(EnumType.STRING)
    private RequestStatus status; // PENDING / ACCEPTED / DENIED

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) this.status = RequestStatus.PENDING;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
