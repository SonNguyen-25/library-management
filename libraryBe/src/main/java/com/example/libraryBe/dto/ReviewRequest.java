package com.example.libraryBe.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private Long bookId;
    private Integer rating; // 1-5
    private String comment;
}