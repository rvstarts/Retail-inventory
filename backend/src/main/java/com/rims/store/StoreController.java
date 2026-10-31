package com.rims.store;

import com.rims.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/stores")
@RequiredArgsConstructor
@Tag(name = "Store Management", description = "Endpoints for retail chain stores and regional outlets")
public class StoreController {

    private final StoreService storeService;

    @GetMapping
    @Operation(summary = "Get list of all retail stores")
    public ResponseEntity<ApiResponse<List<StoreDto>>> getAllStores() {
        return ResponseEntity.ok(ApiResponse.success(storeService.getAllStores()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get retail store by ID")
    public ResponseEntity<ApiResponse<StoreDto>> getStoreById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(storeService.getStoreById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Register a new retail store")
    public ResponseEntity<ApiResponse<StoreDto>> createStore(@Valid @RequestBody StoreDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Store created successfully", storeService.createStore(dto)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'STORE_MANAGER')")
    @Operation(summary = "Update store details")
    public ResponseEntity<ApiResponse<StoreDto>> updateStore(@PathVariable Long id, @Valid @RequestBody StoreDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Store updated successfully", storeService.updateStore(id, dto)));
    }
}

