package com.example.libraryBe.config;

import com.example.libraryBe.entity.*;
import com.example.libraryBe.model.*;
import com.example.libraryBe.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (permissionRepository.count() == 0) {
            for (PermissionEnum permissionEnum : PermissionEnum.values()) {
                Permission permission = Permission.builder()
                        .name(permissionEnum)
                        .description(permissionEnum.getDescription())
                        .build();
                permissionRepository.save(permission);
            }
        }
        if (roleRepository.count() == 0) {
            createRole(RoleEnum.USER, Set.of());
            createRole(RoleEnum.SUPER_ADMIN, Set.of(PermissionEnum.values()));
            createRole(RoleEnum.LIBRARY_MANAGER, Set.of(
                    PermissionEnum.BOOK_READ, PermissionEnum.BOOK_CREATE,
                    PermissionEnum.BOOK_UPDATE, PermissionEnum.BOOK_DELETE,
                    PermissionEnum.CATEGORY_MANAGE, PermissionEnum.AUTHOR_MANAGE
            ));
            createRole(RoleEnum.USER_MANAGER, Set.of(
                    PermissionEnum.USER_READ, PermissionEnum.USER_UPDATE,
                    PermissionEnum.USER_BAN
            ));
            createRole(RoleEnum.CIRCULATION_MANAGER, Set.of(
                    PermissionEnum.LOAN_READ, PermissionEnum.LOAN_APPROVE,
                    PermissionEnum.LOAN_RETURN, PermissionEnum.FINE_MANAGE
            ));
        }

        // Khởi tạo Tài khoản Admin mẫu (test)
        if (!userRepository.existsByUsername("admin")) {
            Role adminRole = roleRepository.findByName(RoleEnum.SUPER_ADMIN).orElseThrow();

            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("password")) // Mật khẩu là "password"
                    .name("Super Administrator")
                    .email("admin@library.com")
                    .status("Active")
                    .avatarUrl("https://ui-avatars.com/api/?name=Super+Admin&background=random")
                    .joinedDate(LocalDateTime.now())
                    .roles(new HashSet<>(Set.of(adminRole)))
                    .build();

            userRepository.save(admin);
            System.out.println("Đã tạo tài khoản mẫu: admin / password");
        }
    }

    private void createRole(RoleEnum roleName, Set<PermissionEnum> permissionEnums) {
        Role role = Role.builder()
                .name(roleName)
                .description("Vai trò " + roleName.name())
                .permissions(new HashSet<>())
                .build();

        // Tìm và gán các permission vào role
        for (PermissionEnum pEnum : permissionEnums) {
            permissionRepository.findByName(pEnum).ifPresent(p -> role.getPermissions().add(p));
        }

        roleRepository.save(role);
    }
}