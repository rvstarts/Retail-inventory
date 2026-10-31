package com.rims.returns;

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
@RequestMapping("/api/v1/returns")
@RequiredArgsConstructor
@Tag(name = "Returns & Restocking", description = "Endpoints for customer returns, inspection conditions, restocking, and refunds")
public class ReturnController {

    private final ReturnService returnService;
    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Get paginated list of returns with status filter")
    public ResponseEntity<ApiResponse<PagedResponse<ReturnDto>>> getAllReturns(
            @RequestParam(required = false) String status,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.success(returnService.getAllReturns(status, pageable)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get return details by ID")
    public ResponseEntity<ApiResponse<ReturnDto>> getReturnById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(returnService.getReturnById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'SALES_STAFF', 'STORE_MANAGER')")
    @Operation(summary = "Initiate return request against an order")
    public ResponseEntity<ApiResponse<ReturnDto>> createReturn(
            @Valid @RequestBody CreateReturnRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userDetails != null ? userRepository.findByUsername(userDetails.getUsername()).orElse(null) : null;
        return ResponseEntity.ok(ApiResponse.success("Return initiated", returnService.createReturn(request, user)));
    }

    @PatchMapping("/{id}/process")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'WAREHOUSE_MANAGER', 'STORE_MANAGER')")
    @Operation(summary = "Process return action (RESTOCK, REFUND, REJECT)")
    public ResponseEntity<ApiResponse<ReturnDto>> processReturn(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String action = body.get("action");
        User user = userDetails != null ? userRepository.findByUsername(userDetails.getUsername()).orElse(null) : null;
        return ResponseEntity.ok(ApiResponse.success("Return processed with action " + action, returnService.processReturn(id, action, user)));
    }
}

