package com.rims.integration;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IntegrationLogRepository extends JpaRepository<IntegrationLog, Long> {
    Page<IntegrationLog> findByConfigId(Long configId, Pageable pageable);
    List<IntegrationLog> findTop20ByOrderByCreatedAtDesc();
}

