package com.rims.transfer;

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
@RequestMapping("/api/v1/transfers")
@RequiredArgsConstructor
@Tag(name = "Stock Transfers", description = "Endpoints for inter-warehouse and warehouse-to-store stock transfers")
public class StockTransferController {

    private final StockTransferService stockTransferService;
    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Get list of all stock transfers")
    public ResponseEntity<ApiResponse<PagedResponse<StockTransferResponseDto>>> getAllTransfers(
            @RequestParam(required = false) String status,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.success(stockTransferService.getAllTransfers(status, pageable)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get transfer details by ID")
    public ResponseEntity<ApiResponse<StockTransferResponseDto>> getTransferById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(stockTransferService.getTransferById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'WAREHOUSE_MANAGER', 'STORE_MANAGER')")
    @Operation(summary = "Create a new stock transfer request")
    public ResponseEntity<ApiResponse<StockTransferResponseDto>> createTransfer(
            @Valid @RequestBody StockTransferRequestDto request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userDetails != null ? userRepository.findByUsername(userDetails.getUsername()).orElse(null) : null;
        return ResponseEntity.ok(ApiResponse.success("Transfer initiated", stockTransferService.createTransfer(request, user)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'WAREHOUSE_MANAGER', 'STORE_MANAGER')")
    @Operation(summary = "Update transfer status (APPROVED, IN_TRANSIT, COMPLETED, CANCELLED)")
    public ResponseEntity<ApiResponse<StockTransferResponseDto>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String targetStatus = body.get("status");
        User user = userDetails != null ? userRepository.findByUsername(userDetails.getUsername()).orElse(null) : null;
        return ResponseEntity.ok(ApiResponse.success("Transfer status updated", stockTransferService.updateStatus(id, targetStatus, user)));
    }
}

