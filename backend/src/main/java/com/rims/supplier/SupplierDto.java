package com.rims.supplier;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupplierDto {
    private Long id;

    @NotBlank(message = "Supplier code is required")
    private String code;

    @NotBlank(message = "Supplier name is required")
    private String name;

    private String contactPerson;

    @NotBlank(message = "Supplier email is required")
    @Email(message = "Supplier email must be valid")
    private String email;

    private String phone;
    private String address;
    private String gstin;
    private String paymentTerms;
    private BigDecimal rating;
    private Boolean isActive;
    private Instant createdAt;

    public static SupplierDto from(Supplier s) {
        return SupplierDto.builder()
                .id(s.getId())
                .code(s.getCode())
                .name(s.getName())
                .contactPerson(s.getContactPerson())
                .email(s.getEmail())
                .phone(s.getPhone())
                .address(s.getAddress())
                .gstin(s.getGstin())
                .paymentTerms(s.getPaymentTerms())
                .rating(s.getRating())
                .isActive(s.getIsActive())
                .createdAt(s.getCreatedAt())
                .build();
    }
}

