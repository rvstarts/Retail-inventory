package com.rims.stock;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface StockTransactionRepository extends JpaRepository<StockTransaction, Long>, JpaSpecificationExecutor<StockTransaction> {

    Page<StockTransaction> findByProductId(Long productId, Pageable pageable);

    @Query("SELECT t FROM StockTransaction t WHERE " +
            "(:productId IS NULL OR t.product.id = :productId) AND " +
            "(:transactionType IS NULL OR t.transactionType = :transactionType) AND " +
            "(:startDate IS NULL OR t.createdAt >= :startDate) AND " +
            "(:endDate IS NULL OR t.createdAt <= :endDate) " +
            "ORDER BY t.createdAt DESC")
    Page<StockTransaction> filterTransactions(
            @Param("productId") Long productId,
            @Param("transactionType") String transactionType,
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate,
            Pageable pageable
    );

    @Query("SELECT t.transactionType, COALESCE(SUM(ABS(t.quantityChange)), 0) " +
            "FROM StockTransaction t GROUP BY t.transactionType")
    List<Object[]> getMovementSummaryByType();
}

