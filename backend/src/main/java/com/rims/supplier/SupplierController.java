package com.rims.supplier;

import com.rims.common.response.ApiResponse;
import com.rims.common.response.PagedResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/suppliers")
@RequiredArgsConstructor
@Tag(name = "Supplier Management", description = "Endpoints for vendor directory, contracts, ratings, and contact profiles")
public class SupplierController {

    private final SupplierService supplierService;

    @GetMapping
    @Operation(summary = "Get paginated suppliers list")
    public ResponseEntity<ApiResponse<PagedResponse<SupplierDto>>> getAllSuppliers(
            @RequestParam(required = false) Boolean activeOnly,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.success(supplierService.getAllSuppliers(activeOnly, pageable)));
    }

    @GetMapping("/active")
    @Operation(summary = "Get list of all active suppliers for dropdowns")
    public ResponseEntity<ApiResponse<List<SupplierDto>>> getActiveSuppliers() {
        return ResponseEntity.ok(ApiResponse.success(supplierService.getActiveSuppliersList()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get supplier profile by ID")
    public ResponseEntity<ApiResponse<SupplierDto>> getSupplierById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(supplierService.getSupplierById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PROCUREMENT_MANAGER')")
    @Operation(summary = "Register a new supplier vendor")
    public ResponseEntity<ApiResponse<SupplierDto>> createSupplier(@Valid @RequestBody SupplierDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Supplier registered successfully", supplierService.createSupplier(dto)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PROCUREMENT_MANAGER')")
    @Operation(summary = "Update supplier vendor details")
    public ResponseEntity<ApiResponse<SupplierDto>> updateSupplier(@PathVariable Long id, @Valid @RequestBody SupplierDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Supplier updated successfully", supplierService.updateSupplier(id, dto)));
    }

    @PatchMapping("/{id}/toggle-status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PROCUREMENT_MANAGER')")
    @Operation(summary = "Activate or deactivate supplier")
    public ResponseEntity<ApiResponse<Void>> toggleStatus(@PathVariable Long id) {
        supplierService.toggleActiveStatus(id);
        return ResponseEntity.ok(ApiResponse.success("Supplier status changed", null));
    }
}

