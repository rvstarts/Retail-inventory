package com.rims.rfid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RfidScanLogRepository extends JpaRepository<RfidScanLog, Long> {
    Page<RfidScanLog> findByReaderId(String readerId, Pageable pageable);
    List<RfidScanLog> findTop20ByOrderByScanTimestampDesc();
}

