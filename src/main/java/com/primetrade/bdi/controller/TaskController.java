package com.primetrade.bdi.controller;

import com.primetrade.bdi.dto.TaskRequest;
import com.primetrade.bdi.dto.TaskResponse;
import com.primetrade.bdi.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
@Tag(name = "Tasks", description = "Crud task-authenticated users")
public class TaskController {
    private final TaskService taskService;

    @GetMapping
    @Operation(summary = "Get all current users")
    public ResponseEntity<List<TaskResponse>> getMyTasks(Authentication authentication) {
        return ResponseEntity.ok(taskService.getTasksbyUser(authentication.getName()));

    }

    @PostMapping
    @Operation(summary = "Create new task")
    public ResponseEntity<TaskResponse> create(@Valid @RequestBody TaskRequest taskRequest, Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.createTask(taskRequest, authentication.getName()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a task")
    public ResponseEntity<TaskResponse> update(@PathVariable Long id, @Valid @RequestBody TaskRequest taskRequest, Authentication authentication) {
        return ResponseEntity.ok(taskService.updateTask(id, taskRequest, authentication.getName()));

    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a task")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        taskService.deletetask(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }


}
