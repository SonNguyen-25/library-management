package com.example.libraryBe.controller;

import com.example.libraryBe.dto.BookResponse;
import com.example.libraryBe.dto.PageResponse;
import com.example.libraryBe.entity.Author;
import com.example.libraryBe.entity.Category;
import com.example.libraryBe.service.AuthorService;
import com.example.libraryBe.service.BookService;
import com.example.libraryBe.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;
    private final AuthorService authorService;
    private final CategoryService categoryService;

    @GetMapping("/books")
    public ResponseEntity<PageResponse<BookResponse>> getAllBooks(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long authorId,
            @RequestParam(required = false) Long categoryId
    ) {
        return ResponseEntity.ok(bookService.getAllBooks(page, size, search, authorId, categoryId));
    }

    @GetMapping("/books/{id}")
    public ResponseEntity<BookResponse> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    @GetMapping("/authors")
    public ResponseEntity<List<Author>> getAllAuthors() {
        return ResponseEntity.ok(authorService.getAllAuthors());
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }
}