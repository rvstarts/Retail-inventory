package com.rims.order;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Long> {

    Optional<CustomerOrder> findByOrderNumber(String orderNumber);
    boolean existsByOrderNumber(String orderNumber);
    Page<CustomerOrder> findByCustomerId(Long customerId, Pageable pageable);
    Page<CustomerOrder> findByStatus(String status, Pageable pageable);

    @Query("SELECT o FROM CustomerOrder o WHERE " +
            "(:status IS NULL OR o.status = :status) AND " +
            "(:customerId IS NULL OR o.customer.id = :customerId) " +
            "ORDER BY o.createdAt DESC")
    Page<CustomerOrder> filterOrders(
            @Param("status") String status,
            @Param("customerId") Long customerId,
            Pageable pageable
    );

    long countByStatus(String status);

    @Query("SELECT o.status, COUNT(o) FROM CustomerOrder o GROUP BY o.status")
    List<Object[]> getOrderStatusDistribution();

    @Query("SELECT item.product.id, item.product.name, item.product.sku, " +
            "COALESCE(SUM(item.quantity), 0), COALESCE(SUM(item.totalPrice), 0.0) " +
            "FROM OrderItem item JOIN item.order ord " +
            "WHERE ord.status NOT IN ('CANCELLED') " +
            "GROUP BY item.product.id, item.product.name, item.product.sku " +
            "ORDER BY SUM(item.quantity) DESC")
    List<Object[]> getTopSellingProducts();
}

