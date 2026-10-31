package com.rims.returns;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReturnDto {
    private Long id;
    private String returnNumber;
    private Long orderId;
    private String orderNumber;
    private String customerName;
    private String reason;
    private String status;
    private BigDecimal refundAmount;
    private Long restockWarehouseId;
    private String restockWarehouseName;
    private Long restockStoreId;
    private String restockStoreName;
    private String createdByUsername;
    private Instant createdAt;
    private Instant updatedAt;
    private List<ReturnItemDto> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReturnItemDto {
        private Long id;
        private Long productId;
        private String productName;
        private String productSku;
        private Integer quantity;
        private String condition;
        private Boolean isRestocked;
    }

    public static ReturnDto from(ReturnOrder ro) {
        return ReturnDto.builder()
                .id(ro.getId())
                .returnNumber(ro.getReturnNumber())
                .orderId(ro.getOrder() != null ? ro.getOrder().getId() : null)
                .orderNumber(ro.getOrder() != null ? ro.getOrder().getOrderNumber() : null)
                .customerName(ro.getOrder() != null && ro.getOrder().getCustomer() != null ? ro.getOrder().getCustomer().getName() : null)
                .reason(ro.getReason())
                .status(ro.getStatus())
                .refundAmount(ro.getRefundAmount())
                .restockWarehouseId(ro.getRestockWarehouse() != null ? ro.getRestockWarehouse().getId() : null)
                .restockWarehouseName(ro.getRestockWarehouse() != null ? ro.getRestockWarehouse().getName() : null)
                .restockStoreId(ro.getRestockStore() != null ? ro.getRestockStore().getId() : null)
                .restockStoreName(ro.getRestockStore() != null ? ro.getRestockStore().getName() : null)
                .createdByUsername(ro.getCreatedBy() != null ? ro.getCreatedBy().getUsername() : null)
                .createdAt(ro.getCreatedAt())
                .updatedAt(ro.getUpdatedAt())
                .items(ro.getItems() != null ? ro.getItems().stream().map(i -> ReturnItemDto.builder()
                        .id(i.getId())
                        .productId(i.getProduct().getId())
                        .productName(i.getProduct().getName())
                        .productSku(i.getProduct().getSku())
                        .quantity(i.getQuantity())
                        .condition(i.getCondition())
                        .isRestocked(i.getIsRestocked())
                        .build()).toList() : List.of())
                .build();
    }
}

