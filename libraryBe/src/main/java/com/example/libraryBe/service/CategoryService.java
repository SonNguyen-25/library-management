package com.example.libraryBe.service;

import com.example.libraryBe.dto.SimpleRequest;
import com.example.libraryBe.entity.Category;
import com.example.libraryBe.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
    public Category createCategory(SimpleRequest request) {
        return categoryRepository.save(new Category(null, request.getName()));
    }

    public Category updateCategory(Long id, SimpleRequest request) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        category.setName(request.getName());
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}