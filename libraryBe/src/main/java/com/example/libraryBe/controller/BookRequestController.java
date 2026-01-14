package com.example.libraryBe.controller;

import com.example.libraryBe.dto.LoanRequest;
import com.example.libraryBe.entity.BookRequest;
import com.example.libraryBe.service.BookRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/requests")
@RequiredArgsConstructor
public class BookRequestController {

    private final BookRequestService requestService;

    // POST /api/v1/requests/borrow
    @PostMapping("/borrow")
    public ResponseEntity<String> createBorrowRequest(
            @RequestBody LoanRequest requestDTO,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        requestService.createBorrowRequest(userDetails.getUsername(), requestDTO.getBookId());
        return ResponseEntity.ok("Yêu cầu mượn sách đã được gửi thành công! Vui lòng chờ Admin duyệt.");
    }

    // GET /api/v1/requests/my-requests
    @GetMapping("/my-requests")
    public ResponseEntity<List<BookRequest>> getMyRequests(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(requestService.getMyRequests(userDetails.getUsername()));
    }
    // GET /api/v1/requests/admin/all
    @GetMapping("/admin/all")
    public ResponseEntity<List<BookRequest>> getAllRequests() {
        return ResponseEntity.ok(requestService.getAllRequests());
    }

    // API Admin Approve/Deny
    // PUT /api/v1/requests/admin/{id}?status=ACCEPTED
    @PutMapping("/admin/{id}")
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
    // DELETE /api/v1/requests/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<String> cancelRequest(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        requestService.cancelRequest(id, userDetails.getUsername());
        return ResponseEntity.ok("Đã hủy yêu cầu thành công!");
    }
}