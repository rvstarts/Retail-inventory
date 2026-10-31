package com.rims.purchaseorder;

import com.rims.audit.AuditLog;
import com.rims.audit.AuditLogRepository;
import com.rims.common.exception.BadRequestException;
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
import com.rims.supplier.Supplier;
import com.rims.supplier.SupplierRepository;
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

@Slf4j
@Service
@RequiredArgsConstructor
public class PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final PurchaseOrderItemRepository purchaseOrderItemRepository;
    private final SupplierRepository supplierRepository;
    private final WarehouseRepository warehouseRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final StockTransactionRepository stockTransactionRepository;
    private final NotificationRepository notificationRepository;
    private final AuditLogRepository auditLogRepository;

    @Transactional(readOnly = true)
    public PagedResponse<PurchaseOrderDto> getPurchaseOrders(String status, Long supplierId, Pageable pageable) {
        Page<PurchaseOrder> page = purchaseOrderRepository.filterPurchaseOrders(
                status != null && !status.isBlank() ? status : null,
                supplierId,
                pageable
        );
        return PagedResponse.from(page.map(PurchaseOrderDto::from));
    }

    @Transactional(readOnly = true)
    public PurchaseOrderDto getPurchaseOrderById(Long id) {
        PurchaseOrder po = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PurchaseOrder", "id", id));
        return PurchaseOrderDto.from(po);
    }

    @Transactional
    public PurchaseOrderDto createPurchaseOrder(CreatePurchaseOrderRequest request, User currentUser) {
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", "id", request.getSupplierId()));

        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse", "id", request.getWarehouseId()));

        String poNumber = "PO-" + (System.currentTimeMillis() % 10000000);
        BigDecimal totalAmount = BigDecimal.ZERO;

        PurchaseOrder po = PurchaseOrder.builder()
                .poNumber(poNumber)
                .supplier(supplier)
                .warehouse(warehouse)
                .status("SUBMITTED")
                .expectedDeliveryDate(request.getExpectedDeliveryDate())
                .notes(request.getNotes())
                .createdBy(currentUser)
                .items(new ArrayList<>())
                .build();

        for (CreatePurchaseOrderRequest.PurchaseItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "id", itemReq.getProductId()));

            BigDecimal unitCost = itemReq.getUnitCost() != null ? itemReq.getUnitCost() : product.getPurchasePrice();
            BigDecimal lineTotal = unitCost.multiply(BigDecimal.valueOf(itemReq.getOrderedQuantity()));
            totalAmount = totalAmount.add(lineTotal);

            PurchaseOrderItem item = PurchaseOrderItem.builder()
                    .purchaseOrder(po)
                    .product(product)
                    .orderedQuantity(itemReq.getOrderedQuantity())
                    .receivedQuantity(0)
                    .unitCost(unitCost)
                    .totalCost(lineTotal)
                    .build();

            po.getItems().add(item);
        }

        po.setTotalAmount(totalAmount);
        po = purchaseOrderRepository.save(po);

        auditLogRepository.save(AuditLog.builder()
                .user(currentUser)
                .username(currentUser != null ? currentUser.getUsername() : "system")
                .action("CREATE_PO")
                .entityName("PURCHASE_ORDER")
                .entityId(String.valueOf(po.getId()))
                .details("Created purchase order " + po.getPoNumber() + " with total " + totalAmount)
                .createdAt(Instant.now())
                .build());

        return PurchaseOrderDto.from(po);
    }

    @Transactional
    public PurchaseOrderDto approvePurchaseOrder(Long id, User currentUser) {
        PurchaseOrder po = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PurchaseOrder", "id", id));

        if (!"DRAFT".equalsIgnoreCase(po.getStatus()) && !"SUBMITTED".equalsIgnoreCase(po.getStatus())) {
            throw new BadRequestException("Only DRAFT or SUBMITTED purchase orders can be approved");
        }

        po.setStatus("APPROVED");
        po.setApprovedBy(currentUser);
        po = purchaseOrderRepository.save(po);

        return PurchaseOrderDto.from(po);
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public PurchaseOrderDto receiveGoods(Long id, ReceivePurchaseOrderRequest request, User currentUser) {
        PurchaseOrder po = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PurchaseOrder", "id", id));

        if (!"APPROVED".equalsIgnoreCase(po.getStatus()) && !"PARTIALLY_RECEIVED".equalsIgnoreCase(po.getStatus())) {
            throw new BadRequestException("Cannot receive goods against purchase order with status: " + po.getStatus());
        }

        Warehouse warehouse = po.getWarehouse();

        for (ReceivePurchaseOrderRequest.ReceiveItem recItem : request.getItems()) {
            PurchaseOrderItem orderItem = purchaseOrderItemRepository.findById(recItem.getPurchaseOrderItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("PurchaseOrderItem", "id", recItem.getPurchaseOrderItemId()));

            int qtyToReceive = recItem.getQuantityToReceive();
            int currentRec = orderItem.getReceivedQuantity() != null ? orderItem.getReceivedQuantity() : 0;
            int ordered = orderItem.getOrderedQuantity();

            if (currentRec + qtyToReceive > ordered) {
                throw new BadRequestException(String.format(
                        "Cannot receive %d units for product %s. Already received %d out of %d ordered.",
                        qtyToReceive, orderItem.getProduct().getName(), currentRec, ordered
                ));
            }

            orderItem.setReceivedQuantity(currentRec + qtyToReceive);
            purchaseOrderItemRepository.save(orderItem);

            // Update physical inventory at the warehouse
            Inventory inventory = inventoryRepository.findByProductIdAndWarehouseIdForUpdate(
                    orderItem.getProduct().getId(), warehouse.getId()
            ).orElseGet(() -> Inventory.builder()
                    .product(orderItem.getProduct())
                    .locationType("WAREHOUSE")
                    .warehouse(warehouse)
                    .quantity(0)
                    .reservedQuantity(0)
                    .reorderPoint(orderItem.getProduct().getReorderPoint())
                    .safetyStock(orderItem.getProduct().getMinStockLevel())
                    .build());

            int updatedQty = (inventory.getQuantity() != null ? inventory.getQuantity() : 0) + qtyToReceive;
            inventory.setQuantity(updatedQty);
            inventoryRepository.save(inventory);

            // Record in transaction ledger
            stockTransactionRepository.save(StockTransaction.builder()
                    .product(orderItem.getProduct())
                    .locationType("WAREHOUSE")
                    .warehouse(warehouse)
                    .transactionType("STOCK_IN")
                    .quantityChange(qtyToReceive)
                    .quantityAfter(updatedQty)
                    .referenceId(po.getPoNumber())
                    .notes("Goods receipt against purchase order " + po.getPoNumber() + (request.getNotes() != null ? " - " + request.getNotes() : ""))
                    .createdBy(currentUser)
                    .build());
        }

        // Check if all items fully received
        boolean allFullyReceived = po.getItems().stream()
                .allMatch(i -> i.getReceivedQuantity() >= i.getOrderedQuantity());

        po.setStatus(allFullyReceived ? "RECEIVED" : "PARTIALLY_RECEIVED");
        po = purchaseOrderRepository.save(po);

        // Notify
        notificationRepository.save(Notification.builder()
                .title("Purchase Order Goods Received: " + po.getPoNumber())
                .message(String.format("Goods received for PO %s from %s at %s. Status is now %s.",
                        po.getPoNumber(), po.getSupplier().getName(), warehouse.getName(), po.getStatus()))
                .type("PO_RECEIVED")
                .isRead(false)
                .referenceLink("/purchase-orders")
                .build());

        return PurchaseOrderDto.from(po);
    }
}

