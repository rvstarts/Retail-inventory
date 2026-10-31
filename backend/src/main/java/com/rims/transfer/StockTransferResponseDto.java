package com.rims.transfer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockTransferResponseDto {
    private Long id;
    private String transferNumber;
    private String sourceType;
    private Long sourceWarehouseId;
    private String sourceWarehouseName;
    private Long sourceStoreId;
    private String sourceStoreName;
    private String destType;
    private Long destWarehouseId;
    private String destWarehouseName;
    private Long destStoreId;
    private String destStoreName;
    private String status;
    private String trackingNotes;
    private String createdByUsername;
    private String approvedByUsername;
    private Instant createdAt;
    private Instant updatedAt;
    private List<TransferItemDto> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TransferItemDto {
        private Long id;
        private Long productId;
        private String productName;
        private String productSku;
        private Integer quantity;
        private Integer receivedQuantity;
    }

    public static StockTransferResponseDto from(StockTransfer st) {
        return StockTransferResponseDto.builder()
                .id(st.getId())
                .transferNumber(st.getTransferNumber())
                .sourceType(st.getSourceType())
                .sourceWarehouseId(st.getSourceWarehouse() != null ? st.getSourceWarehouse().getId() : null)
                .sourceWarehouseName(st.getSourceWarehouse() != null ? st.getSourceWarehouse().getName() : null)
                .sourceStoreId(st.getSourceStore() != null ? st.getSourceStore().getId() : null)
                .sourceStoreName(st.getSourceStore() != null ? st.getSourceStore().getName() : null)
                .destType(st.getDestType())
                .destWarehouseId(st.getDestWarehouse() != null ? st.getDestWarehouse().getId() : null)
                .destWarehouseName(st.getDestWarehouse() != null ? st.getDestWarehouse().getName() : null)
                .destStoreId(st.getDestStore() != null ? st.getDestStore().getId() : null)
                .destStoreName(st.getDestStore() != null ? st.getDestStore().getName() : null)
                .status(st.getStatus())
                .trackingNotes(st.getTrackingNotes())
                .createdByUsername(st.getCreatedBy() != null ? st.getCreatedBy().getUsername() : null)
                .approvedByUsername(st.getApprovedBy() != null ? st.getApprovedBy().getUsername() : null)
                .createdAt(st.getCreatedAt())
                .updatedAt(st.getUpdatedAt())
                .items(st.getItems() != null ? st.getItems().stream().map(i -> TransferItemDto.builder()
                        .id(i.getId())
                        .productId(i.getProduct().getId())
                        .productName(i.getProduct().getName())
                        .productSku(i.getProduct().getSku())
                        .quantity(i.getQuantity())
                        .receivedQuantity(i.getReceivedQuantity())
                        .build()).toList() : List.of())
                .build();
    }
}

