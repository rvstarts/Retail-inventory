package com.rims.reports;

import com.rims.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@Tag(name = "Business Reports", description = "Endpoints for 10 enterprise retail reports: Inventory, Movement, Low-Stock, Valuation, PO, Sales, Turnover")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/inventory-summary")
    @Operation(summary = "1. Inventory Summary Report")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getInventorySummary(
            @RequestParam(required = false) Long warehouseId,
            @RequestParam(required = false) Long categoryId
    ) {
        return ResponseEntity.ok(ApiResponse.success(reportService.getInventorySummaryReport(warehouseId, categoryId)));
    }

    @GetMapping("/stock-movement")
    @Operation(summary = "2. Stock Movement & Ledger Report")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStockMovement() {
        return ResponseEntity.ok(ApiResponse.success(reportService.getStockMovementReport()));
    }

    @GetMapping("/low-stock")
    @Operation(summary = "3. Low Stock Alert Report")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getLowStockReport() {
        return ResponseEntity.ok(ApiResponse.success(reportService.getLowStockReport()));
    }

    @GetMapping("/out-of-stock")
    @Operation(summary = "4. Out-of-Stock Critical Report")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOutOfStockReport() {
        return ResponseEntity.ok(ApiResponse.success(reportService.getOutOfStockReport()));
    }

    @GetMapping("/valuation")
    @Operation(summary = "5. Inventory Asset Valuation Report")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getValuationReport() {
        return ResponseEntity.ok(ApiResponse.success(reportService.getInventoryValuationReport()));
    }

    @GetMapping("/purchase-orders")
    @Operation(summary = "6. Purchase Order & Procurement Report")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPurchaseOrderReport() {
        return ResponseEntity.ok(ApiResponse.success(reportService.getPurchaseOrderReport()));
    }

    @GetMapping("/sales-orders")
    @Operation(summary = "7. Sales Order Fulfillment Report")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSalesOrderReport() {
        return ResponseEntity.ok(ApiResponse.success(reportService.getSalesOrderReport()));
    }

    @GetMapping("/product-performance")
    @Operation(summary = "8. Product Velocity & Sales Performance Report")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProductPerformance() {
        return ResponseEntity.ok(ApiResponse.success(reportService.getProductPerformanceReport()));
    }

    @GetMapping("/supplier-performance")
    @Operation(summary = "9. Supplier Performance Scorecard Report")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSupplierPerformance() {
        return ResponseEntity.ok(ApiResponse.success(reportService.getSupplierPerformanceReport()));
    }

    @GetMapping("/inventory-turnover")
    @Operation(summary = "10. Inventory Turnover & Days of Inventory Report")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getInventoryTurnover() {
        return ResponseEntity.ok(ApiResponse.success(reportService.getInventoryTurnoverReport()));
    }
}

