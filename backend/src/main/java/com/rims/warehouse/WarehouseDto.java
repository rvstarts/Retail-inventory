package com.rims.warehouse;

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
public class WarehouseDto {
    private Long id;

    @NotBlank(message = "Warehouse code is required")
    private String code;

    @NotBlank(message = "Warehouse name is required")
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
    private Integer capacity;
    private Boolean isActive;
    private Instant createdAt;

    public static WarehouseDto from(Warehouse w) {
        return WarehouseDto.builder()
                .id(w.getId())
                .code(w.getCode())
                .name(w.getName())
                .addressLine(w.getAddressLine())
                .city(w.getCity())
                .state(w.getState())
                .postalCode(w.getPostalCode())
                .contactPhone(w.getContactPhone())
                .contactEmail(w.getContactEmail())
                .capacity(w.getCapacity())
                .isActive(w.getIsActive())
                .createdAt(w.getCreatedAt())
                .build();
    }
}

