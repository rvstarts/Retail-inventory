package com.rims.inventory;

import com.rims.common.response.ApiResponse;
import com.rims.common.response.PagedResponse;
import com.rims.user.User;
import com.rims.user.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
@Tag(name = "Inventory Management", description = "Endpoints for real-time stock levels, stock-in, stock-out, audits, and low-stock alerts")
public class InventoryController {

    private final InventoryService inventoryService;
    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Get paginated view of inventory across all locations")
    public ResponseEntity<ApiResponse<PagedResponse<InventoryDto>>> getAllInventory(@PageableDefault(size = 15) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getAllInventory(pageable)));
    }

    @GetMapping("/product/{productId}")
    @Operation(summary = "Get stock distribution for a specific product across all warehouses and stores")
    public ResponseEntity<ApiResponse<List<InventoryDto>>> getByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getInventoryByProduct(productId)));
    }

    @GetMapping("/warehouse/{warehouseId}")
    @Operation(summary = "Get all inventory items located in a warehouse")
    public ResponseEntity<ApiResponse<List<InventoryDto>>> getByWarehouse(@PathVariable Long warehouseId) {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getInventoryByWarehouse(warehouseId)));
    }

    @GetMapping("/store/{storeId}")
    @Operation(summary = "Get all inventory items located in a retail store")
    public ResponseEntity<ApiResponse<List<InventoryDto>>> getByStore(@PathVariable Long storeId) {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getInventoryByStore(storeId)));
    }

    @GetMapping("/low-stock")
    @Operation(summary = "Get inventory items that are at or below reorder threshold")
    public ResponseEntity<ApiResponse<PagedResponse<InventoryDto>>> getLowStockAlerts(@PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getLowStockAlerts(pageable)));
    }

    @PostMapping("/stock-in")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'WAREHOUSE_MANAGER', 'STORE_MANAGER', 'INVENTORY_STAFF')")
    @Operation(summary = "Perform stock-in operation to add units to location")
    public ResponseEntity<ApiResponse<InventoryDto>> stockIn(
            @Valid @RequestBody StockInRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userDetails != null ? userRepository.findByUsername(userDetails.getUsername()).orElse(null) : null;
        return ResponseEntity.ok(ApiResponse.success("Stock received successfully", inventoryService.stockIn(request, user)));
    }

    @PostMapping("/stock-out")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'WAREHOUSE_MANAGER', 'STORE_MANAGER', 'INVENTORY_STAFF')")
    @Operation(summary = "Perform stock-out transaction with availability validation")
    public ResponseEntity<ApiResponse<InventoryDto>> stockOut(
            @Valid @RequestBody StockOutRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userDetails != null ? userRepository.findByUsername(userDetails.getUsername()).orElse(null) : null;
        return ResponseEntity.ok(ApiResponse.success("Stock deducted successfully", inventoryService.stockOut(request, user)));
    }

    @PostMapping("/adjust")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'WAREHOUSE_MANAGER')")
    @Operation(summary = "Adjust physical stock count with audit reason")
    public ResponseEntity<ApiResponse<InventoryDto>> adjustStock(
            @Valid @RequestBody StockAdjustmentRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userDetails != null ? userRepository.findByUsername(userDetails.getUsername()).orElse(null) : null;
        return ResponseEntity.ok(ApiResponse.success("Inventory adjusted successfully", inventoryService.adjustStock(request, user)));
    }

    @PostMapping("/{id}/audit")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'WAREHOUSE_MANAGER', 'STORE_MANAGER')")
    @Operation(summary = "Confirm physical inventory audit verification")
    public ResponseEntity<ApiResponse<InventoryDto>> auditInventory(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userDetails != null ? userRepository.findByUsername(userDetails.getUsername()).orElse(null) : null;
        return ResponseEntity.ok(ApiResponse.success("Audit timestamp recorded", inventoryService.performAudit(id, user)));
    }
}

