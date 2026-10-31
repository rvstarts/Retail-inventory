package com.rims.store;

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
public class StoreDto {
    private Long id;

    @NotBlank(message = "Store code is required")
    private String code;

    @NotBlank(message = "Store name is required")
    private String name;

    @NotBlank(message = "Address line is required")
    private String addressLine;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Postal code is required")
    private String postalCode;

    private String contactPhone;
    private String contactEmail;
    private Long assignedWarehouseId;
    private String assignedWarehouseName;
    private Boolean isActive;
    private Instant createdAt;

    public static StoreDto from(Store s) {
        return StoreDto.builder()
                .id(s.getId())
                .code(s.getCode())
                .name(s.getName())
                .addressLine(s.getAddressLine())
                .city(s.getCity())
                .state(s.getState())
                .postalCode(s.getPostalCode())
                .contactPhone(s.getContactPhone())
                .contactEmail(s.getContactEmail())
                .assignedWarehouseId(s.getAssignedWarehouse() != null ? s.getAssignedWarehouse().getId() : null)
                .assignedWarehouseName(s.getAssignedWarehouse() != null ? s.getAssignedWarehouse().getName() : null)
                .isActive(s.getIsActive())
                .createdAt(s.getCreatedAt())
                .build();
    }
}

