package com.ampta.resume_api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class CreateResumeRequest {

    @NotBlank(message = "Title is required")
    private String title;
}
