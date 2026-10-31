package com.rims.transfer;

import com.rims.audit.AuditLog;
import com.rims.audit.AuditLogRepository;
import com.rims.common.exception.BadRequestException;
import com.rims.common.exception.InsufficientStockException;
import com.rims.common.exception.ResourceNotFoundException;
import com.rims.common.response.PagedResponse;
import com.rims.inventory.Inventory;
import com.rims.inventory.InventoryRepository;
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
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class StockTransferService {

    private final StockTransferRepository stockTransferRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final StoreRepository storeRepository;
    private final InventoryRepository inventoryRepository;
    private final StockTransactionRepository stockTransactionRepository;
    private final AuditLogRepository auditLogRepository;

    @Transactional(readOnly = true)
    public PagedResponse<StockTransferResponseDto> getAllTransfers(String status, Pageable pageable) {
        Page<StockTransfer> page;
        if (status != null && !status.isBlank()) {
            page = stockTransferRepository.findByStatus(status, pageable);
        } else {
            page = stockTransferRepository.findAll(pageable);
        }
        return PagedResponse.from(page.map(StockTransferResponseDto::from));
    }

    @Transactional(readOnly = true)
    public StockTransferResponseDto getTransferById(Long id) {
        StockTransfer st = stockTransferRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("StockTransfer", "id", id));
        return StockTransferResponseDto.from(st);
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public StockTransferResponseDto createTransfer(StockTransferRequestDto request, User currentUser) {
        Warehouse srcWh = null;
        Store srcSt = null;
        if ("WAREHOUSE".equalsIgnoreCase(request.getSourceType())) {
            srcWh = warehouseRepository.findById(request.getSourceWarehouseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Source warehouse not found"));
        } else {
            srcSt = storeRepository.findById(request.getSourceStoreId())
                    .orElseThrow(() -> new ResourceNotFoundException("Source store not found"));
        }

        Warehouse dstWh = null;
        Store dstSt = null;
        if ("WAREHOUSE".equalsIgnoreCase(request.getDestType())) {
            dstWh = warehouseRepository.findById(request.getDestWarehouseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Destination warehouse not found"));
        } else {
            dstSt = storeRepository.findById(request.getDestStoreId())
                    .orElseThrow(() -> new ResourceNotFoundException("Destination store not found"));
        }

        String transferNumber = "TRF-" + (System.currentTimeMillis() % 10000000);

        StockTransfer transfer = StockTransfer.builder()
                .transferNumber(transferNumber)
                .sourceType(request.getSourceType().toUpperCase())
                .sourceWarehouse(srcWh)
                .sourceStore(srcSt)
                .destType(request.getDestType().toUpperCase())
                .destWarehouse(dstWh)
                .destStore(dstSt)
                .status("REQUESTED")
                .trackingNotes(request.getTrackingNotes())
                .createdBy(currentUser)
                .items(new ArrayList<>())
                .build();

        for (StockTransferRequestDto.TransferItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "id", itemReq.getProductId()));

            // Validate source has enough available stock
            int available = getAvailableStockAtLocation(product.getId(), request.getSourceType(),
                    srcWh != null ? srcWh.getId() : null, srcSt != null ? srcSt.getId() : null);

            if (available < itemReq.getQuantity()) {
                throw new InsufficientStockException(product.getId(), itemReq.getQuantity(), available);
            }

            StockTransferItem item = StockTransferItem.builder()
                    .transfer(transfer)
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .receivedQuantity(0)
                    .build();

            transfer.getItems().add(item);
        }

        transfer = stockTransferRepository.save(transfer);
        return StockTransferResponseDto.from(transfer);
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public StockTransferResponseDto updateStatus(Long id, String targetStatus, User currentUser) {
        StockTransfer transfer = stockTransferRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("StockTransfer", "id", id));

        String currentStatus = transfer.getStatus();

        if ("APPROVED".equalsIgnoreCase(targetStatus)) {
            transfer.setStatus("APPROVED");
            transfer.setApprovedBy(currentUser);
        } else if ("IN_TRANSIT".equalsIgnoreCase(targetStatus)) {
            // Deduct stock from source location
            for (StockTransferItem item : transfer.getItems()) {
                deductStockFromLocation(item.getProduct(), transfer.getSourceType(),
                        transfer.getSourceWarehouse(), transfer.getSourceStore(), item.getQuantity(), transfer.getTransferNumber(), currentUser);
            }
            transfer.setStatus("IN_TRANSIT");
        } else if ("COMPLETED".equalsIgnoreCase(targetStatus)) {
            if ("REQUESTED".equalsIgnoreCase(currentStatus) || "APPROVED".equalsIgnoreCase(currentStatus)) {
                // If transitioning straight to completed, deduct from source first
                for (StockTransferItem item : transfer.getItems()) {
                    deductStockFromLocation(item.getProduct(), transfer.getSourceType(),
                            transfer.getSourceWarehouse(), transfer.getSourceStore(), item.getQuantity(), transfer.getTransferNumber(), currentUser);
                }
            }
            // Add stock to destination location
            for (StockTransferItem item : transfer.getItems()) {
                item.setReceivedQuantity(item.getQuantity());
                addStockToLocation(item.getProduct(), transfer.getDestType(),
                        transfer.getDestWarehouse(), transfer.getDestStore(), item.getQuantity(), transfer.getTransferNumber(), currentUser);
            }
            transfer.setStatus("COMPLETED");
        } else if ("CANCELLED".equalsIgnoreCase(targetStatus)) {
            if ("IN_TRANSIT".equalsIgnoreCase(currentStatus)) {
                // Reverse deduction back to source
                for (StockTransferItem item : transfer.getItems()) {
                    addStockToLocation(item.getProduct(), transfer.getSourceType(),
                            transfer.getSourceWarehouse(), transfer.getSourceStore(), item.getQuantity(), "REVERT-" + transfer.getTransferNumber(), currentUser);
                }
            }
            transfer.setStatus("CANCELLED");
        } else {
            throw new BadRequestException("Unsupported transfer status transition: " + targetStatus);
        }

        transfer = stockTransferRepository.save(transfer);

        auditLogRepository.save(AuditLog.builder()
                .user(currentUser)
                .username(currentUser != null ? currentUser.getUsername() : "system")
                .action("TRANSFER_STATUS")
                .entityName("STOCK_TRANSFER")
                .entityId(String.valueOf(transfer.getId()))
                .details("Transfer " + transfer.getTransferNumber() + " status updated to " + transfer.getStatus())
                .createdAt(Instant.now())
                .build());

        return StockTransferResponseDto.from(transfer);
    }

    private int getAvailableStockAtLocation(Long productId, String locType, Long whId, Long stId) {
        if ("WAREHOUSE".equalsIgnoreCase(locType)) {
            return inventoryRepository.findByProductIdAndWarehouseId(productId, whId)
                    .map(Inventory::getAvailableQuantity)
                    .orElse(0);
        } else {
            return inventoryRepository.findByProductIdAndStoreId(productId, stId)
                    .map(Inventory::getAvailableQuantity)
                    .orElse(0);
        }
    }

    private void deductStockFromLocation(Product product, String locType, Warehouse wh, Store st, int qty, String ref, User user) {
        Inventory inv;
        if ("WAREHOUSE".equalsIgnoreCase(locType)) {
            inv = inventoryRepository.findByProductIdAndWarehouseIdForUpdate(product.getId(), wh.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Source inventory not found"));
        } else {
            inv = inventoryRepository.findByProductIdAndStoreIdForUpdate(product.getId(), st.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Source inventory not found"));
        }

        if (inv.getAvailableQuantity() < qty) {
            throw new InsufficientStockException(product.getId(), qty, inv.getAvailableQuantity());
        }

        inv.setQuantity(inv.getQuantity() - qty);
        inventoryRepository.save(inv);

        stockTransactionRepository.save(StockTransaction.builder()
                .product(product)
                .locationType(locType)
                .warehouse(wh)
                .store(st)
                .transactionType("TRANSFER_OUT")
                .quantityChange(-qty)
                .quantityAfter(inv.getQuantity())
                .referenceId(ref)
                .notes("Stock transfer out")
                .createdBy(user)
                .build());
    }

    private void addStockToLocation(Product product, String locType, Warehouse wh, Store st, int qty, String ref, User user) {
        Inventory inv;
        if ("WAREHOUSE".equalsIgnoreCase(locType)) {
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
            inv = inventoryRepository.findByProductIdAndStoreIdForUpdate(product.getId(), st.getId())
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
                .transactionType("TRANSFER_IN")
                .quantityChange(qty)
                .quantityAfter(inv.getQuantity())
                .referenceId(ref)
                .notes("Stock transfer in")
                .createdBy(user)
                .build());
    }
}

