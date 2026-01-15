package com.example.libraryBe.controller;

import com.example.libraryBe.entity.Notification;
import com.example.libraryBe.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(notificationService.getMyNotifications(userDetails.getUsername()));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> countUnread(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(notificationService.countUnread(userDetails.getUsername()));
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(@AuthenticationPrincipal UserDetails userDetails) {
        notificationService.markAllAsRead(userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    // DELETE /api/v1/notifications/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNotification(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        notificationService.deleteNotification(id, userDetails.getUsername());
        return ResponseEntity.ok("Deleted notification.");
    }

    // DELETE /api/v1/notifications/delete-all
    @DeleteMapping("/delete-all")
    public ResponseEntity<String> deleteAllNotifications(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        notificationService.deleteAllNotifications(userDetails.getUsername());
        return ResponseEntity.ok("Deleted all notifications.");
    }
}