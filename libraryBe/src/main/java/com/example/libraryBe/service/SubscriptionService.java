package com.example.libraryBe.service;

import com.example.libraryBe.entity.Book;
import com.example.libraryBe.entity.Subscription;
import com.example.libraryBe.entity.User;
import com.example.libraryBe.repository.BookRepository;
import com.example.libraryBe.repository.SubscriptionRepository;
import com.example.libraryBe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    // Đăng ký
    public void subscribe(String username, Long bookId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (subscriptionRepository.existsByUserIdAndBookId(user.getId(), bookId)) {
            throw new RuntimeException("Bạn đã đăng ký nhận thông báo cho sách này rồi!");
        }

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        Subscription subscription = Subscription.builder()
                .user(user)
                .book(book)
                .build();

        subscriptionRepository.save(subscription);
    }

    public void unsubscribe(Long subscriptionId) {
        subscriptionRepository.deleteById(subscriptionId);
    }

    public List<Subscription> getMySubscriptions(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return subscriptionRepository.findByUserOrderByCreatedAtDesc(user);
    }
}