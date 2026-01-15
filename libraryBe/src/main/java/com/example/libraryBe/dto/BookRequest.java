package com.example.libraryBe.dto;

import lombok.Data;
import java.util.List;

@Data
public class BookRequest {
    private String title;
    private String description;
    private String coverUrl;
    private String publisherName;
    private List<String> authorNames;
    private List<String> categoryNames;
    private boolean available;
    private Integer initialCopies; // Số lượng bản copy nhập về ban đầu khi tạo mới
}