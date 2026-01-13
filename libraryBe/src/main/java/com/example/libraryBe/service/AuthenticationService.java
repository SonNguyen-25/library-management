package com.example.libraryBe.service;

import com.example.libraryBe.config.JwtService;
import com.example.libraryBe.dto.AuthenticationRequest;
import com.example.libraryBe.dto.AuthenticationResponse;
import com.example.libraryBe.dto.RegisterRequest;
import com.example.libraryBe.entity.Role;
import com.example.libraryBe.entity.User;
import com.example.libraryBe.model.RoleEnum;
import com.example.libraryBe.repository.RoleRepository;
import com.example.libraryBe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username đã tồn tại");
        }

        Role userRole = roleRepository.findByName(RoleEnum.USER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));

        var user = User.builder()
                .username(request.getUsername())
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(new HashSet<>(Set.of(userRole)))
                .status("Active")
                .avatarUrl("https://ui-avatars.com/api/?name=" + request.getName().replace(" ", "+"))
                .joinedDate(LocalDateTime.now())
                .build();

        userRepository.save(user);

        // Sinh Token ngay sau khi đăng ký thành công
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .username(user.getUsername())
                .name(user.getName())
                .role(user.getRoles().stream().findFirst().get().getName())
                .avatarUrl(user.getAvatarUrl())
                .email(user.getEmail())
                .joinedDate(user.getJoinedDate().toString())
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        // Spring Security tự động kiểm tra user/pass
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        // Tìm user để tạo Token
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow();

        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .username(user.getUsername())
                .name(user.getName())
                .role(user.getRoles().stream().findFirst().get().getName())
                .avatarUrl(user.getAvatarUrl())
                .email(user.getEmail())
                .joinedDate(user.getJoinedDate().toString())
                .build();
    }
}