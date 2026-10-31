package com.rims.barcode;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BarcodeRecordRepository extends JpaRepository<BarcodeRecord, Long> {
    Optional<BarcodeRecord> findByBarcode(String barcode);
    boolean existsByBarcode(String barcode);
}

