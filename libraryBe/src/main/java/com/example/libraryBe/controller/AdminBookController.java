package com.example.libraryBe.controller;

import com.example.libraryBe.dto.BookRequest;
import com.example.libraryBe.entity.Book;
import com.example.libraryBe.service.AdminBookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/books")
@RequiredArgsConstructor
public class AdminBookController {

    private final AdminBookService adminBookService;

    @PostMapping
    public ResponseEntity<Book> createBook(@RequestBody BookRequest request) {
        return ResponseEntity.ok(adminBookService.createBook(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody BookRequest request) {
        return ResponseEntity.ok(adminBookService.updateBook(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBook(@PathVariable Long id) {
        adminBookService.deleteBook(id);
        return ResponseEntity.ok("Deleted book successfully");
    }

    // POST /api/v1/admin/books/{id}/copies?amount=5
    @PostMapping("/{id}/copies")
    public ResponseEntity<String> addCopies(
            @PathVariable Long id,
            @RequestParam int amount
    ) {
        adminBookService.addCopies(id, amount);
        return ResponseEntity.ok("Successfully added " + amount + " copies.");
    }
}