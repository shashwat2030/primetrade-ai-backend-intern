package com.primetrade.bdi.service;

import com.primetrade.bdi.dto.AuthResponse;
import com.primetrade.bdi.dto.LoginRequest;
import com.primetrade.bdi.dto.RegisterRequest;
import com.primetrade.bdi.entity.User;
import com.primetrade.bdi.repository.UserRepository;
import com.primetrade.bdi.security.CustomUserDetailService;
import com.primetrade.bdi.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
@Slf4j
@Service
@RequiredArgsConstructor

public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final CustomUserDetailService customUserDetailService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByName(request.getName())) {
            throw new RuntimeException("Name not available");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email not available");

        }
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.User)
                .build();


        userRepository.save(user);


        UserDetails userDetails = customUserDetailService.loadUserByUsername(user.getName());

        String token = jwtUtil.generateToken(userDetails);

        log.info("New Registered User:{}",request.getName());

        return AuthResponse.builder()
                .token(token)
                .name(user.getName())
                .role(user.getRole().name())
                .build();
    }

    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getName(), request.getPassword())
        );

        UserDetails userDetails = customUserDetailService.loadUserByUsername(request.getName());


        String token = jwtUtil.generateToken(userDetails);

        User user = userRepository.findByName(request.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        log.info("New Logged In User:{}",request.getName());

        return AuthResponse.builder()
                .token(token)
                .name(user.getName())
                .role(user.getRole().name())
                .build();
    }
}

