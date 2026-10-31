package com.rims.rfid;

import com.rims.product.Product;
import com.rims.store.Store;
import com.rims.warehouse.Warehouse;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "rfid_scan_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RfidScanLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "epc_tag", nullable = false, length = 100)
    private String epcTag;

    @Column(name = "reader_id", nullable = false, length = 50)
    private String readerId;

    @Column(name = "location_type", nullable = false, length = 20)
    private String locationType; // WAREHOUSE, STORE

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "warehouse_id")
    private Warehouse warehouse;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "store_id")
    private Store store;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "action_type", nullable = false, length = 50)
    private String actionType; // INVENTORY_VERIFICATION, GATE_CHECK_IN, GATE_CHECK_OUT

    @Column(name = "rssi_signal", precision = 5, scale = 2)
    private BigDecimal rssiSignal;

    @CreationTimestamp
    @Column(name = "scan_timestamp", nullable = false, updatable = false)
    private Instant scanTimestamp;
}

