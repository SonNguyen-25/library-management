package com.example.libraryBe.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.example.libraryBe.model.LoanStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.example.libraryBe.entity.User;

@Entity
@Table(name = "book_loans")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookLoan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Mượn cuốn cụ thể nào (Copy)
    @ManyToOne
    @JoinColumn(name = "book_copy_id", nullable = false)
    @JsonIgnoreProperties({"loans", "hibernateLazyInitializer", "handler"})
    private BookCopy bookCopy;

    // Ai mượn
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"loans", "requests", "password", "roles"})
    private User user;

    private LocalDateTime loanDate;
    private LocalDateTime dueDate;
    private LocalDateTime returnDate; // Null nếu chưa trả

    @Enumerated(EnumType.STRING)
    private LoanStatus status;

    // Audit logs
    private LocalDateTime loanedAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.loanedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
