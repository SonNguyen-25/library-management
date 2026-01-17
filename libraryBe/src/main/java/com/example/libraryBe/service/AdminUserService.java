package com.example.libraryBe.service;

import com.example.libraryBe.dto.UserRequest;
import com.example.libraryBe.entity.Role;
import com.example.libraryBe.entity.User;
import com.example.libraryBe.model.RoleEnum;
import com.example.libraryBe.repository.RoleRepository;
import com.example.libraryBe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User createUser(UserRequest request) {
        // Validate trùng
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username đã tồn tại!");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại!");
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isSuperAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN_CREATE"));
        if (!isSuperAdmin) {
            String requestedRole = request.getRole().toUpperCase();
            if (requestedRole.contains("ADMIN") || requestedRole.contains("MANAGER")) {
                throw new RuntimeException("Bạn không đủ quyền để tạo tài khoản Quản trị viên!");
            }
        }
        Role role = getRoleByName(request.getRole());

        User user = User.builder()
                .name(request.getName())
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode("123456"))
                .status(request.getStatus())
                .joinedDate(LocalDateTime.now())
                .roles(new HashSet<>(Set.of(role)))
                .build();

        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Long id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isSuperAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN_CREATE"));

        if (!isSuperAdmin) {
            boolean isTargetPrivileged = user.getRoles().stream()
                    .anyMatch(r -> r.getName() != RoleEnum.USER);

            if (isTargetPrivileged) {
                throw new RuntimeException("Bạn không đủ quyền để chỉnh sửa thông tin của Quản trị viên khác!");
            }
            String requestedRole = request.getRole().toUpperCase();
            if (requestedRole.contains("ADMIN") || requestedRole.contains("MANAGER")) {
                throw new RuntimeException("Bạn không được phép thăng cấp tài khoản lên Quản trị viên!");
            }
        }
        user.setName(request.getName());
        if (!request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email '" + request.getEmail() + "' đã được sử dụng bởi tài khoản khác!");
            }
            user.setEmail(request.getEmail());
        }
        user.setStatus(request.getStatus());
        Role newRole = getRoleByName(request.getRole());
        user.getRoles().clear();
        user.getRoles().add(newRole);

        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }

    // Helper: Tìm Role và Validate
    private Role getRoleByName(String roleName) {
        try {
            RoleEnum roleEnum = RoleEnum.valueOf(roleName);
            return roleRepository.findByName(roleEnum)
                    .orElseThrow(() -> new RuntimeException("Role '" + roleName + "' chưa được khởi tạo trong Database (Bảng roles)"));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Role không hợp lệ: " + roleName);
        }
    }
}