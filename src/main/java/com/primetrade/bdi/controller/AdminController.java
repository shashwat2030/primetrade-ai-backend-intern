package com.primetrade.bdi.controller;

import com.primetrade.bdi.dto.TaskResponse;
import com.primetrade.bdi.repository.TaskRepository;
import com.primetrade.bdi.repository.UserRepository;
import com.primetrade.bdi.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Admins Only")

public class AdminController {
    private final UserRepository userRepository;
    private final TaskService taskService;
    private final TaskRepository taskRepository;

    @GetMapping("/users")
    @Operation(summary = "Welcome Admins")

    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<Map<String, Object>> safeUsers = userRepository.findAll().stream().map(user -> Map.<String, Object>of(
                        "id", user.getId(),
                        "name", user.getName(),
                        "email", user.getEmail(),
                        "role", user.getRole().name()
                )
        ).collect(Collectors.toList());

        return ResponseEntity.ok(safeUsers);
    }

    @GetMapping("/tasks")
    @Operation(summary = "All Admins Welcomed")
    public ResponseEntity<List<TaskResponse>> getAllTasks() {
        List<TaskResponse> allTasks = taskRepository.findAll().stream().map(taskService::toResponse).collect(Collectors.toList());
        return ResponseEntity.ok(allTasks);
    }

    @DeleteMapping("/users/{id}")
    @Operation(summary = "Delete User by Admin Only")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Missing User");
        }
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
