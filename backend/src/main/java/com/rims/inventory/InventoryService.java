package com.rims.inventory;

import com.rims.audit.AuditLog;
import com.rims.audit.AuditLogRepository;
import com.rims.common.exception.BadRequestException;
import com.rims.common.exception.InsufficientStockException;
import com.rims.common.exception.ResourceNotFoundException;
import com.rims.common.response.PagedResponse;
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

import java.time.Instant;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final StoreRepository storeRepository;
    private final StockTransactionRepository stockTransactionRepository;
    private final NotificationRepository notificationRepository;
    private final AuditLogRepository auditLogRepository;

    @Transactional(readOnly = true)
    public PagedResponse<InventoryDto> getAllInventory(Pageable pageable) {
        Page<Inventory> page = inventoryRepository.findAll(pageable);
        return PagedResponse.from(page.map(InventoryDto::from));
    }

    @Transactional(readOnly = true)
    public List<InventoryDto> getInventoryByProduct(Long productId) {
        return inventoryRepository.findByProductId(productId).stream().map(InventoryDto::from).toList();
    }

    @Transactional(readOnly = true)
    public List<InventoryDto> getInventoryByWarehouse(Long warehouseId) {
        return inventoryRepository.findByWarehouseId(warehouseId).stream().map(InventoryDto::from).toList();
    }

    @Transactional(readOnly = true)
    public List<InventoryDto> getInventoryByStore(Long storeId) {
        return inventoryRepository.findByStoreId(storeId).stream().map(InventoryDto::from).toList();
    }

    @Transactional(readOnly = true)
    public PagedResponse<InventoryDto> getLowStockAlerts(Pageable pageable) {
        Page<Inventory> page = inventoryRepository.findLowStockInventories(pageable);
        return PagedResponse.from(page.map(InventoryDto::from));
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public InventoryDto stockIn(StockInRequest request, User currentUser) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getProductId()));

        Warehouse warehouse = null;
        Store store = null;
        Inventory inventory;

        if ("WAREHOUSE".equalsIgnoreCase(request.getLocationType())) {
            if (request.getWarehouseId() == null) {
                throw new BadRequestException("Warehouse ID is required for WAREHOUSE stock-in");
            }
            warehouse = warehouseRepository.findById(request.getWarehouseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Warehouse", "id", request.getWarehouseId()));
            final Warehouse wh = warehouse;
            inventory = inventoryRepository.findByProductIdAndWarehouseIdForUpdate(product.getId(), warehouse.getId())
                    .orElseGet(() -> Inventory.builder()
                            .product(product)
                            .locationType("WAREHOUSE")
                            .warehouse(wh)
                            .quantity(0)
                            .reservedQuantity(0)
                            .reorderPoint(product.getReorderPoint())
                            .safetyStock(product.getMinStockLevel())
                            .build());
        } else if ("STORE".equalsIgnoreCase(request.getLocationType())) {
            if (request.getStoreId() == null) {
                throw new BadRequestException("Store ID is required for STORE stock-in");
            }
            store = storeRepository.findById(request.getStoreId())
                    .orElseThrow(() -> new ResourceNotFoundException("Store", "id", request.getStoreId()));
            final Store st = store;
            inventory = inventoryRepository.findByProductIdAndStoreIdForUpdate(product.getId(), store.getId())
                    .orElseGet(() -> Inventory.builder()
                            .product(product)
                            .locationType("STORE")
                            .store(st)
                            .quantity(0)
                            .reservedQuantity(0)
                            .reorderPoint(product.getReorderPoint())
                            .safetyStock(product.getMinStockLevel())
                            .build());
        } else {
            throw new BadRequestException("Invalid location type: " + request.getLocationType());
        }

        int previousQty = inventory.getQuantity() != null ? inventory.getQuantity() : 0;
        int newQty = previousQty + request.getQuantity();
        inventory.setQuantity(newQty);
        inventory = inventoryRepository.save(inventory);

        // Record in ledger
        stockTransactionRepository.save(StockTransaction.builder()
                .product(product)
                .locationType(request.getLocationType().toUpperCase())
                .warehouse(warehouse)
                .store(store)
                .transactionType("STOCK_IN")
                .quantityChange(request.getQuantity())
                .quantityAfter(newQty)
                .referenceId(request.getReferenceId() != null ? request.getReferenceId() : "STOCK-IN-MANUAL")
                .notes(request.getNotes())
                .createdBy(currentUser)
                .build());

        return InventoryDto.from(inventory);
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public InventoryDto stockOut(StockOutRequest request, User currentUser) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getProductId()));

        Warehouse warehouse = null;
        Store store = null;
        Inventory inventory;

        if ("WAREHOUSE".equalsIgnoreCase(request.getLocationType())) {
            inventory = inventoryRepository.findByProductIdAndWarehouseIdForUpdate(product.getId(), request.getWarehouseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Inventory not found for product in specified warehouse"));
            warehouse = inventory.getWarehouse();
        } else if ("STORE".equalsIgnoreCase(request.getLocationType())) {
            inventory = inventoryRepository.findByProductIdAndStoreIdForUpdate(product.getId(), request.getStoreId())
                    .orElseThrow(() -> new ResourceNotFoundException("Inventory not found for product in specified store"));
            store = inventory.getStore();
        } else {
            throw new BadRequestException("Invalid location type: " + request.getLocationType());
        }

        int currentQty = inventory.getQuantity() != null ? inventory.getQuantity() : 0;
        int reservedQty = inventory.getReservedQuantity() != null ? inventory.getReservedQuantity() : 0;
        int availableQty = currentQty - reservedQty;

        if (availableQty < request.getQuantity()) {
            throw new InsufficientStockException(product.getId(), request.getQuantity(), availableQty);
        }

        int newQty = currentQty - request.getQuantity();
        if (newQty < 0) {
            throw new BadRequestException("Stock cannot be negative");
        }

        inventory.setQuantity(newQty);
        inventory = inventoryRepository.save(inventory);

        // Record in ledger
        stockTransactionRepository.save(StockTransaction.builder()
                .product(product)
                .locationType(request.getLocationType().toUpperCase())
                .warehouse(warehouse)
                .store(store)
                .transactionType("STOCK_OUT")
                .quantityChange(-request.getQuantity())
                .quantityAfter(newQty)
                .referenceId(request.getReferenceId() != null ? request.getReferenceId() : request.getReason())
                .notes(request.getNotes() != null ? request.getNotes() : "Reason: " + request.getReason())
                .createdBy(currentUser)
                .build());

        // Check low stock trigger
        if (newQty <= inventory.getReorderPoint()) {
            String locationName = warehouse != null ? warehouse.getName() : store != null ? store.getName() : "Location";
            notificationRepository.save(Notification.builder()
                    .recipientUser(currentUser)
                    .title("Low Stock Alert: " + product.getName())
                    .message(String.format("Product %s (%s) has fallen to %d units at %s (Reorder point: %d)",
                            product.getName(), product.getSku(), newQty, locationName, inventory.getReorderPoint()))
                    .type("LOW_STOCK")
                    .isRead(false)
                    .referenceLink("/inventory")
                    .build());
        }

        return InventoryDto.from(inventory);
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public InventoryDto adjustStock(StockAdjustmentRequest request, User currentUser) {
        Inventory inventory = inventoryRepository.findById(request.getInventoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", "id", request.getInventoryId()));

        int currentQty = inventory.getQuantity() != null ? inventory.getQuantity() : 0;
        int reservedQty = inventory.getReservedQuantity() != null ? inventory.getReservedQuantity() : 0;
        int newQty = request.getAdjustedQuantity();

        if (newQty < reservedQty) {
            throw new BadRequestException(String.format(
                    "Adjusted quantity (%d) cannot be less than currently reserved quantity (%d) for pending customer orders",
                    newQty, reservedQty));
        }

        int diff = newQty - currentQty;
        inventory.setQuantity(newQty);
        inventory.setLastAuditAt(Instant.now());
        inventory = inventoryRepository.save(inventory);

        // Record in ledger
        stockTransactionRepository.save(StockTransaction.builder()
                .product(inventory.getProduct())
                .locationType(inventory.getLocationType())
                .warehouse(inventory.getWarehouse())
                .store(inventory.getStore())
                .transactionType("ADJUSTMENT")
                .quantityChange(diff)
                .quantityAfter(newQty)
                .referenceId("ADJUST-" + request.getReason())
                .notes(request.getNotes() != null ? request.getNotes() : request.getReason())
                .createdBy(currentUser)
                .build());

        // Audit log
        auditLogRepository.save(AuditLog.builder()
                .user(currentUser)
                .username(currentUser != null ? currentUser.getUsername() : "system")
                .action("STOCK_ADJUST")
                .entityName("INVENTORY")
                .entityId(String.valueOf(inventory.getId()))
                .details(String.format("Adjusted physical stock from %d to %d (Diff: %+d). Reason: %s",
                        currentQty, newQty, diff, request.getReason()))
                .createdAt(Instant.now())
                .build());

        return InventoryDto.from(inventory);
    }

    @Transactional
    public InventoryDto performAudit(Long inventoryId, User currentUser) {
        Inventory inventory = inventoryRepository.findById(inventoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", "id", inventoryId));

        inventory.setLastAuditAt(Instant.now());
        inventory = inventoryRepository.save(inventory);

        auditLogRepository.save(AuditLog.builder()
                .user(currentUser)
                .username(currentUser != null ? currentUser.getUsername() : "system")
                .action("INVENTORY_AUDIT")
                .entityName("INVENTORY")
                .entityId(String.valueOf(inventoryId))
                .details(String.format("Physical inventory verification confirmed for product %s at %s. Verified quantity: %d",
                        inventory.getProduct().getName(),
                        inventory.getWarehouse() != null ? inventory.getWarehouse().getName() : inventory.getStore().getName(),
                        inventory.getQuantity()))
                .createdAt(Instant.now())
                .build());

        return InventoryDto.from(inventory);
    }
}

