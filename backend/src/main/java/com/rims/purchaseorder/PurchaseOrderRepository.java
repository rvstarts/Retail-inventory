package com.rims.purchaseorder;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    Optional<PurchaseOrder> findByPoNumber(String poNumber);
    boolean existsByPoNumber(String poNumber);
    Page<PurchaseOrder> findBySupplierId(Long supplierId, Pageable pageable);
    Page<PurchaseOrder> findByStatus(String status, Pageable pageable);

    @Query("SELECT po FROM PurchaseOrder po WHERE " +
            "(:status IS NULL OR po.status = :status) AND " +
            "(:supplierId IS NULL OR po.supplier.id = :supplierId) " +
            "ORDER BY po.createdAt DESC")
    Page<PurchaseOrder> filterPurchaseOrders(
            @Param("status") String status,
            @Param("supplierId") Long supplierId,
            Pageable pageable
    );

    @Query("SELECT po.supplier.name, COUNT(po), " +
            "COALESCE(SUM(CASE WHEN po.status = 'RECEIVED' THEN 1 ELSE 0 END), 0), " +
            "AVG(po.supplier.rating) " +
            "FROM PurchaseOrder po GROUP BY po.supplier.name")
    List<Object[]> getSupplierPerformanceStats();
}

