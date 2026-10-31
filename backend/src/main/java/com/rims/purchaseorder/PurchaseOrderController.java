package com.rims.purchaseorder;

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

@RestController
@RequestMapping("/api/v1/purchase-orders")
@RequiredArgsConstructor
@Tag(name = "Purchase Orders & Procurement", description = "Endpoints for purchase orders: DRAFT -> SUBMITTED -> APPROVED -> PARTIALLY_RECEIVED -> RECEIVED")
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;
    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Get paginated purchase orders with status and supplier filters")
    public ResponseEntity<ApiResponse<PagedResponse<PurchaseOrderDto>>> getPurchaseOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long supplierId,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.success(purchaseOrderService.getPurchaseOrders(status, supplierId, pageable)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get purchase order details and line items by ID")
    public ResponseEntity<ApiResponse<PurchaseOrderDto>> getPurchaseOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(purchaseOrderService.getPurchaseOrderById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PROCUREMENT_MANAGER')")
    @Operation(summary = "Create purchase order for vendor procurement")
    public ResponseEntity<ApiResponse<PurchaseOrderDto>> createPurchaseOrder(
            @Valid @RequestBody CreatePurchaseOrderRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userDetails != null ? userRepository.findByUsername(userDetails.getUsername()).orElse(null) : null;
        return ResponseEntity.ok(ApiResponse.success("Purchase order created", purchaseOrderService.createPurchaseOrder(request, user)));
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PROCUREMENT_MANAGER')")
    @Operation(summary = "Approve purchase order for vendor dispatch")
    public ResponseEntity<ApiResponse<PurchaseOrderDto>> approvePurchaseOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userDetails != null ? userRepository.findByUsername(userDetails.getUsername()).orElse(null) : null;
        return ResponseEntity.ok(ApiResponse.success("Purchase order approved", purchaseOrderService.approvePurchaseOrder(id, user)));
    }

    @PostMapping("/{id}/receive")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'WAREHOUSE_MANAGER', 'INVENTORY_STAFF')")
    @Operation(summary = "Receive shipment against purchase order and update warehouse stock")
    public ResponseEntity<ApiResponse<PurchaseOrderDto>> receiveGoods(
            @PathVariable Long id,
            @Valid @RequestBody ReceivePurchaseOrderRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userDetails != null ? userRepository.findByUsername(userDetails.getUsername()).orElse(null) : null;
        return ResponseEntity.ok(ApiResponse.success("Goods received into warehouse", purchaseOrderService.receiveGoods(id, request, user)));
    }
}

