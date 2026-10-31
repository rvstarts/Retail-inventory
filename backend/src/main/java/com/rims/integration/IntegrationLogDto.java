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
public class IntegrationLogDto {
    private Long id;
    private Long configId;
    private String systemName;
    private String direction;
    private String entityType;
    private String payload;
    private Integer responseCode;
    private String responseBody;
    private String status;
    private Integer retryCount;
    private String errorMessage;
    private Instant createdAt;

    public static IntegrationLogDto from(IntegrationLog log) {
        return IntegrationLogDto.builder()
                .id(log.getId())
                .configId(log.getConfig() != null ? log.getConfig().getId() : null)
                .systemName(log.getConfig() != null ? log.getConfig().getSystemName() : null)
                .direction(log.getDirection())
                .entityType(log.getEntityType())
                .payload(log.getPayload())
                .responseCode(log.getResponseCode())
                .responseBody(log.getResponseBody())
                .status(log.getStatus())
                .retryCount(log.getRetryCount())
                .errorMessage(log.getErrorMessage())
                .createdAt(log.getCreatedAt())
                .build();
    }
}

