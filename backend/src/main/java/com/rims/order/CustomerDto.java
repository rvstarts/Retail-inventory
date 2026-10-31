package com.rims.order;

import jakarta.validation.constraints.Email;
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
public class CustomerDto {
    private Long id;

    @NotBlank(message = "Customer code is required")
    private String customerCode;

    @NotBlank(message = "Customer name is required")
    private String name;

    @NotBlank(message = "Customer email is required")
    @Email(message = "Email must be valid")
    private String email;

    private String phone;
    private String shippingAddress;
    private String city;
    private String state;
    private String postalCode;
    private Instant createdAt;

    public static CustomerDto from(Customer c) {
        return CustomerDto.builder()
                .id(c.getId())
                .customerCode(c.getCustomerCode())
                .name(c.getName())
                .email(c.getEmail())
                .phone(c.getPhone())
                .shippingAddress(c.getShippingAddress())
                .city(c.getCity())
                .state(c.getState())
                .postalCode(c.getPostalCode())
                .createdAt(c.getCreatedAt())
                .build();
    }
}

