package com.example.libraryBe.repository;

import com.example.libraryBe.entity.Subscription;
import com.example.libraryBe.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findByUserOrderByCreatedAtDesc(User user);
    boolean existsByUserIdAndBookId(Long userId, Long bookId);
    List<Subscription> findByBookId(Long bookId);
}