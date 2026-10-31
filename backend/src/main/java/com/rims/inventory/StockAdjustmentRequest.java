package com.rims.inventory;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockAdjustmentRequest {

    @NotNull(message = "Inventory ID is required")
    private Long inventoryId;

    @NotNull(message = "Adjusted physical quantity count is required")
    @Min(value = 0, message = "Adjusted quantity cannot be negative")
    private Integer adjustedQuantity;

    @NotBlank(message = "Adjustment reason is required (e.g. AUDIT_DISCREPANCY, DAMAGE, SCRAP)")
    private String reason;

    private String notes;
}

