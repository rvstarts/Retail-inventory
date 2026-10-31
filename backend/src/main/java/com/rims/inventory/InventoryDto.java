package com.rims.inventory;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryDto {
    private Long id;
    private Long productId;
    private String productName;
    private String productSku;
    private String productBarcode;
    private String categoryName;
    private BigDecimal purchasePrice;
    private BigDecimal sellingPrice;
    private String locationType;
    private Long warehouseId;
    private String warehouseName;
    private Long storeId;
    private String storeName;
    private Integer quantity;
    private Integer reservedQuantity;
    private Integer availableQuantity;
    private Integer reorderPoint;
    private Integer safetyStock;
    private Boolean isLowStock;
    private Boolean isOutOfStock;
    private BigDecimal valuation;
    private Instant lastAuditAt;
    private Instant updatedAt;

    public static InventoryDto from(Inventory inv) {
        int qty = inv.getQuantity() != null ? inv.getQuantity() : 0;
        int reserved = inv.getReservedQuantity() != null ? inv.getReservedQuantity() : 0;
        int reorder = inv.getReorderPoint() != null ? inv.getReorderPoint() : 0;
        BigDecimal price = inv.getProduct() != null && inv.getProduct().getPurchasePrice() != null
                ? inv.getProduct().getPurchasePrice() : BigDecimal.ZERO;

        return InventoryDto.builder()
                .id(inv.getId())
                .productId(inv.getProduct() != null ? inv.getProduct().getId() : null)
                .productName(inv.getProduct() != null ? inv.getProduct().getName() : null)
                .productSku(inv.getProduct() != null ? inv.getProduct().getSku() : null)
                .productBarcode(inv.getProduct() != null ? inv.getProduct().getBarcode() : null)
                .categoryName(inv.getProduct() != null && inv.getProduct().getCategory() != null
                        ? inv.getProduct().getCategory().getName() : null)
                .purchasePrice(price)
                .sellingPrice(inv.getProduct() != null ? inv.getProduct().getSellingPrice() : BigDecimal.ZERO)
                .locationType(inv.getLocationType())
                .warehouseId(inv.getWarehouse() != null ? inv.getWarehouse().getId() : null)
                .warehouseName(inv.getWarehouse() != null ? inv.getWarehouse().getName() : null)
                .storeId(inv.getStore() != null ? inv.getStore().getId() : null)
                .storeName(inv.getStore() != null ? inv.getStore().getName() : null)
                .quantity(qty)
                .reservedQuantity(reserved)
                .availableQuantity(Math.max(0, qty - reserved))
                .reorderPoint(reorder)
                .safetyStock(inv.getSafetyStock())
                .isLowStock(qty <= reorder)
                .isOutOfStock(qty == 0)
                .valuation(price.multiply(BigDecimal.valueOf(qty)))
                .lastAuditAt(inv.getLastAuditAt())
                .updatedAt(inv.getUpdatedAt())
                .build();
    }
}

