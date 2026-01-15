package com.example.libraryBe.service;

import com.example.libraryBe.dto.FineRequest;
import com.example.libraryBe.entity.BookLoan;
import com.example.libraryBe.repository.BookLoanRepository;
import com.example.libraryBe.entity.Fine;
import com.example.libraryBe.entity.User;
import com.example.libraryBe.repository.FineRepository;
import com.example.libraryBe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FineService {

    private final FineRepository fineRepository;
    private final UserRepository userRepository;
    private final BookLoanRepository loanRepository;

    public List<Fine> getMyFines(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return fineRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Fine> getAllFines() {
        return fineRepository.findAllByOrderByCreatedAtDesc();
    }
    // Admin tạo phạt thủ công
    public Fine createFine(FineRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found: " + request.getUsername()));

        BookLoan loan = null;
        if (request.getBookLoanId() != null) {
            loan = loanRepository.findById(request.getBookLoanId()).orElse(null);
        }

        Fine fine = Fine.builder()
                .user(user)
                .bookLoan(loan) // Có thể null
                .amount(request.getAmount())
                .description(request.getDescription())
                .build();

        return fineRepository.save(fine);
    }

    public void deleteFine(Long id) {
        if (!fineRepository.existsById(id)) {
            throw new RuntimeException("Fine not found!");
        }
        fineRepository.deleteById(id);
    }
}