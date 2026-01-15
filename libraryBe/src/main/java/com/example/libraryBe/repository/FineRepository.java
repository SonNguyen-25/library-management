package com.example.libraryBe.repository;

import com.example.libraryBe.entity.Fine;
import com.example.libraryBe.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FineRepository extends JpaRepository<Fine, Long> {
    List<Fine> findByUserOrderByCreatedAtDesc(User user);
    List<Fine> findAllByOrderByCreatedAtDesc();
}