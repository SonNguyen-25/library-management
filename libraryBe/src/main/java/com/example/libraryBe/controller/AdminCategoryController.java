package com.example.libraryBe.controller;

import com.example.libraryBe.dto.SimpleRequest;
import com.example.libraryBe.entity.Category;
import com.example.libraryBe.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController {
    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<Category>> getAll() { return ResponseEntity.ok(categoryService.getAllCategories()); }

    @PostMapping
    public ResponseEntity<Category> create(@RequestBody SimpleRequest request) { return ResponseEntity.ok(categoryService.createCategory(request)); }

    @PutMapping("/{id}")
    public ResponseEntity<Category> update(@PathVariable Long id, @RequestBody SimpleRequest request) { return ResponseEntity.ok(categoryService.updateCategory(id, request)); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok().build();
    }
}