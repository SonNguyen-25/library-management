package com.example.libraryBe.controller;

import com.example.libraryBe.dto.SimpleRequest;
import com.example.libraryBe.entity.Author;
import com.example.libraryBe.service.AuthorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/authors")
@RequiredArgsConstructor
public class AdminAuthorController {
    private final AuthorService authorService;

    @GetMapping
    public ResponseEntity<List<Author>> getAll() { return ResponseEntity.ok(authorService.getAllAuthors()); }

    @PostMapping
    public ResponseEntity<Author> create(@RequestBody SimpleRequest request) { return ResponseEntity.ok(authorService.createAuthor(request)); }

    @PutMapping("/{id}")
    public ResponseEntity<Author> update(@PathVariable Long id, @RequestBody SimpleRequest request) { return ResponseEntity.ok(authorService.updateAuthor(id, request)); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        authorService.deleteAuthor(id);
        return ResponseEntity.ok().build();
    }
}