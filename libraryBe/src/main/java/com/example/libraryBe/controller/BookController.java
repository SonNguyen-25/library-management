package com.example.libraryBe.controller;

import com.example.libraryBe.dto.BookResponse;
import com.example.libraryBe.dto.PageResponse;
import com.example.libraryBe.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/public/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    // API: GET /api/v1/public/books?page=1&size=10&search=abc
    @GetMapping
    public ResponseEntity<PageResponse<BookResponse>> getAllBooks(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(bookService.getAllBooks(page, size, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookResponse> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }
}