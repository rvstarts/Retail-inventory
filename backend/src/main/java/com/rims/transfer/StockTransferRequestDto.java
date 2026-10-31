package com.rims.transfer;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockTransferRequestDto {

    @NotBlank(message = "Source type is required ('WAREHOUSE' or 'STORE')")
    private String sourceType;

    private Long sourceWarehouseId;
    private Long sourceStoreId;

    @NotBlank(message = "Destination type is required ('WAREHOUSE' or 'STORE')")
    private String destType;

    private Long destWarehouseId;
    private Long destStoreId;

    private String trackingNotes;

    @NotEmpty(message = "At least one product item must be included in the transfer")
    private List<TransferItemRequest> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TransferItemRequest {
        private Long productId;
        private Integer quantity;
    }
}

