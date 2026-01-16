package com.example.libraryBe.controller;

import com.example.libraryBe.dto.BookRequest;
import com.example.libraryBe.entity.Book;
import com.example.libraryBe.service.AdminBookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/books")
@RequiredArgsConstructor
public class AdminBookController {

    private final AdminBookService adminBookService;

    @PostMapping
    @PreAuthorize("hasAuthority('BOOK_CREATE')")
    public ResponseEntity<Book> createBook(@RequestBody BookRequest request) {
        return ResponseEntity.ok(adminBookService.createBook(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('BOOK_UPDATE')")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody BookRequest request) {
        return ResponseEntity.ok(adminBookService.updateBook(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('BOOK_DELETE')")
    public ResponseEntity<String> deleteBook(@PathVariable Long id) {
        adminBookService.deleteBook(id);
        return ResponseEntity.ok("Deleted book successfully");
    }

    @PostMapping("/{id}/copies")
    @PreAuthorize("hasAuthority('BOOK_UPDATE')")
    public ResponseEntity<String> addCopies(
            @PathVariable Long id,
            @RequestParam int amount
    ) {
        adminBookService.addCopies(id, amount);
        return ResponseEntity.ok("Successfully added " + amount + " copies.");
    }
}