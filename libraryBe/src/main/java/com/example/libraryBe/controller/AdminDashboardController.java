package com.example.libraryBe.controller;

import com.example.libraryBe.dto.DashboardResponse;
import com.example.libraryBe.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final AdminDashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboardMetrics() {
        return ResponseEntity.ok(dashboardService.getDashboardData());
    }
}