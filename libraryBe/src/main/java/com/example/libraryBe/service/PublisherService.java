package com.example.libraryBe.service;

import com.example.libraryBe.dto.SimpleRequest;
import com.example.libraryBe.entity.Publisher;
import com.example.libraryBe.repository.PublisherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PublisherService {
    private final PublisherRepository publisherRepository;

    public List<Publisher> getAllPublishers() { return publisherRepository.findAll(); }

    public Publisher createPublisher(SimpleRequest request) {
        return publisherRepository.save(new Publisher(null, request.getName()));
    }

    public Publisher updatePublisher(Long id, SimpleRequest request) {
        Publisher pub = publisherRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        pub.setName(request.getName());
        return publisherRepository.save(pub);
    }

    public void deletePublisher(Long id) {
        publisherRepository.deleteById(id);
    }
}