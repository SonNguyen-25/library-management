package com.example.libraryBe.controller;

import com.example.libraryBe.entity.BookLoan;
import com.example.libraryBe.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;

    // GET /api/v1/loans/my-loans?status=BORROWED
    @GetMapping("/my-loans")
    public ResponseEntity<List<BookLoan>> getMyLoans(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String status // Nhận tham số filter
    ) {
        return ResponseEntity.ok(loanService.getMyLoans(userDetails.getUsername(), status));
    }

    // GET /api/v1/loans/admin/all
    @GetMapping("/admin/all")
    public ResponseEntity<List<BookLoan>> getAllLoans() {
        return ResponseEntity.ok(loanService.getAllLoans());
    }

    // PUT /api/v1/loans/admin/return/{id}
    @PutMapping("/admin/return/{id}")
    public ResponseEntity<String> returnBook(@PathVariable Long id) {
        loanService.returnBook(id);
        return ResponseEntity.ok("Trả sách thành công!");
    }
}