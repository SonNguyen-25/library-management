package com.example.libraryBe.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class LoanResponse {
    private Long id;
    private String bookTitle;
    private String userName;
    private LocalDateTime loanDate;
    private LocalDateTime dueDate;
    private String status;
}