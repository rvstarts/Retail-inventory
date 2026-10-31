package com.rims.category;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDto {
    private Long id;

    @NotBlank(message = "Category name is required")
    private String name;

    @NotBlank(message = "Category code is required")
    private String code;

    private String description;
    private Long parentId;
    private Boolean isActive;
    private Instant createdAt;

    public static CategoryDto from(Category c) {
        return CategoryDto.builder()
                .id(c.getId())
                .name(c.getName())
                .code(c.getCode())
                .description(c.getDescription())
                .parentId(c.getParentId())
                .isActive(c.getIsActive())
                .createdAt(c.getCreatedAt())
                .build();
    }
}

