package com.rims.product;

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
public class ProductResponseDto {
    private Long id;
    private String name;
    private String sku;
    private String barcode;
    private String description;
    private Long categoryId;
    private String categoryName;
    private String categoryCode;
    private String brand;
    private BigDecimal purchasePrice;
    private BigDecimal sellingPrice;
    private Integer minStockLevel;
    private Integer reorderPoint;
    private String imageUrl;
    private String status;
    private Integer totalStock;
    private Integer totalReserved;
    private Integer availableStock;
    private Instant createdAt;
    private Instant updatedAt;

    public static ProductResponseDto from(Product p, int totalStock, int totalReserved) {
        return ProductResponseDto.builder()
                .id(p.getId())
                .name(p.getName())
                .sku(p.getSku())
                .barcode(p.getBarcode())
                .description(p.getDescription())
                .categoryId(p.getCategory() != null ? p.getCategory().getId() : null)
                .categoryName(p.getCategory() != null ? p.getCategory().getName() : null)
                .categoryCode(p.getCategory() != null ? p.getCategory().getCode() : null)
                .brand(p.getBrand())
                .purchasePrice(p.getPurchasePrice())
                .sellingPrice(p.getSellingPrice())
                .minStockLevel(p.getMinStockLevel())
                .reorderPoint(p.getReorderPoint())
                .imageUrl(p.getImageUrl())
                .status(p.getStatus())
                .totalStock(totalStock)
                .totalReserved(totalReserved)
                .availableStock(Math.max(0, totalStock - totalReserved))
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}

