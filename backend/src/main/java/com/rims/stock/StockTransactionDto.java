package com.rims.stock;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockTransactionDto {
    private Long id;
    private Long productId;
    private String productName;
    private String productSku;
    private String productBarcode;
    private String locationType;
    private Long warehouseId;
    private String warehouseName;
    private Long storeId;
    private String storeName;
    private String transactionType;
    private Integer quantityChange;
    private Integer quantityAfter;
    private String referenceId;
    private String notes;
    private String createdByUsername;
    private Instant createdAt;

    public static StockTransactionDto from(StockTransaction st) {
        return StockTransactionDto.builder()
                .id(st.getId())
                .productId(st.getProduct() != null ? st.getProduct().getId() : null)
                .productName(st.getProduct() != null ? st.getProduct().getName() : null)
                .productSku(st.getProduct() != null ? st.getProduct().getSku() : null)
                .productBarcode(st.getProduct() != null ? st.getProduct().getBarcode() : null)
                .locationType(st.getLocationType())
                .warehouseId(st.getWarehouse() != null ? st.getWarehouse().getId() : null)
                .warehouseName(st.getWarehouse() != null ? st.getWarehouse().getName() : null)
                .storeId(st.getStore() != null ? st.getStore().getId() : null)
                .storeName(st.getStore() != null ? st.getStore().getName() : null)
                .transactionType(st.getTransactionType())
                .quantityChange(st.getQuantityChange())
                .quantityAfter(st.getQuantityAfter())
                .referenceId(st.getReferenceId())
                .notes(st.getNotes())
                .createdByUsername(st.getCreatedBy() != null ? st.getCreatedBy().getUsername() : "System")
                .createdAt(st.getCreatedAt())
                .build();
    }
}

