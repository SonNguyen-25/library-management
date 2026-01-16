package com.example.libraryBe.service;

import com.example.libraryBe.dto.ReviewRequest;
import com.example.libraryBe.entity.Book;
import com.example.libraryBe.entity.Review;
import com.example.libraryBe.entity.User;
import com.example.libraryBe.repository.BookRepository;
import com.example.libraryBe.repository.ReviewRepository;
import com.example.libraryBe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public List<Review> getReviewsByBook(Long bookId) {
        return reviewRepository.findByBookIdOrderByCreatedAtDesc(bookId);
    }

    @Transactional
    public Review addReview(String username, ReviewRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        Review existingReview = reviewRepository.findByUserIdAndBookId(user.getId(), book.getId());

        Review reviewToSave;

        if (existingReview != null) {
            existingReview.setRating(request.getRating());
            existingReview.setComment(request.getComment());
            existingReview.setCreatedAt(java.time.LocalDateTime.now());
            reviewToSave = existingReview;
        } else {
            reviewToSave = Review.builder()
                    .user(user)
                    .book(book)
                    .rating(request.getRating())
                    .comment(request.getComment())
                    .build();
        }

        Review savedReview = reviewRepository.save(reviewToSave);
        updateBookRating(book);
        return savedReview;
    }

    private void updateBookRating(Book book) {
        List<Review> reviews = reviewRepository.findByBookIdOrderByCreatedAtDesc(book.getId());
        if (reviews.isEmpty()) {
            book.setRating(0.0);
        } else {
            double sum = 0;
            for (Review r : reviews) {
                sum += r.getRating();
            }
            double average = sum / reviews.size();
            // Làm tròn 1 chữ số thập phân
            book.setRating(Math.round(average * 10.0) / 10.0);
        }
        bookRepository.save(book);
    }

    @Transactional
    public void deleteReview(Long reviewId, String username) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Bạn không có quyền xóa đánh giá này!");
        }

        Book book = review.getBook();
        reviewRepository.delete(review);
        updateBookRating(book);
    }
}