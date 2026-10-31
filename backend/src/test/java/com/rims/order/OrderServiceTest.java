package com.rims.order;

import com.rims.audit.AuditLogRepository;
import com.rims.inventory.Inventory;
import com.rims.inventory.InventoryRepository;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private CustomerOrderRepository orderRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private WarehouseRepository warehouseRepository;

    @Mock
    private InventoryRepository inventoryRepository;

    @Mock
    private OrderStatusHistoryRepository statusHistoryRepository;

    @Mock
    private StockTransactionRepository stockTransactionRepository;

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private AuditLogRepository auditLogRepository;

    @InjectMocks
    private OrderService orderService;

    private Customer testCustomer;
    private Warehouse testWarehouse;
    private Product testProduct;
    private Inventory testInventory;
    private User testUser;

    @BeforeEach
    void setUp() {
        testCustomer = Customer.builder().id(1L).name("Rajesh Kumar").customerCode("CUST_001").build();
        testWarehouse = Warehouse.builder().id(1L).code("WH_MUM_01").name("Mumbai Hub").build();
        testProduct = Product.builder().id(1L).name("Linen Shirt").sku("SHIRT-01").sellingPrice(new BigDecimal("2000.00")).purchasePrice(new BigDecimal("1000.00")).build();
        testInventory = Inventory.builder().id(10L).product(testProduct).locationType("WAREHOUSE").warehouse(testWarehouse).quantity(100).reservedQuantity(0).reorderPoint(20).build();
        testUser = User.builder().id(1L).username("admin").build();
    }

    @Test
    @DisplayName("Creating order allocates stock and marks reservation")
    void testCreateOrderAllocatesStock() {
        CreateOrderRequest request = CreateOrderRequest.builder()
                .customerId(1L)
                .warehouseId(1L)
                .items(List.of(new CreateOrderRequest.OrderItemRequest(1L, 5)))
                .build();

        when(customerRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
        when(warehouseRepository.findById(1L)).thenReturn(Optional.of(testWarehouse));
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(inventoryRepository.findByProductIdAndWarehouseIdForUpdate(1L, 1L)).thenReturn(Optional.of(testInventory));
        when(orderRepository.save(any(CustomerOrder.class))).thenAnswer(i -> {
            CustomerOrder o = i.getArgument(0);
            o.setId(101L);
            return o;
        });

        OrderResponseDto dto = orderService.createOrder(request, testUser);

        assertNotNull(dto);
        assertEquals(5, testInventory.getReservedQuantity()); // Reserved stock increased
        verify(inventoryRepository, times(1)).save(testInventory);
    }

    @Test
    @DisplayName("Cancelling unfulfilled order releases reserved stock")
    void testCancelOrderReleasesStock() {
        CustomerOrder order = CustomerOrder.builder()
                .id(101L)
                .orderNumber("ORD-101")
                .warehouse(testWarehouse)
                .status("CONFIRMED")
                .items(new ArrayList<>())
                .build();

        OrderItem item = OrderItem.builder().order(order).product(testProduct).quantity(5).isReserved(true).build();
        order.getItems().add(item);
        testInventory.setReservedQuantity(5);

        when(orderRepository.findById(101L)).thenReturn(Optional.of(order));
        when(inventoryRepository.findByProductIdAndWarehouseIdForUpdate(1L, 1L)).thenReturn(Optional.of(testInventory));
        when(orderRepository.save(any(CustomerOrder.class))).thenAnswer(i -> i.getArgument(0));

        orderService.updateOrderStatus(101L, "CANCELLED", "Customer cancelled", testUser);

        assertEquals(0, testInventory.getReservedQuantity()); // Reserved stock released
        assertEquals("CANCELLED", order.getStatus());
    }

    @Test
    @DisplayName("Shipping order deducts physical inventory and records transaction")
    void testShipOrderDeductsPhysicalStock() {
        CustomerOrder order = CustomerOrder.builder()
                .id(101L)
                .orderNumber("ORD-101")
                .warehouse(testWarehouse)
                .status("PACKED")
                .items(new ArrayList<>())
                .build();

        OrderItem item = OrderItem.builder().order(order).product(testProduct).quantity(5).isReserved(true).build();
        order.getItems().add(item);
        testInventory.setQuantity(100);
        testInventory.setReservedQuantity(5);

        when(orderRepository.findById(101L)).thenReturn(Optional.of(order));
        when(inventoryRepository.findByProductIdAndWarehouseIdForUpdate(1L, 1L)).thenReturn(Optional.of(testInventory));
        when(orderRepository.save(any(CustomerOrder.class))).thenAnswer(i -> i.getArgument(0));

        orderService.updateOrderStatus(101L, "SHIPPED", "Dispatched with BlueDart", testUser);

        assertEquals(95, testInventory.getQuantity()); // Physical stock deducted
        assertEquals(0, testInventory.getReservedQuantity()); // Reservation cleared
        assertEquals("SHIPPED", order.getStatus());
        verify(stockTransactionRepository, times(1)).save(any(StockTransaction.class));
    }
}

