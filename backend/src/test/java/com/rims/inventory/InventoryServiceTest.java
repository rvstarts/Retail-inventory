package com.rims.inventory;

import com.rims.audit.AuditLogRepository;
import com.rims.common.exception.InsufficientStockException;
import com.rims.notification.NotificationRepository;
import com.rims.product.Product;
import com.rims.product.ProductRepository;
import com.rims.stock.StockTransaction;
import com.rims.stock.StockTransactionRepository;
import com.rims.user.User;
import com.rims.warehouse.Warehouse;
import com.rims.warehouse.WarehouseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InventoryServiceTest {

    @Mock
    private InventoryRepository inventoryRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private WarehouseRepository warehouseRepository;

    @Mock
    private StockTransactionRepository stockTransactionRepository;

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private AuditLogRepository auditLogRepository;

    @InjectMocks
    private InventoryService inventoryService;

    private Product testProduct;
    private Warehouse testWarehouse;
    private Inventory testInventory;
    private User testUser;

    @BeforeEach
    void setUp() {
        testProduct = Product.builder()
                .id(1L)
                .name("Raymond Linen Shirt")
                .sku("MEN-SHIRT-001")
                .reorderPoint(20)
                .minStockLevel(10)
                .purchasePrice(new BigDecimal("1200.00"))
                .sellingPrice(new BigDecimal("2499.00"))
                .build();

        testWarehouse = Warehouse.builder()
                .id(1L)
                .code("WH_MUM_01")
                .name("Mumbai Central Hub")
                .build();

        testInventory = Inventory.builder()
                .id(10L)
                .product(testProduct)
                .locationType("WAREHOUSE")
                .warehouse(testWarehouse)
                .quantity(50)
                .reservedQuantity(10)
                .reorderPoint(20)
                .safetyStock(10)
                .build();

        testUser = User.builder()
                .id(1L)
                .username("admin")
                .build();
    }

    @Test
    @DisplayName("Should successfully increase inventory during stock-in")
    void testStockInSuccess() {
        StockInRequest request = StockInRequest.builder()
                .productId(1L)
                .locationType("WAREHOUSE")
                .warehouseId(1L)
                .quantity(30)
                .referenceId("PO-1001")
                .build();

        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(warehouseRepository.findById(1L)).thenReturn(Optional.of(testWarehouse));
        when(inventoryRepository.findByProductIdAndWarehouseIdForUpdate(1L, 1L)).thenReturn(Optional.of(testInventory));
        when(inventoryRepository.save(any(Inventory.class))).thenAnswer(i -> i.getArgument(0));

        InventoryDto dto = inventoryService.stockIn(request, testUser);

        assertNotNull(dto);
        assertEquals(80, dto.getQuantity()); // 50 + 30
        verify(stockTransactionRepository, times(1)).save(any(StockTransaction.class));
    }

    @Test
    @DisplayName("Should successfully deduct stock during valid stock-out")
    void testStockOutSuccess() {
        StockOutRequest request = StockOutRequest.builder()
                .productId(1L)
                .locationType("WAREHOUSE")
                .warehouseId(1L)
                .quantity(15)
                .reason("DISPATCH")
                .build();

        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(inventoryRepository.findByProductIdAndWarehouseIdForUpdate(1L, 1L)).thenReturn(Optional.of(testInventory));
        when(inventoryRepository.save(any(Inventory.class))).thenAnswer(i -> i.getArgument(0));

        InventoryDto dto = inventoryService.stockOut(request, testUser);

        assertNotNull(dto);
        assertEquals(35, dto.getQuantity()); // 50 - 15
        verify(stockTransactionRepository, times(1)).save(any(StockTransaction.class));
    }

    @Test
    @DisplayName("Should throw InsufficientStockException when stock-out exceeds available stock")
    void testStockOutInsufficientStock() {
        // Available stock is quantity(50) - reserved(10) = 40. Requesting 45 should throw exception.
        StockOutRequest request = StockOutRequest.builder()
                .productId(1L)
                .locationType("WAREHOUSE")
                .warehouseId(1L)
                .quantity(45)
                .reason("DISPATCH")
                .build();

        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(inventoryRepository.findByProductIdAndWarehouseIdForUpdate(1L, 1L)).thenReturn(Optional.of(testInventory));

        assertThrows(InsufficientStockException.class, () -> inventoryService.stockOut(request, testUser));
        verify(stockTransactionRepository, never()).save(any(StockTransaction.class));
    }
}

