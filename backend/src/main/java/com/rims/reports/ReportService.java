package com.rims.reports;

import com.rims.category.CategoryRepository;
import com.rims.inventory.Inventory;
import com.rims.inventory.InventoryDto;
import com.rims.inventory.InventoryRepository;
import com.rims.order.CustomerOrder;
import com.rims.order.CustomerOrderRepository;
import com.rims.order.OrderItem;
import com.rims.product.Product;
import com.rims.product.ProductRepository;
import com.rims.purchaseorder.PurchaseOrder;
import com.rims.purchaseorder.PurchaseOrderRepository;
import com.rims.stock.StockTransaction;
import com.rims.stock.StockTransactionRepository;
import com.rims.supplier.Supplier;
import com.rims.supplier.SupplierRepository;
import com.rims.warehouse.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final StockTransactionRepository stockTransactionRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final CustomerOrderRepository orderRepository;
    private final SupplierRepository supplierRepository;
    private final WarehouseRepository warehouseRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public Map<String, Object> getInventorySummaryReport(Long warehouseId, Long categoryId) {
        List<Inventory> list = inventoryRepository.findAll();
        if (warehouseId != null) {
            list = list.stream().filter(i -> i.getWarehouse() != null && i.getWarehouse().getId().equals(warehouseId)).toList();
        }
        if (categoryId != null) {
            list = list.stream().filter(i -> i.getProduct() != null && i.getProduct().getCategory() != null && i.getProduct().getCategory().getId().equals(categoryId)).toList();
        }

        int totalUnits = list.stream().mapToInt(i -> i.getQuantity() != null ? i.getQuantity() : 0).sum();
        int totalReserved = list.stream().mapToInt(i -> i.getReservedQuantity() != null ? i.getReservedQuantity() : 0).sum();
        BigDecimal totalValue = list.stream()
                .map(i -> (i.getProduct() != null ? i.getProduct().getPurchasePrice() : BigDecimal.ZERO).multiply(BigDecimal.valueOf(i.getQuantity() != null ? i.getQuantity() : 0)))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return Map.of(
                "reportTitle", "Inventory Summary Report",
                "generatedAt", new Date(),
                "totalRecords", list.size(),
                "totalUnits", totalUnits,
                "totalReserved", totalReserved,
                "totalValuation", totalValue,
                "items", list.stream().map(InventoryDto::from).toList()
        );
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getLowStockReport() {
        List<Inventory> list = inventoryRepository.findLowStockInventories();
        return Map.of(
                "reportTitle", "Low Stock Alert Report",
                "generatedAt", new Date(),
                "totalLowStockItems", list.size(),
                "items", list.stream().map(InventoryDto::from).toList()
        );
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getOutOfStockReport() {
        List<Inventory> list = inventoryRepository.findOutOfStockInventories();
        return Map.of(
                "reportTitle", "Out-of-Stock Critical Report",
                "generatedAt", new Date(),
                "totalOutOfStockItems", list.size(),
                "items", list.stream().map(InventoryDto::from).toList()
        );
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getStockMovementReport() {
        List<StockTransaction> txs = stockTransactionRepository.findAll();
        int totalInbound = txs.stream().filter(t -> t.getQuantityChange() > 0).mapToInt(StockTransaction::getQuantityChange).sum();
        int totalOutbound = Math.abs(txs.stream().filter(t -> t.getQuantityChange() < 0).mapToInt(StockTransaction::getQuantityChange).sum());

        return Map.of(
                "reportTitle", "Stock Movement & Ledger Audit Report",
                "generatedAt", new Date(),
                "totalTransactions", txs.size(),
                "totalInboundUnits", totalInbound,
                "totalOutboundUnits", totalOutbound,
                "summaryByType", stockTransactionRepository.getMovementSummaryByType()
        );
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getInventoryValuationReport() {
        List<Object[]> byWarehouse = inventoryRepository.getValuationByWarehouse();
        BigDecimal totalValuation = inventoryRepository.getTotalInventoryValuation();

        List<Map<String, Object>> warehouseList = new ArrayList<>();
        for (Object[] r : byWarehouse) {
            warehouseList.add(Map.of("warehouse", r[0], "valuation", r[1]));
        }

        return Map.of(
                "reportTitle", "Inventory Asset Valuation Report",
                "generatedAt", new Date(),
                "totalInventoryValuation", totalValuation,
                "warehouseBreakdown", warehouseList
        );
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getPurchaseOrderReport() {
        List<PurchaseOrder> pos = purchaseOrderRepository.findAll();
        BigDecimal totalSpend = pos.stream().map(PurchaseOrder::getTotalAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

        return Map.of(
                "reportTitle", "Procurement & Purchase Order Report",
                "generatedAt", new Date(),
                "totalOrders", pos.size(),
                "totalProcurementSpend", totalSpend,
                "completedCount", pos.stream().filter(p -> "RECEIVED".equalsIgnoreCase(p.getStatus())).count(),
                "pendingCount", pos.stream().filter(p -> !"RECEIVED".equalsIgnoreCase(p.getStatus()) && !"CANCELLED".equalsIgnoreCase(p.getStatus())).count()
        );
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getSalesOrderReport() {
        List<CustomerOrder> orders = orderRepository.findAll();
        BigDecimal totalRevenue = orders.stream()
                .filter(o -> !"CANCELLED".equalsIgnoreCase(o.getStatus()))
                .map(CustomerOrder::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return Map.of(
                "reportTitle", "Sales Order Fulfillment Report",
                "generatedAt", new Date(),
                "totalOrders", orders.size(),
                "grossRevenue", totalRevenue,
                "deliveredCount", orders.stream().filter(o -> "DELIVERED".equalsIgnoreCase(o.getStatus())).count(),
                "inFulfillmentCount", orders.stream().filter(o -> List.of("CONFIRMED", "PROCESSING", "PICKED", "PACKED", "SHIPPED").contains(o.getStatus())).count()
        );
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getProductPerformanceReport() {
        List<Object[]> topRows = orderRepository.getTopSellingProducts();
        List<Map<String, Object>> list = new ArrayList<>();
        for (Object[] row : topRows) {
            list.add(Map.of(
                    "productId", row[0],
                    "productName", row[1],
                    "sku", row[2],
                    "unitsSold", row[3],
                    "revenue", row[4]
            ));
        }

        return Map.of(
                "reportTitle", "Product Velocity & Sales Performance Report",
                "generatedAt", new Date(),
                "topPerformers", list
        );
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getSupplierPerformanceReport() {
        List<Object[]> stats = purchaseOrderRepository.getSupplierPerformanceStats();
        List<Map<String, Object>> supplierMetrics = new ArrayList<>();

        for (Object[] row : stats) {
            long total = (long) row[1];
            long received = (long) row[2];
            double fulfillmentRate = total > 0 ? (double) received / total * 100.0 : 100.0;

            supplierMetrics.add(Map.of(
                    "supplierName", row[0],
                    "totalPOs", total,
                    "completedPOs", received,
                    "rating", row[3] != null ? row[3] : 4.5,
                    "fulfillmentRate", Math.round(fulfillmentRate * 10.0) / 10.0
            ));
        }

        return Map.of(
                "reportTitle", "Vendor & Supplier Performance Scorecard",
                "generatedAt", new Date(),
                "suppliers", supplierMetrics
        );
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getInventoryTurnoverReport() {
        // Turnover ratio = Cost of Goods Sold / Average Inventory
        BigDecimal totalValuation = inventoryRepository.getTotalInventoryValuation();
        List<CustomerOrder> deliveredOrders = orderRepository.findAll().stream()
                .filter(o -> "DELIVERED".equalsIgnoreCase(o.getStatus())).toList();

        BigDecimal cogs = deliveredOrders.stream()
                .flatMap(o -> o.getItems().stream())
                .map(item -> (item.getProduct() != null ? item.getProduct().getPurchasePrice() : BigDecimal.ZERO)
                        .multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        double turnoverRatio = totalValuation.compareTo(BigDecimal.ZERO) > 0
                ? cogs.divide(totalValuation, 4, RoundingMode.HALF_UP).doubleValue() * 12.0
                : 4.8;

        return Map.of(
                "reportTitle", "Annualized Inventory Turnover Ratio Report",
                "generatedAt", new Date(),
                "cogsTotal", cogs,
                "averageInventoryValuation", totalValuation,
                "turnoverRatioAnnualized", Math.round(turnoverRatio * 100.0) / 100.0,
                "daysSalesOfInventory", Math.round((365.0 / (turnoverRatio > 0 ? turnoverRatio : 4.8)) * 10.0) / 10.0
        );
    }
}

