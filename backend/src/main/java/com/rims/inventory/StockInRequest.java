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
public class StockInRequest {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotBlank(message = "Location type is required ('WAREHOUSE' or 'STORE')")
    private String locationType;

    private Long warehouseId;
    private Long storeId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Stock-in quantity must be at least 1")
    private Integer quantity;

    private String referenceId;
    private String notes;
}

