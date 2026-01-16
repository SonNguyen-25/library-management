package com.example.libraryBe.controller;

import com.example.libraryBe.dto.SimpleRequest;
import com.example.libraryBe.entity.Author;
import com.example.libraryBe.service.AuthorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/authors")
@RequiredArgsConstructor
public class AdminAuthorController {
    private final AuthorService authorService;

    @GetMapping
    @PreAuthorize("hasAuthority('AUTHOR_MANAGE')")
    public ResponseEntity<List<Author>> getAll() {
        return ResponseEntity.ok(authorService.getAllAuthors());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('AUTHOR_MANAGE')")
    public ResponseEntity<Author> create(@RequestBody SimpleRequest request) {
        return ResponseEntity.ok(authorService.createAuthor(request));
    }
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('AUTHOR_MANAGE')")
    public ResponseEntity<Author> update(@PathVariable Long id, @RequestBody SimpleRequest request) {
        return ResponseEntity.ok(authorService.updateAuthor(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('AUTHOR_MANAGE')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        authorService.deleteAuthor(id);
        return ResponseEntity.ok().build();
    }
}