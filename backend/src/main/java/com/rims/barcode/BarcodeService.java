package com.rims.barcode;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.oned.Code128Writer;
import com.rims.common.exception.BadRequestException;
import com.rims.common.exception.ResourceNotFoundException;
import com.rims.inventory.Inventory;
import com.rims.inventory.InventoryRepository;
import com.rims.inventory.StockInRequest;
import com.rims.inventory.StockOutRequest;
import com.rims.inventory.InventoryService;
import com.rims.product.Product;
import com.rims.product.ProductRepository;
import com.rims.product.ProductResponseDto;
import com.rims.user.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class BarcodeService {

    private final ProductRepository productRepository;
    private final BarcodeRecordRepository barcodeRecordRepository;
    private final InventoryRepository inventoryRepository;
    private final InventoryService inventoryService;

    public Map<String, String> generateCode128Barcode(String barcodeText) {
        if (barcodeText == null || barcodeText.isBlank()) {
            throw new BadRequestException("Barcode text cannot be empty");
        }

        try {
            Code128Writer writer = new Code128Writer();
            BitMatrix bitMatrix = writer.encode(barcodeText, BarcodeFormat.CODE_128, 300, 100);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            byte[] imageBytes = outputStream.toByteArray();

            String base64Image = Base64.getEncoder().encodeToString(imageBytes);

            Map<String, String> result = new HashMap<>();
            result.put("barcode", barcodeText);
            result.put("format", "CODE_128");
            result.put("imageDataUrl", "data:image/png;base64," + base64Image);
            return result;
        } catch (Exception e) {
            log.error("Failed to generate barcode for: {}", barcodeText, e);
            throw new BadRequestException("Failed to generate barcode image: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public Map<String, Object> searchProductByBarcode(String barcode) {
        Product product = productRepository.findByBarcode(barcode)
                .orElseThrow(() -> new ResourceNotFoundException("No product found matching barcode: " + barcode));

        List<Inventory> inventories = inventoryRepository.findByProductId(product.getId());
        int totalStock = inventories.stream().mapToInt(i -> i.getQuantity() != null ? i.getQuantity() : 0).sum();
        int totalReserved = inventories.stream().mapToInt(i -> i.getReservedQuantity() != null ? i.getReservedQuantity() : 0).sum();

        Map<String, Object> response = new HashMap<>();
        response.put("product", ProductResponseDto.from(product, totalStock, totalReserved));
        response.put("barcodeData", generateCode128Barcode(barcode));
        response.put("locationInventories", inventories.stream().map(inv -> Map.of(
                "locationType", inv.getLocationType(),
                "locationName", inv.getWarehouse() != null ? inv.getWarehouse().getName() : inv.getStore().getName(),
                "quantity", inv.getQuantity(),
                "availableQuantity", inv.getAvailableQuantity(),
                "reorderPoint", inv.getReorderPoint()
        )).toList());

        return response;
    }

    @Transactional
    public Map<String, Object> scanStockIn(String barcode, String locationType, Long locationId, int quantity, User currentUser) {
        Product product = productRepository.findByBarcode(barcode)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with barcode: " + barcode));

        StockInRequest request = StockInRequest.builder()
                .productId(product.getId())
                .locationType(locationType)
                .warehouseId("WAREHOUSE".equalsIgnoreCase(locationType) ? locationId : null)
                .storeId("STORE".equalsIgnoreCase(locationType) ? locationId : null)
                .quantity(quantity)
                .referenceId("BARCODE-SCAN-" + barcode)
                .notes("Stock received via camera/scanner barcode scan")
                .build();

        return Map.of(
                "message", "Stock-in processed successfully via barcode",
                "inventory", inventoryService.stockIn(request, currentUser),
                "barcode", barcode
        );
    }

    @Transactional
    public Map<String, Object> scanStockOut(String barcode, String locationType, Long locationId, int quantity, String reason, User currentUser) {
        Product product = productRepository.findByBarcode(barcode)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with barcode: " + barcode));

        StockOutRequest request = StockOutRequest.builder()
                .productId(product.getId())
                .locationType(locationType)
                .warehouseId("WAREHOUSE".equalsIgnoreCase(locationType) ? locationId : null)
                .storeId("STORE".equalsIgnoreCase(locationType) ? locationId : null)
                .quantity(quantity)
                .reason(reason != null ? reason : "BARCODE_DISPATCH")
                .referenceId("BARCODE-SCAN-" + barcode)
                .notes("Stock dispatched via camera/scanner barcode scan")
                .build();

        return Map.of(
                "message", "Stock-out processed successfully via barcode",
                "inventory", inventoryService.stockOut(request, currentUser),
                "barcode", barcode
        );
    }
}

