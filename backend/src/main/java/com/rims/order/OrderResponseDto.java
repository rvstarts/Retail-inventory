package com.rims.order;

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
public class OrderResponseDto {
    private Long id;
    private String orderNumber;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String shippingAddress;
    private Long storeId;
    private String storeName;
    private Long warehouseId;
    private String warehouseName;
    private String status;
    private BigDecimal totalAmount;
    private String shippingTrackingNumber;
    private String shippingCarrier;
    private String notes;
    private String createdByUsername;
    private Instant createdAt;
    private Instant updatedAt;
    private List<OrderItemDto> items;
    private List<StatusHistoryDto> statusHistory;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemDto {
        private Long id;
        private Long productId;
        private String productName;
        private String productSku;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal totalPrice;
        private Boolean isReserved;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatusHistoryDto {
        private Long id;
        private String fromStatus;
        private String toStatus;
        private String comments;
        private String changedByUsername;
        private Instant createdAt;
    }

    public static OrderResponseDto from(CustomerOrder o, List<OrderStatusHistory> history) {
        return OrderResponseDto.builder()
                .id(o.getId())
                .orderNumber(o.getOrderNumber())
                .customerId(o.getCustomer() != null ? o.getCustomer().getId() : null)
                .customerName(o.getCustomer() != null ? o.getCustomer().getName() : null)
                .customerEmail(o.getCustomer() != null ? o.getCustomer().getEmail() : null)
                .customerPhone(o.getCustomer() != null ? o.getCustomer().getPhone() : null)
                .shippingAddress(o.getCustomer() != null ? o.getCustomer().getShippingAddress() : null)
                .storeId(o.getStore() != null ? o.getStore().getId() : null)
                .storeName(o.getStore() != null ? o.getStore().getName() : null)
                .warehouseId(o.getWarehouse() != null ? o.getWarehouse().getId() : null)
                .warehouseName(o.getWarehouse() != null ? o.getWarehouse().getName() : null)
                .status(o.getStatus())
                .totalAmount(o.getTotalAmount())
                .shippingTrackingNumber(o.getShippingTrackingNumber())
                .shippingCarrier(o.getShippingCarrier())
                .notes(o.getNotes())
                .createdByUsername(o.getCreatedBy() != null ? o.getCreatedBy().getUsername() : null)
                .createdAt(o.getCreatedAt())
                .updatedAt(o.getUpdatedAt())
                .items(o.getItems() != null ? o.getItems().stream().map(i -> OrderItemDto.builder()
                        .id(i.getId())
                        .productId(i.getProduct().getId())
                        .productName(i.getProduct().getName())
                        .productSku(i.getProduct().getSku())
                        .quantity(i.getQuantity())
                        .unitPrice(i.getUnitPrice())
                        .totalPrice(i.getTotalPrice())
                        .isReserved(i.getIsReserved())
                        .build()).toList() : List.of())
                .statusHistory(history != null ? history.stream().map(h -> StatusHistoryDto.builder()
                        .id(h.getId())
                        .fromStatus(h.getFromStatus())
                        .toStatus(h.getToStatus())
                        .comments(h.getComments())
                        .changedByUsername(h.getChangedBy() != null ? h.getChangedBy().getUsername() : "System")
                        .createdAt(h.getCreatedAt())
                        .build()).toList() : List.of())
                .build();
    }
}

