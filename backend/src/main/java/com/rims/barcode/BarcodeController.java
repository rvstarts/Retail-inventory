package com.rims.barcode;

import com.rims.common.response.ApiResponse;
import com.rims.user.User;
import com.rims.user.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/barcodes")
@RequiredArgsConstructor
@Tag(name = "Barcode Integration", description = "Endpoints for Code 128 barcode generation, camera scanner lookups, and scan-to-stock operations")
public class BarcodeController {

    private final BarcodeService barcodeService;
    private final UserRepository userRepository;

    @GetMapping("/generate")
    @Operation(summary = "Generate Code 128 barcode PNG Base64 image")
    public ResponseEntity<ApiResponse<Map<String, String>>> generateBarcode(@RequestParam String text) {
        return ResponseEntity.ok(ApiResponse.success(barcodeService.generateCode128Barcode(text)));
    }

    @GetMapping("/search")
    @Operation(summary = "Search product information and stock by scanning or entering barcode")
    public ResponseEntity<ApiResponse<Map<String, Object>>> searchByBarcode(@RequestParam String barcode) {
        return ResponseEntity.ok(ApiResponse.success(barcodeService.searchProductByBarcode(barcode)));
    }

    @PostMapping("/scan-stock-in")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'WAREHOUSE_MANAGER', 'STORE_MANAGER', 'INVENTORY_STAFF')")
    @Operation(summary = "Process instant stock-in by scanning product barcode")
    public ResponseEntity<ApiResponse<Map<String, Object>>> scanStockIn(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String barcode = (String) body.get("barcode");
        String locationType = (String) body.get("locationType");
        Long locationId = Long.valueOf(body.get("locationId").toString());
        int quantity = Integer.parseInt(body.getOrDefault("quantity", "1").toString());

        User user = userDetails != null ? userRepository.findByUsername(userDetails.getUsername()).orElse(null) : null;
        return ResponseEntity.ok(ApiResponse.success(barcodeService.scanStockIn(barcode, locationType, locationId, quantity, user)));
    }

    @PostMapping("/scan-stock-out")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'WAREHOUSE_MANAGER', 'STORE_MANAGER', 'INVENTORY_STAFF')")
    @Operation(summary = "Process instant stock-out by scanning product barcode")
    public ResponseEntity<ApiResponse<Map<String, Object>>> scanStockOut(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String barcode = (String) body.get("barcode");
        String locationType = (String) body.get("locationType");
        Long locationId = Long.valueOf(body.get("locationId").toString());
        int quantity = Integer.parseInt(body.getOrDefault("quantity", "1").toString());
        String reason = (String) body.get("reason");

        User user = userDetails != null ? userRepository.findByUsername(userDetails.getUsername()).orElse(null) : null;
        return ResponseEntity.ok(ApiResponse.success(barcodeService.scanStockOut(barcode, locationType, locationId, quantity, reason, user)));
    }
}

