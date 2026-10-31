package com.rims.purchaseorder;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePurchaseOrderRequest {

    @NotNull(message = "Supplier ID is required")
    private Long supplierId;

    @NotNull(message = "Destination warehouse ID is required")
    private Long warehouseId;

    private LocalDate expectedDeliveryDate;
    private String notes;

    @NotEmpty(message = "At least one product item is required in the purchase order")
    private List<PurchaseItemRequest> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PurchaseItemRequest {
        @NotNull(message = "Product ID is required")
        private Long productId;

        @NotNull(message = "Ordered quantity is required")
        private Integer orderedQuantity;

        private BigDecimal unitCost;
    }
}

