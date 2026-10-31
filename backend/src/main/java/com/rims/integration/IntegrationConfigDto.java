package com.rims.integration;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IntegrationConfigDto {
    private Long id;
    private String systemName;
    private String systemType;
    private String apiEndpoint;
    private String authType;
    private String apiKey;
    private Boolean isEnabled;
    private Integer syncFrequencyMinutes;
    private Instant lastSyncAt;
    private String status;
    private Instant createdAt;

    public static IntegrationConfigDto from(IntegrationConfig c) {
        return IntegrationConfigDto.builder()
                .id(c.getId())
                .systemName(c.getSystemName())
                .systemType(c.getSystemType())
                .apiEndpoint(c.getApiEndpoint())
                .authType(c.getAuthType())
                .apiKey(c.getApiKey() != null ? (c.getApiKey().length() > 8 ? c.getApiKey().substring(0, 4) + "..." : "****") : null)
                .isEnabled(c.getIsEnabled())
                .syncFrequencyMinutes(c.getSyncFrequencyMinutes())
                .lastSyncAt(c.getLastSyncAt())
                .status(c.getStatus())
                .createdAt(c.getCreatedAt())
                .build();
    }
}

