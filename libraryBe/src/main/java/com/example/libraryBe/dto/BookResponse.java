package com.example.libraryBe.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookResponse {
    private Long id;
    private String title;
    private String description;
    private String coverUrl;
    private Double rating;
    private String publisherName;
    private List<String> authors;
    private List<String> categories;
    private boolean available;
}