package com.rims.integration;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "integration_configs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IntegrationConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "system_name", nullable = false, unique = true, length = 50)
    private String systemName; // SAP_ERP, TALLY_ACCOUNTING, BLUEDART_SHIPPING

    @Column(name = "system_type", nullable = false, length = 50)
    private String systemType; // ERP, ACCOUNTING, LOGISTICS

    @Column(name = "api_endpoint", nullable = false)
    private String apiEndpoint;

    @Column(name = "auth_type", nullable = false, length = 30)
    @Builder.Default
    private String authType = "BEARER_TOKEN";

    @Column(name = "api_key")
    private String apiKey;

    @Column(name = "is_enabled", nullable = false)
    @Builder.Default
    private Boolean isEnabled = true;

    @Column(name = "sync_frequency_minutes", nullable = false)
    @Builder.Default
    private Integer syncFrequencyMinutes = 60;

    @Column(name = "last_sync_at")
    private Instant lastSyncAt;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "HEALTHY"; // HEALTHY, WARNING, ERROR, DISABLED

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}

