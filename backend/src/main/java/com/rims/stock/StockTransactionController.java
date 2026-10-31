package com.rims.stock;

import com.rims.common.response.ApiResponse;
import com.rims.common.response.PagedResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequestMapping("/api/v1/inventory/transactions")
@RequiredArgsConstructor
@Tag(name = "Inventory Ledger", description = "Endpoints for immutable stock movement audit trail and transaction history")
public class StockTransactionController {

    private final StockTransactionService stockTransactionService;

    @GetMapping
    @Operation(summary = "Get immutable stock transaction ledger with filtering and pagination")
    public ResponseEntity<ApiResponse<PagedResponse<StockTransactionDto>>> getTransactions(
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) String transactionType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant endDate,
            @PageableDefault(size = 15) Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                stockTransactionService.getTransactions(productId, transactionType, startDate, endDate, pageable)
        ));
    }
}

