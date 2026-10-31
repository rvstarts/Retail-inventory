package com.rims.rfid;

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
public class RfidScanLogDto {
    private Long id;
    private String epcTag;
    private String readerId;
    private String locationType;
    private Long warehouseId;
    private String warehouseName;
    private Long storeId;
    private String storeName;
    private Long productId;
    private String productName;
    private String productSku;
    private String actionType;
    private BigDecimal rssiSignal;
    private Instant scanTimestamp;

    public static RfidScanLogDto from(RfidScanLog log) {
        return RfidScanLogDto.builder()
                .id(log.getId())
                .epcTag(log.getEpcTag())
                .readerId(log.getReaderId())
                .locationType(log.getLocationType())
                .warehouseId(log.getWarehouse() != null ? log.getWarehouse().getId() : null)
                .warehouseName(log.getWarehouse() != null ? log.getWarehouse().getName() : null)
                .storeId(log.getStore() != null ? log.getStore().getId() : null)
                .storeName(log.getStore() != null ? log.getStore().getName() : null)
                .productId(log.getProduct() != null ? log.getProduct().getId() : null)
                .productName(log.getProduct() != null ? log.getProduct().getName() : null)
                .productSku(log.getProduct() != null ? log.getProduct().getSku() : null)
                .actionType(log.getActionType())
                .rssiSignal(log.getRssiSignal())
                .scanTimestamp(log.getScanTimestamp())
                .build();
    }
}

