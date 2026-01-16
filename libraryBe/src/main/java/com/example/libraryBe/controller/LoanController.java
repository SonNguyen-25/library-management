package com.example.libraryBe.controller;

import com.example.libraryBe.entity.BookLoan;
import com.example.libraryBe.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;

    @GetMapping("/my-loans")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<BookLoan>> getMyLoans(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String status
    ) {
        return ResponseEntity.ok(loanService.getMyLoans(userDetails.getUsername(), status));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasAuthority('LOAN_READ')")
    public ResponseEntity<List<BookLoan>> getAllLoans() {
        return ResponseEntity.ok(loanService.getAllLoans());
    }

    @PutMapping("/admin/return/{id}")
    @PreAuthorize("hasAuthority('LOAN_RETURN')")
    public ResponseEntity<String> returnBook(@PathVariable Long id) {
        loanService.returnBook(id);
        return ResponseEntity.ok("Trả sách thành công!");
    }
}