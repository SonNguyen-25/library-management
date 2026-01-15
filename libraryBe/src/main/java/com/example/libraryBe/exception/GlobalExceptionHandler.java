package com.example.libraryBe.exception;

import org.springframework.dao.DataIntegrityViolationException; // Import này quan trọng
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrityViolation(DataIntegrityViolationException e) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Không thể xóa dữ liệu này vì nó đang được sử dụng ở nơi khác");
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException e) {
        Map<String, String> response = new HashMap<>();
        response.put("message", e.getMessage());
        return ResponseEntity.badRequest().body(response);
    }
}