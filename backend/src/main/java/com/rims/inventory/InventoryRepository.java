package com.rims.inventory;

import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long>, JpaSpecificationExecutor<Inventory> {

    Optional<Inventory> findByProductIdAndWarehouseId(Long productId, Long warehouseId);

    Optional<Inventory> findByProductIdAndStoreId(Long productId, Long storeId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT i FROM Inventory i WHERE i.product.id = :productId AND i.warehouse.id = :warehouseId")
    Optional<Inventory> findByProductIdAndWarehouseIdForUpdate(
            @Param("productId") Long productId,
            @Param("warehouseId") Long warehouseId
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT i FROM Inventory i WHERE i.product.id = :productId AND i.store.id = :storeId")
    Optional<Inventory> findByProductIdAndStoreIdForUpdate(
            @Param("productId") Long productId,
            @Param("storeId") Long storeId
    );

    List<Inventory> findByProductId(Long productId);

    List<Inventory> findByWarehouseId(Long warehouseId);

    List<Inventory> findByStoreId(Long storeId);

    @Query("SELECT i FROM Inventory i WHERE i.quantity <= i.reorderPoint")
    List<Inventory> findLowStockInventories();

    @Query("SELECT i FROM Inventory i WHERE i.quantity <= i.reorderPoint")
    Page<Inventory> findLowStockInventories(Pageable pageable);

    @Query("SELECT i FROM Inventory i WHERE i.quantity = 0")
    List<Inventory> findOutOfStockInventories();

    @Query("SELECT COALESCE(SUM(i.quantity), 0) FROM Inventory i")
    Long getTotalUnitsInStock();

    @Query("SELECT COALESCE(SUM(i.quantity * i.product.purchasePrice), 0.0) FROM Inventory i")
    BigDecimal getTotalInventoryValuation();

    @Query("SELECT i.warehouse.name, COALESCE(SUM(i.quantity * i.product.purchasePrice), 0.0) " +
            "FROM Inventory i WHERE i.warehouse IS NOT NULL GROUP BY i.warehouse.name")
    List<Object[]> getValuationByWarehouse();

    @Query("SELECT i.product.category.name, COALESCE(SUM(i.quantity), 0) " +
            "FROM Inventory i GROUP BY i.product.category.name")
    List<Object[]> getStockDistributionByCategory();
}

