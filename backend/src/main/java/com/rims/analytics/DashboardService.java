package com.rims.analytics;

import com.rims.inventory.InventoryRepository;
import com.rims.order.CustomerOrderRepository;
import com.rims.product.ProductRepository;
import com.rims.stock.StockTransactionRepository;
import com.rims.store.StoreRepository;
import com.rims.supplier.SupplierRepository;
import com.rims.warehouse.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final StoreRepository storeRepository;
    private final InventoryRepository inventoryRepository;
    private final CustomerOrderRepository orderRepository;
    private final SupplierRepository supplierRepository;
    private final StockTransactionRepository stockTransactionRepository;

    @Transactional(readOnly = true)
    public DashboardDto getDashboardSummary() {
        long totalProducts = productRepository.count();
        long totalWarehouses = warehouseRepository.count();
        long totalStores = storeRepository.count();
        long totalInventoryUnits = inventoryRepository.getTotalUnitsInStock();
        BigDecimal totalInventoryValue = inventoryRepository.getTotalInventoryValuation();
        long lowStockProducts = inventoryRepository.findLowStockInventories().size();
        long outOfStockProducts = inventoryRepository.findOutOfStockInventories().size();
        long pendingOrders = orderRepository.countByStatus("PENDING") + orderRepository.countByStatus("PROCESSING") + orderRepository.countByStatus("CONFIRMED");
        long completedOrders = orderRepository.countByStatus("DELIVERED");
        long totalSuppliers = supplierRepository.count();

        // 1. Stock distribution by Category
        List<Map<String, Object>> stockByCategory = new ArrayList<>();
        for (Object[] row : inventoryRepository.getStockDistributionByCategory()) {
            Map<String, Object> map = new HashMap<>();
            map.put("category", row[0] != null ? row[0] : "Uncategorized");
            map.put("units", row[1]);
            stockByCategory.add(map);
        }

        // 2. Inventory value by Warehouse
        List<Map<String, Object>> valuationByWarehouse = new ArrayList<>();
        for (Object[] row : inventoryRepository.getValuationByWarehouse()) {
            Map<String, Object> map = new HashMap<>();
            map.put("warehouse", row[0]);
            map.put("valuation", row[1]);
            valuationByWarehouse.add(map);
        }

        // 3. Order status distribution
        List<Map<String, Object>> orderStatusDist = new ArrayList<>();
        for (Object[] row : orderRepository.getOrderStatusDistribution()) {
            Map<String, Object> map = new HashMap<>();
            map.put("status", row[0]);
            map.put("count", row[1]);
            orderStatusDist.add(map);
        }

        // 4. Top selling products
        List<Map<String, Object>> topSelling = new ArrayList<>();
        List<Object[]> topRows = orderRepository.getTopSellingProducts();
        for (int i = 0; i < Math.min(topRows.size(), 6); i++) {
            Object[] row = topRows.get(i);
            Map<String, Object> map = new HashMap<>();
            map.put("productId", row[0]);
            map.put("productName", row[1]);
            map.put("sku", row[2]);
            map.put("unitsSold", row[3]);
            map.put("totalRevenue", row[4]);
            topSelling.add(map);
        }

        // 5. Stock movement summary
        List<Map<String, Object>> movementSummary = new ArrayList<>();
        for (Object[] row : stockTransactionRepository.getMovementSummaryByType()) {
            Map<String, Object> map = new HashMap<>();
            map.put("type", row[0]);
            map.put("volume", row[1]);
            movementSummary.add(map);
        }

        return DashboardDto.builder()
                .totalProducts(totalProducts)
                .totalWarehouses(totalWarehouses)
                .totalStores(totalStores)
                .totalInventoryUnits(totalInventoryUnits)
                .totalInventoryValue(totalInventoryValue)
                .lowStockProducts(lowStockProducts)
                .outOfStockProducts(outOfStockProducts)
                .pendingOrders(pendingOrders)
                .completedOrders(completedOrders)
                .totalSuppliers(totalSuppliers)
                .stockByCategory(stockByCategory)
                .valuationByWarehouse(valuationByWarehouse)
                .orderStatusDistribution(orderStatusDist)
                .topSellingProducts(topSelling)
                .stockMovementSummary(movementSummary)
                .build();
    }
}

