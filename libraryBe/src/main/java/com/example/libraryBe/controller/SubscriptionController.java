package com.example.libraryBe.controller;

import com.example.libraryBe.entity.Subscription;
import com.example.libraryBe.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    // POST /api/v1/subscriptions?bookId=1
    @PostMapping
    public ResponseEntity<String> subscribe(
            @RequestParam Long bookId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        subscriptionService.subscribe(userDetails.getUsername(), bookId);
        return ResponseEntity.ok("Đăng ký nhận thông báo thành công!");
    }

    // DELETE /api/v1/subscriptions/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<String> unsubscribe(@PathVariable Long id) {
        subscriptionService.unsubscribe(id);
        return ResponseEntity.ok("Đã hủy đăng ký.");
    }

    // GET /api/v1/subscriptions/my-subscriptions
    @GetMapping("/my-subscriptions")
    public ResponseEntity<List<Subscription>> getMySubscriptions(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(subscriptionService.getMySubscriptions(userDetails.getUsername()));
    }
}