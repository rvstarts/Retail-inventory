package com.rims.order;

import com.rims.common.response.ApiResponse;
import com.rims.common.response.PagedResponse;
import com.rims.user.User;
import com.rims.user.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Tag(name = "Order Management & Fulfillment", description = "Endpoints for order lifecycle: PENDING -> CONFIRMED -> PROCESSING -> PICKED -> PACKED -> SHIPPED -> DELIVERED")
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Get paginated customer orders with filtering")
    public ResponseEntity<ApiResponse<PagedResponse<OrderResponseDto>>> getAllOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long customerId,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getAllOrders(status, customerId, pageable)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order details and full lifecycle history by ID")
    public ResponseEntity<ApiResponse<OrderResponseDto>> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getOrderById(id)));
    }

    @GetMapping("/number/{orderNumber}")
    @Operation(summary = "Get order by unique order number")
    public ResponseEntity<ApiResponse<OrderResponseDto>> getOrderByOrderNumber(@PathVariable String orderNumber) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getOrderByOrderNumber(orderNumber)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'SALES_STAFF', 'STORE_MANAGER')")
    @Operation(summary = "Create customer sales order and reserve inventory")
    public ResponseEntity<ApiResponse<OrderResponseDto>> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userDetails != null ? userRepository.findByUsername(userDetails.getUsername()).orElse(null) : null;
        return ResponseEntity.ok(ApiResponse.success("Order created and stock allocated", orderService.createOrder(request, user)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'SALES_STAFF', 'WAREHOUSE_MANAGER', 'STORE_MANAGER')")
    @Operation(summary = "Update order fulfillment lifecycle status")
    public ResponseEntity<ApiResponse<OrderResponseDto>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String status = body.get("status");
        String comments = body.get("comments");
        User user = userDetails != null ? userRepository.findByUsername(userDetails.getUsername()).orElse(null) : null;
        return ResponseEntity.ok(ApiResponse.success("Order status transitioned to " + status, orderService.updateOrderStatus(id, status, comments, user)));
    }
}

