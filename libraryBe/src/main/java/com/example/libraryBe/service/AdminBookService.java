package com.example.libraryBe.service;

import com.example.libraryBe.dto.BookRequest;
import com.example.libraryBe.entity.*;
import com.example.libraryBe.model.BookCopyStatus;
import com.example.libraryBe.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdminBookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;
    private final PublisherRepository publisherRepository;
    private final BookCopyRepository bookCopyRepository;

    @Transactional
    public Book createBook(BookRequest request) {
        Publisher publisher = getOrCreatePublisher(request.getPublisherName());
        Set<Author> authors = getOrCreateAuthors(request.getAuthorNames());
        Set<Category> categories = getOrCreateCategories(request.getCategoryNames());

        Book book = Book.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .coverUrl(request.getCoverUrl())
                .rating(0.0)
                .publisher(publisher)
                .authors(authors)
                .categories(categories)
                .build();

        Book savedBook = bookRepository.save(book);

        // Tự động tạo các bản Copy (Số lượng nhập kho)
        int copyCount = request.getInitialCopies() != null ? request.getInitialCopies() : 1;
        createCopies(savedBook, copyCount);

        return savedBook;
    }

    @Transactional
    public Book updateBook(Long id, BookRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        book.setTitle(request.getTitle());
        book.setDescription(request.getDescription());
        book.setCoverUrl(request.getCoverUrl());

        if (request.getPublisherName() != null) {
            book.setPublisher(getOrCreatePublisher(request.getPublisherName()));
        }
        if (request.getAuthorNames() != null) {
            book.setAuthors(getOrCreateAuthors(request.getAuthorNames()));
        }
        if (request.getCategoryNames() != null) {
            book.setCategories(getOrCreateCategories(request.getCategoryNames()));
        }

        return bookRepository.save(book);
    }

    @Transactional
    public void deleteBook(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new RuntimeException("Book not found");
        }
        // Xóa copy trước xóa sách sau
        bookCopyRepository.deleteByBookId(id);
        bookRepository.deleteById(id);
    }

    @Transactional
    public void addCopies(Long bookId, int amount) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        for (int i = 0; i < amount; i++) {
            BookCopy copy = BookCopy.builder()
                    .book(book)
                    .status(BookCopyStatus.AVAILABLE)
                    .condition("New") // Mặc định mới nhập là New
                    .build();
            bookCopyRepository.save(copy);
        }
    }
    // Helper
    private Publisher getOrCreatePublisher(String name) {
        if (name == null || name.isEmpty()) return null;
        return publisherRepository.findAll().stream()
                .filter(p -> p.getName().equalsIgnoreCase(name.trim()))
                .findFirst()
                .orElseGet(() -> publisherRepository.save(new Publisher(null, name.trim())));
    }

    private Set<Author> getOrCreateAuthors(java.util.List<String> names) {
        Set<Author> result = new HashSet<>();
        if (names == null) return result;
        for (String name : names) {
            if (name.trim().isEmpty()) continue;
            Author author = authorRepository.findAll().stream()
                    .filter(a -> a.getName().equalsIgnoreCase(name.trim()))
                    .findFirst()
                    .orElseGet(() -> authorRepository.save(new Author(null, name.trim())));
            result.add(author);
        }
        return result;
    }

    private Set<Category> getOrCreateCategories(java.util.List<String> names) {
        Set<Category> result = new HashSet<>();
        if (names == null) return result;
        for (String name : names) {
            if (name.trim().isEmpty()) continue;
            Category category = categoryRepository.findAll().stream()
                    .filter(c -> c.getName().equalsIgnoreCase(name.trim()))
                    .findFirst()
                    .orElseGet(() -> categoryRepository.save(new Category(null, name.trim())));
            result.add(category);
        }
        return result;
    }

    private void createCopies(Book book, int count) {
        for (int i = 0; i < count; i++) {
            BookCopy copy = BookCopy.builder()
                    .book(book)
                    .status(BookCopyStatus.AVAILABLE)
                    .condition("New")
                    .build();
            bookCopyRepository.save(copy);
        }
    }
}