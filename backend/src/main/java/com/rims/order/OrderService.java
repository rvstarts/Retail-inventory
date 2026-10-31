package com.rims.order;

import com.rims.audit.AuditLog;
import com.rims.audit.AuditLogRepository;
import com.rims.common.exception.BadRequestException;
import com.rims.common.exception.InsufficientStockException;
import com.rims.common.exception.ResourceNotFoundException;
import com.rims.common.response.PagedResponse;
import com.rims.inventory.Inventory;
import com.rims.inventory.InventoryRepository;
import com.rims.notification.Notification;
import com.rims.notification.NotificationRepository;
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
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final CustomerOrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final StoreRepository storeRepository;
    private final InventoryRepository inventoryRepository;
    private final OrderStatusHistoryRepository statusHistoryRepository;
    private final StockTransactionRepository stockTransactionRepository;
    private final NotificationRepository notificationRepository;
    private final AuditLogRepository auditLogRepository;

    @Transactional(readOnly = true)
    public PagedResponse<OrderResponseDto> getAllOrders(String status, Long customerId, Pageable pageable) {
        Page<CustomerOrder> page = orderRepository.filterOrders(
                status != null && !status.isBlank() ? status : null,
                customerId,
                pageable
        );
        return PagedResponse.from(page.map(o -> {
            List<OrderStatusHistory> history = statusHistoryRepository.findByOrderIdOrderByCreatedAtDesc(o.getId());
            return OrderResponseDto.from(o, history);
        }));
    }

    @Transactional(readOnly = true)
    public OrderResponseDto getOrderById(Long id) {
        CustomerOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CustomerOrder", "id", id));
        List<OrderStatusHistory> history = statusHistoryRepository.findByOrderIdOrderByCreatedAtDesc(order.getId());
        return OrderResponseDto.from(order, history);
    }

    @Transactional(readOnly = true)
    public OrderResponseDto getOrderByOrderNumber(String orderNumber) {
        CustomerOrder order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("CustomerOrder", "orderNumber", orderNumber));
        List<OrderStatusHistory> history = statusHistoryRepository.findByOrderIdOrderByCreatedAtDesc(order.getId());
        return OrderResponseDto.from(order, history);
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public OrderResponseDto createOrder(CreateOrderRequest request, User currentUser) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", request.getCustomerId()));

        Warehouse warehouse = null;
        Store store = null;
        if (request.getWarehouseId() != null) {
            warehouse = warehouseRepository.findById(request.getWarehouseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Warehouse", "id", request.getWarehouseId()));
        } else if (request.getStoreId() != null) {
            store = storeRepository.findById(request.getStoreId())
                    .orElseThrow(() -> new ResourceNotFoundException("Store", "id", request.getStoreId()));
        } else {
            // Default to warehouse 1 (Mumbai Hub)
            warehouse = warehouseRepository.findAll().stream().findFirst().orElse(null);
        }

        String orderNumber = "ORD-" + (System.currentTimeMillis() % 10000000);
        BigDecimal totalAmount = BigDecimal.ZERO;

        CustomerOrder order = CustomerOrder.builder()
                .orderNumber(orderNumber)
                .customer(customer)
                .warehouse(warehouse)
                .store(store)
                .status("CONFIRMED")
                .notes(request.getNotes())
                .createdBy(currentUser)
                .items(new ArrayList<>())
                .build();

        for (CreateOrderRequest.OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "id", itemReq.getProductId()));

            // Find inventory and check availability
            Inventory inventory;
            if (warehouse != null) {
                inventory = inventoryRepository.findByProductIdAndWarehouseIdForUpdate(product.getId(), warehouse.getId())
                        .orElseThrow(() -> new InsufficientStockException("No inventory record found for product at selected warehouse"));
            } else {
                inventory = inventoryRepository.findByProductIdAndStoreIdForUpdate(product.getId(), store.getId())
                        .orElseThrow(() -> new InsufficientStockException("No inventory record found for product at selected store"));
            }

            if (inventory.getAvailableQuantity() < itemReq.getQuantity()) {
                throw new InsufficientStockException(product.getId(), itemReq.getQuantity(), inventory.getAvailableQuantity());
            }

            // Reserve stock
            inventory.setReservedQuantity(inventory.getReservedQuantity() + itemReq.getQuantity());
            inventoryRepository.save(inventory);

            BigDecimal lineTotal = product.getSellingPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            totalAmount = totalAmount.add(lineTotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .unitPrice(product.getSellingPrice())
                    .totalPrice(lineTotal)
                    .isReserved(true)
                    .build();

            order.getItems().add(orderItem);
        }

        order.setTotalAmount(totalAmount);
        order = orderRepository.save(order);

        // Record status history
        statusHistoryRepository.save(OrderStatusHistory.builder()
                .order(order)
                .fromStatus(null)
                .toStatus("CONFIRMED")
                .comments("Order created and stock reserved successfully")
                .changedBy(currentUser)
                .build());

        // Audit log
        auditLogRepository.save(AuditLog.builder()
                .user(currentUser)
                .username(currentUser != null ? currentUser.getUsername() : "system")
                .action("CREATE_ORDER")
                .entityName("CUSTOMER_ORDER")
                .entityId(String.valueOf(order.getId()))
                .details("Created order " + order.getOrderNumber() + " total: " + totalAmount)
                .createdAt(Instant.now())
                .build());

        List<OrderStatusHistory> history = statusHistoryRepository.findByOrderIdOrderByCreatedAtDesc(order.getId());
        return OrderResponseDto.from(order, history);
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public OrderResponseDto updateOrderStatus(Long orderId, String targetStatus, String comments, User currentUser) {
        CustomerOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("CustomerOrder", "id", orderId));

        String fromStatus = order.getStatus();
        if (fromStatus.equalsIgnoreCase(targetStatus)) {
            return getOrderById(orderId);
        }

        // Business rules for status transitions
        if ("CANCELLED".equalsIgnoreCase(targetStatus)) {
            // Release reserved stock if not yet shipped
            if (!"SHIPPED".equalsIgnoreCase(fromStatus) && !"DELIVERED".equalsIgnoreCase(fromStatus)) {
                for (OrderItem item : order.getItems()) {
                    if (Boolean.TRUE.equals(item.getIsReserved())) {
                        releaseReservedStock(item.getProduct(), order.getWarehouse(), order.getStore(), item.getQuantity());
                        item.setIsReserved(false);
                    }
                }
            }
        } else if ("SHIPPED".equalsIgnoreCase(targetStatus)) {
            // Deduct physical inventory and release reservation
            for (OrderItem item : order.getItems()) {
                fulfillStock(item.getProduct(), order.getWarehouse(), order.getStore(), item.getQuantity(), order.getOrderNumber(), currentUser);
                item.setIsReserved(false);
            }
            if (order.getShippingTrackingNumber() == null || order.getShippingTrackingNumber().isBlank()) {
                order.setShippingTrackingNumber("BD-EXP-" + (System.currentTimeMillis() % 10000000));
                order.setShippingCarrier("BlueDart Express");
            }
        }

        order.setStatus(targetStatus.toUpperCase());
        order = orderRepository.save(order);

        statusHistoryRepository.save(OrderStatusHistory.builder()
                .order(order)
                .fromStatus(fromStatus)
                .toStatus(order.getStatus())
                .comments(comments != null ? comments : "Status updated to " + order.getStatus())
                .changedBy(currentUser)
                .build());

        // Notify customer / staff if delivered or shipped
        if ("SHIPPED".equalsIgnoreCase(targetStatus) || "DELIVERED".equalsIgnoreCase(targetStatus)) {
            notificationRepository.save(Notification.builder()
                    .title("Order Update: " + order.getOrderNumber())
                    .message(String.format("Order %s has transitioned to %s via %s (AWB: %s)",
                            order.getOrderNumber(), order.getStatus(),
                            order.getShippingCarrier() != null ? order.getShippingCarrier() : "Standard Courier",
                            order.getShippingTrackingNumber() != null ? order.getShippingTrackingNumber() : "N/A"))
                    .type("ORDER_STATUS")
                    .isRead(false)
                    .referenceLink("/orders")
                    .build());
        }

        List<OrderStatusHistory> history = statusHistoryRepository.findByOrderIdOrderByCreatedAtDesc(order.getId());
        return OrderResponseDto.from(order, history);
    }

    private void releaseReservedStock(Product product, Warehouse wh, Store st, int qty) {
        Inventory inv;
        if (wh != null) {
            inv = inventoryRepository.findByProductIdAndWarehouseIdForUpdate(product.getId(), wh.getId()).orElse(null);
        } else if (st != null) {
            inv = inventoryRepository.findByProductIdAndStoreIdForUpdate(product.getId(), st.getId()).orElse(null);
        } else {
            return;
        }

        if (inv != null) {
            int currentReserved = inv.getReservedQuantity() != null ? inv.getReservedQuantity() : 0;
            inv.setReservedQuantity(Math.max(0, currentReserved - qty));
            inventoryRepository.save(inv);
        }
    }

    private void fulfillStock(Product product, Warehouse wh, Store st, int qty, String orderNumber, User user) {
        Inventory inv;
        String locType;
        if (wh != null) {
            locType = "WAREHOUSE";
            inv = inventoryRepository.findByProductIdAndWarehouseIdForUpdate(product.getId(), wh.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Inventory not found at fulfillment warehouse"));
        } else {
            locType = "STORE";
            inv = inventoryRepository.findByProductIdAndStoreIdForUpdate(product.getId(), st.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Inventory not found at fulfillment store"));
        }

        int currentQty = inv.getQuantity() != null ? inv.getQuantity() : 0;
        int currentReserved = inv.getReservedQuantity() != null ? inv.getReservedQuantity() : 0;

        inv.setQuantity(Math.max(0, currentQty - qty));
        inv.setReservedQuantity(Math.max(0, currentReserved - qty));
        inventoryRepository.save(inv);

        stockTransactionRepository.save(StockTransaction.builder()
                .product(product)
                .locationType(locType)
                .warehouse(wh)
                .store(st)
                .transactionType("FULFILLMENT_OUT")
                .quantityChange(-qty)
                .quantityAfter(inv.getQuantity())
                .referenceId(orderNumber)
                .notes("Order fulfillment shipment")
                .createdBy(user)
                .build());
    }
}

