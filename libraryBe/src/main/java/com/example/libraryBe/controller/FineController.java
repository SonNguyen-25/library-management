package com.example.libraryBe.controller;

import com.example.libraryBe.entity.Fine;
import com.example.libraryBe.service.FineService;
import com.example.libraryBe.dto.FineRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/fines")
@RequiredArgsConstructor
public class FineController {

    private final FineService fineService;

    // GET /api/v1/fines/my-fines
    @GetMapping("/my-fines")
    public ResponseEntity<List<Fine>> getMyFines(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(fineService.getMyFines(userDetails.getUsername()));
    }

    // GET /api/v1/fines/admin/all
    @GetMapping("/admin/all")
    public ResponseEntity<List<Fine>> getAllFines() {
        return ResponseEntity.ok(fineService.getAllFines());
    }
    // POST /api/v1/fines/admin/create
    @PostMapping("/admin/create")
    public ResponseEntity<Fine> createFine(@RequestBody FineRequest request) {
        return ResponseEntity.ok(fineService.createFine(request));
    }

    // DELETE /api/v1/fines/admin/{id}
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<String> settleFine(@PathVariable Long id) {
        fineService.deleteFine(id);
        return ResponseEntity.ok("Fine settled successfully!");
    }
}