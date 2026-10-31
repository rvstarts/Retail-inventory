package com.rims.returns;

import com.rims.audit.AuditLog;
import com.rims.audit.AuditLogRepository;
import com.rims.common.exception.ResourceNotFoundException;
import com.rims.common.response.PagedResponse;
import com.rims.inventory.Inventory;
import com.rims.inventory.InventoryRepository;
import com.rims.order.CustomerOrder;
import com.rims.order.CustomerOrderRepository;
import com.rims.product.Product;
import com.rims.product.ProductRepository;
import com.rims.stock.StockTransaction;
import com.rims.stock.StockTransactionRepository;
import com.rims.store.Store;
import com.rims.store.StoreRepository;
import com.rims.user.User;
import com.rims.warehouse.Warehouse;
import com.rims.warehouse.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class ReturnService {

    private final ReturnOrderRepository returnOrderRepository;
    private final CustomerOrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final StoreRepository storeRepository;
    private final InventoryRepository inventoryRepository;
    private final StockTransactionRepository stockTransactionRepository;
    private final AuditLogRepository auditLogRepository;

    @Transactional(readOnly = true)
    public PagedResponse<ReturnDto> getAllReturns(String status, Pageable pageable) {
        Page<ReturnOrder> page;
        if (status != null && !status.isBlank()) {
            page = returnOrderRepository.findByStatus(status, pageable);
        } else {
            page = returnOrderRepository.findAll(pageable);
        }
        return PagedResponse.from(page.map(ReturnDto::from));
    }

    @Transactional(readOnly = true)
    public ReturnDto getReturnById(Long id) {
        ReturnOrder ro = returnOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ReturnOrder", "id", id));
        return ReturnDto.from(ro);
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public ReturnDto createReturn(CreateReturnRequest request, User currentUser) {
        CustomerOrder order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("CustomerOrder", "id", request.getOrderId()));

        Warehouse wh = request.getRestockWarehouseId() != null
                ? warehouseRepository.findById(request.getRestockWarehouseId()).orElse(order.getWarehouse())
                : order.getWarehouse();

        Store st = request.getRestockStoreId() != null
                ? storeRepository.findById(request.getRestockStoreId()).orElse(order.getStore())
                : order.getStore();

        String returnNumber = "RET-" + (System.currentTimeMillis() % 10000000);
        BigDecimal refundAmount = BigDecimal.ZERO;

        ReturnOrder returnOrder = ReturnOrder.builder()
                .returnNumber(returnNumber)
                .order(order)
                .reason(request.getReason())
                .status("PENDING")
                .restockWarehouse(wh)
                .restockStore(st)
                .createdBy(currentUser)
                .items(new ArrayList<>())
                .build();

        for (CreateReturnRequest.ReturnItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "id", itemReq.getProductId()));

            BigDecimal lineRefund = product.getSellingPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            refundAmount = refundAmount.add(lineRefund);

            ReturnItem returnItem = ReturnItem.builder()
                    .returnOrder(returnOrder)
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .condition(itemReq.getCondition() != null ? itemReq.getCondition().toUpperCase() : "RESTOCKABLE")
                    .isRestocked(false)
                    .build();

            returnOrder.getItems().add(returnItem);
        }

        returnOrder.setRefundAmount(refundAmount);
        returnOrder = returnOrderRepository.save(returnOrder);

        order.setStatus("RETURN_REQUESTED");
        orderRepository.save(order);

        return ReturnDto.from(returnOrder);
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public ReturnDto processReturn(Long id, String action, User currentUser) {
        ReturnOrder returnOrder = returnOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ReturnOrder", "id", id));

        if ("RESTOCK".equalsIgnoreCase(action)) {
            for (ReturnItem item : returnOrder.getItems()) {
                if ("RESTOCKABLE".equalsIgnoreCase(item.getCondition()) && !Boolean.TRUE.equals(item.getIsRestocked())) {
                    restockItem(item.getProduct(), returnOrder.getRestockWarehouse(), returnOrder.getRestockStore(), item.getQuantity(), returnOrder.getReturnNumber(), currentUser);
                    item.setIsRestocked(true);
                }
            }
            returnOrder.setStatus("RESTOCKED");
        } else if ("REFUND".equalsIgnoreCase(action)) {
            returnOrder.setStatus("REFUNDED");
            if (returnOrder.getOrder() != null) {
                returnOrder.getOrder().setStatus("REFUNDED");
                orderRepository.save(returnOrder.getOrder());
            }
        } else if ("REJECT".equalsIgnoreCase(action)) {
            returnOrder.setStatus("REJECTED");
        }

        returnOrder = returnOrderRepository.save(returnOrder);

        auditLogRepository.save(AuditLog.builder()
                .user(currentUser)
                .username(currentUser != null ? currentUser.getUsername() : "system")
                .action("PROCESS_RETURN")
                .entityName("RETURN_ORDER")
                .entityId(String.valueOf(returnOrder.getId()))
                .details("Processed return " + returnOrder.getReturnNumber() + " with action: " + action)
                .createdAt(Instant.now())
                .build());

        return ReturnDto.from(returnOrder);
    }

    private void restockItem(Product product, Warehouse wh, Store st, int qty, String ref, User user) {
        Inventory inv;
        String locType;
        if (wh != null) {
            locType = "WAREHOUSE";
            inv = inventoryRepository.findByProductIdAndWarehouseIdForUpdate(product.getId(), wh.getId())
                    .orElseGet(() -> Inventory.builder()
                            .product(product)
                            .locationType("WAREHOUSE")
                            .warehouse(wh)
                            .quantity(0)
                            .reservedQuantity(0)
                            .reorderPoint(product.getReorderPoint())
                            .safetyStock(product.getMinStockLevel())
                            .build());
        } else {
            locType = "STORE";
            inv = inventoryRepository.findByProductIdAndStoreIdForUpdate(product.getId(), st != null ? st.getId() : 1L)
                    .orElseGet(() -> Inventory.builder()
                            .product(product)
                            .locationType("STORE")
                            .store(st)
                            .quantity(0)
                            .reservedQuantity(0)
                            .reorderPoint(product.getReorderPoint())
                            .safetyStock(product.getMinStockLevel())
                            .build());
        }

        inv.setQuantity((inv.getQuantity() != null ? inv.getQuantity() : 0) + qty);
        inventoryRepository.save(inv);

        stockTransactionRepository.save(StockTransaction.builder()
                .product(product)
                .locationType(locType)
                .warehouse(wh)
                .store(st)
                .transactionType("RETURN_IN")
                .quantityChange(qty)
                .quantityAfter(inv.getQuantity())
                .referenceId(ref)
                .notes("Return restocking inspection pass")
                .createdBy(user)
                .build());
    }
}

