package com.example.libraryBe.dto;

import lombok.Data;

@Data
public class UserRequest {
    private String name;
    private String username;
    private String email;
    private String role;
    private String status;
    // pass mặc định 123456
}