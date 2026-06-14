package com.primetrade.bdi.dto;

import com.primetrade.bdi.entity.Task;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TaskRequest {
    @NotBlank
    @Size(min=3,max=100)
    private String title;

    private String description;

    @NotNull
    private Task.Status status;


}
