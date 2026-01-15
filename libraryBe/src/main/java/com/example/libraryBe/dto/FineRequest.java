package com.example.libraryBe.dto;

import lombok.Data;

@Data
public class FineRequest {
    private String username;
    private Double amount;
    private String description;
    private Long bookLoanId; // Có thể null nếu phạt lỗi khác (ồn ào, xả rác...)
}