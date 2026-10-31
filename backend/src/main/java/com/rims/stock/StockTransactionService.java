package com.rims.stock;

import com.rims.common.response.PagedResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class StockTransactionService {

    private final StockTransactionRepository stockTransactionRepository;

    @Transactional(readOnly = true)
    public PagedResponse<StockTransactionDto> getTransactions(
            Long productId,
            String transactionType,
            Instant startDate,
            Instant endDate,
            Pageable pageable
    ) {
        Page<StockTransaction> page = stockTransactionRepository.filterTransactions(
                productId,
                transactionType != null && !transactionType.isBlank() ? transactionType : null,
                startDate,
                endDate,
                pageable
        );
        return PagedResponse.from(page.map(StockTransactionDto::from));
    }
}

