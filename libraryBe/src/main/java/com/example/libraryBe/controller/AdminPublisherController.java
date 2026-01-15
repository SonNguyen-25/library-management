package com.example.libraryBe.controller;

import com.example.libraryBe.dto.SimpleRequest;
import com.example.libraryBe.entity.Publisher;
import com.example.libraryBe.service.PublisherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/publishers")
@RequiredArgsConstructor
public class AdminPublisherController {
    private final PublisherService publisherService;

    @GetMapping
    public ResponseEntity<List<Publisher>> getAll() { return ResponseEntity.ok(publisherService.getAllPublishers()); }

    @PostMapping
    public ResponseEntity<Publisher> create(@RequestBody SimpleRequest request) { return ResponseEntity.ok(publisherService.createPublisher(request)); }

    @PutMapping("/{id}")
    public ResponseEntity<Publisher> update(@PathVariable Long id, @RequestBody SimpleRequest request) { return ResponseEntity.ok(publisherService.updatePublisher(id, request)); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        publisherService.deletePublisher(id);
        return ResponseEntity.ok().build();
    }
}