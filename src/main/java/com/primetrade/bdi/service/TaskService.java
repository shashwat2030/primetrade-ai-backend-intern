package com.primetrade.bdi.service;

import com.primetrade.bdi.dto.TaskRequest;
import com.primetrade.bdi.dto.TaskResponse;
import com.primetrade.bdi.entity.Task;
import com.primetrade.bdi.entity.User;
import com.primetrade.bdi.repository.TaskRepository;
import com.primetrade.bdi.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional

public class TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public List<TaskResponse> getTasksbyUser(String name) {
        return taskRepository.findByUserName(name)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

    }

    public TaskResponse createTask(TaskRequest request, String name) {
        User user = userRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Missing User"));

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus())
                .user(user)
                .build();
        log.info("User Created Task:{}",name);

        return toResponse(taskRepository.save(task));
    }

    public TaskResponse updateTask(Long id, TaskRequest request, String name) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Missing Task"));

        if (!task.getUser().getName().equals(name)) {
            throw new RuntimeException("not a task owner");

        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());

        return toResponse(taskRepository.save(task));
    }

    public void deletetask(Long id, String name) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Missing Task"));
        if (!task.getUser().getName().equals(name)) {
            throw new RuntimeException("not a task owner");
        }
        taskRepository.delete(task);
        log.info("Task {} Deleted Task:{}",id,name);
    }

    public TaskResponse toResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus().getDbValue())
                .ownerName(task.getUser().getName())
                .createdAt(task.getCreatedAt())
              .build();
    }

}
