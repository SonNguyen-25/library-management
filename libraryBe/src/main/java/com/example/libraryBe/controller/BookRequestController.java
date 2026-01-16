package com.example.libraryBe.controller;

import com.example.libraryBe.dto.LoanRequest;
import com.example.libraryBe.entity.BookRequest;
import com.example.libraryBe.service.BookRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/requests")
@RequiredArgsConstructor
public class BookRequestController {

    private final BookRequestService requestService;

    @PostMapping("/borrow")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> createBorrowRequest(
            @RequestBody LoanRequest requestDTO,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        requestService.createBorrowRequest(userDetails.getUsername(), requestDTO.getBookId());
        return ResponseEntity.ok("Yêu cầu mượn sách đã được gửi thành công! Vui lòng chờ Admin duyệt.");
    }

    @GetMapping("/my-requests")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<BookRequest>> getMyRequests(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(requestService.getMyRequests(userDetails.getUsername()));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasAuthority('LOAN_READ')")
    public ResponseEntity<List<BookRequest>> getAllRequests() {
        return ResponseEntity.ok(requestService.getAllRequests());
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasAuthority('LOAN_APPROVE')")
    public ResponseEntity<?> processRequest(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        try {
            requestService.processRequest(id, status);
            return ResponseEntity.ok("Xử lý yêu cầu thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> cancelRequest(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        requestService.cancelRequest(id, userDetails.getUsername());
        return ResponseEntity.ok("Đã hủy yêu cầu thành công!");
    }
}