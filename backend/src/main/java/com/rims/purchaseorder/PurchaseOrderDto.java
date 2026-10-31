package com.rims.purchaseorder;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderDto {
    private Long id;
    private String poNumber;
    private Long supplierId;
    private String supplierName;
    private String supplierCode;
    private Long warehouseId;
    private String warehouseName;
    private String status;
    private BigDecimal totalAmount;
    private LocalDate expectedDeliveryDate;
    private String notes;
    private String createdByUsername;
    private String approvedByUsername;
    private Instant createdAt;
    private Instant updatedAt;
    private List<PurchaseOrderItemDto> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PurchaseOrderItemDto {
        private Long id;
        private Long productId;
        private String productName;
        private String productSku;
        private Integer orderedQuantity;
        private Integer receivedQuantity;
        private BigDecimal unitCost;
        private BigDecimal totalCost;
    }

    public static PurchaseOrderDto from(PurchaseOrder po) {
        return PurchaseOrderDto.builder()
                .id(po.getId())
                .poNumber(po.getPoNumber())
                .supplierId(po.getSupplier() != null ? po.getSupplier().getId() : null)
                .supplierName(po.getSupplier() != null ? po.getSupplier().getName() : null)
                .supplierCode(po.getSupplier() != null ? po.getSupplier().getCode() : null)
                .warehouseId(po.getWarehouse() != null ? po.getWarehouse().getId() : null)
                .warehouseName(po.getWarehouse() != null ? po.getWarehouse().getName() : null)
                .status(po.getStatus())
                .totalAmount(po.getTotalAmount())
                .expectedDeliveryDate(po.getExpectedDeliveryDate())
                .notes(po.getNotes())
                .createdByUsername(po.getCreatedBy() != null ? po.getCreatedBy().getUsername() : null)
                .approvedByUsername(po.getApprovedBy() != null ? po.getApprovedBy().getUsername() : null)
                .createdAt(po.getCreatedAt())
                .updatedAt(po.getUpdatedAt())
                .items(po.getItems() != null ? po.getItems().stream().map(i -> PurchaseOrderItemDto.builder()
                        .id(i.getId())
                        .productId(i.getProduct().getId())
                        .productName(i.getProduct().getName())
                        .productSku(i.getProduct().getSku())
                        .orderedQuantity(i.getOrderedQuantity())
                        .receivedQuantity(i.getReceivedQuantity())
                        .unitCost(i.getUnitCost())
                        .totalCost(i.getTotalCost())
                        .build()).toList() : List.of())
                .build();
    }
}

