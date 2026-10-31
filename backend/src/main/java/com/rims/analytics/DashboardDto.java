package com.rims.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDto {
    // 10 Key Performance Indicators
    private long totalProducts;
    private long totalWarehouses;
    private long totalStores;
    private long totalInventoryUnits;
    private BigDecimal totalInventoryValue;
    private long lowStockProducts;
    private long outOfStockProducts;
    private long pendingOrders;
    private long completedOrders;
    private long totalSuppliers;

    // Charts & Analytics Data
    private List<Map<String, Object>> stockByCategory;
    private List<Map<String, Object>> valuationByWarehouse;
    private List<Map<String, Object>> orderStatusDistribution;
    private List<Map<String, Object>> topSellingProducts;
    private List<Map<String, Object>> stockMovementSummary;
}

