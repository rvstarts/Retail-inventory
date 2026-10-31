package com.rims.transfer;

import com.rims.store.Store;
import com.rims.user.User;
import com.rims.warehouse.Warehouse;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "stock_transfers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockTransfer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transfer_number", nullable = false, unique = true, length = 50)
    private String transferNumber;

    @Column(name = "source_type", nullable = false, length = 20)
    private String sourceType; // WAREHOUSE, STORE

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "source_warehouse_id")
    private Warehouse sourceWarehouse;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "source_store_id")
    private Store sourceStore;

    @Column(name = "dest_type", nullable = false, length = 20)
    private String destType; // WAREHOUSE, STORE

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "dest_warehouse_id")
    private Warehouse destWarehouse;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "dest_store_id")
    private Store destStore;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "REQUESTED"; // REQUESTED, APPROVED, IN_TRANSIT, COMPLETED, CANCELLED

    @Column(name = "tracking_notes", columnDefinition = "TEXT")
    private String trackingNotes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "transfer", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<StockTransferItem> items = new ArrayList<>();
}

