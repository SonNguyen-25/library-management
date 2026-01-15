package com.example.libraryBe.service;

import com.example.libraryBe.entity.Notification;
import com.example.libraryBe.entity.User;
import com.example.libraryBe.repository.NotificationRepository;
import com.example.libraryBe.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public List<Notification> getMyNotifications(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public long countUnread(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    public void markAsRead(Long id) {
        Notification noti = notificationRepository.findById(id).orElseThrow();
        noti.setRead(true);
        notificationRepository.save(noti);
    }
    // Khi user mở thông báo
    public void markAllAsRead(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        List<Notification> list = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        list.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(list);
    }

    public void createNotification(User user, String message) {
        Notification notification = Notification.builder()
                .user(user)
                .message(message)
                .build();
        notificationRepository.save(notification);
    }

    public void deleteNotification(Long id, String username) {
        Notification noti = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (!noti.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized to delete this notification");
        }
        notificationRepository.delete(noti);
    }

    @Transactional
    public void deleteAllNotifications(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Notification> list = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        notificationRepository.deleteAll(list);
    }
}