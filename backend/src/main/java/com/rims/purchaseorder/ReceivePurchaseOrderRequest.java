package com.rims.purchaseorder;

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
public class ReceivePurchaseOrderRequest {

    @NotEmpty(message = "Items to receive must be specified")
    private List<ReceiveItem> items;

    private String notes;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReceiveItem {
        private Long purchaseOrderItemId;
        private Integer quantityToReceive;
    }
}

