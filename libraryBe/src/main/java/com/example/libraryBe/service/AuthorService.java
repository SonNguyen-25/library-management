package com.example.libraryBe.service;

import com.example.libraryBe.dto.SimpleRequest;
import com.example.libraryBe.entity.Author;
import com.example.libraryBe.repository.AuthorRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthorService {

    private final AuthorRepository authorRepository;

    public List<Author> getAllAuthors() {
        return authorRepository.findAll();
    }
    public Author createAuthor(SimpleRequest request) {
        return authorRepository.save(new Author(null, request.getName()));
    }

    public Author updateAuthor(Long id, SimpleRequest request) {
        Author author = authorRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        author.setName(request.getName());
        return authorRepository.save(author);
    }

    @Transactional
    public void deleteAuthor(Long id) {
        // Nếu dính FK với book thì DB sẽ báo lỗi
        authorRepository.deleteById(id);
    }
}