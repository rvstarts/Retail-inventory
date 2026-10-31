package com.rims.returns;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateReturnRequest {

    @NotNull(message = "Order ID is required")
    private Long orderId;

    @NotBlank(message = "Return reason is required")
    private String reason;

    private Long restockWarehouseId;
    private Long restockStoreId;

    @NotEmpty(message = "At least one product item is required for return")
    private List<ReturnItemRequest> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReturnItemRequest {
        private Long productId;
        private Integer quantity;
        private String condition; // RESTOCKABLE, DAMAGED, DEFECTIVE
    }
}

