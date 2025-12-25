package com.example.libraryBe.dto;

import com.example.libraryBe.model.RoleEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {
    private String token;
    private String username;
    private String name;
    private RoleEnum role;      // Trả về Role để FE điều hướng
    private String avatarUrl;
}