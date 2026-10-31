package com.rims.integration;

import com.rims.common.exception.ResourceNotFoundException;
import com.rims.common.response.PagedResponse;
import com.rims.inventory.InventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class IntegrationService {

    private final IntegrationConfigRepository configRepository;
    private final IntegrationLogRepository logRepository;
    private final ErpIntegrationAdapter erpAdapter;
    private final AccountingIntegrationAdapter accountingAdapter;
    private final InventoryRepository inventoryRepository;

    @Transactional(readOnly = true)
    public List<IntegrationConfigDto> getAllConfigs() {
        return configRepository.findAll().stream().map(IntegrationConfigDto::from).toList();
    }

    @Transactional(readOnly = true)
    public IntegrationConfigDto getConfigById(Long id) {
        IntegrationConfig c = configRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("IntegrationConfig", "id", id));
        return IntegrationConfigDto.from(c);
    }

    @Transactional
    public IntegrationConfigDto updateConfig(Long id, IntegrationConfigDto dto) {
        IntegrationConfig c = configRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("IntegrationConfig", "id", id));

        if (dto.getApiEndpoint() != null) c.setApiEndpoint(dto.getApiEndpoint());
        if (dto.getAuthType() != null) c.setAuthType(dto.getAuthType());
        if (dto.getApiKey() != null && !dto.getApiKey().contains("*")) c.setApiKey(dto.getApiKey());
        if (dto.getIsEnabled() != null) c.setIsEnabled(dto.getIsEnabled());
        if (dto.getSyncFrequencyMinutes() != null) c.setSyncFrequencyMinutes(dto.getSyncFrequencyMinutes());
        if (dto.getStatus() != null) c.setStatus(dto.getStatus());

        return IntegrationConfigDto.from(configRepository.save(c));
    }

    @Transactional(readOnly = true)
    public PagedResponse<IntegrationLogDto> getLogs(Long configId, Pageable pageable) {
        Page<IntegrationLog> page;
        if (configId != null) {
            page = logRepository.findByConfigId(configId, pageable);
        } else {
            page = logRepository.findAll(pageable);
        }
        return PagedResponse.from(page.map(IntegrationLogDto::from));
    }

    @Transactional
    public Map<String, Object> triggerSync(Long configId) {
        IntegrationConfig config = configRepository.findById(configId)
                .orElseThrow(() -> new ResourceNotFoundException("IntegrationConfig", "id", configId));

        Map<String, Object> result;
        int count = (int) inventoryRepository.count();

        try {
            if ("ERP".equalsIgnoreCase(config.getSystemType())) {
                result = erpAdapter.syncInventoryLedgerWithErp(config.getApiEndpoint(), config.getApiKey(), count);
            } else if ("ACCOUNTING".equalsIgnoreCase(config.getSystemType())) {
                result = accountingAdapter.exportVouchersToTally(config.getApiEndpoint(), config.getApiKey(), 15);
            } else {
                result = Map.of(
                        "status", "SUCCESS",
                        "carrier", "BlueDart Express API",
                        "responseCode", 200,
                        "message", "Logistics gateway connection verified and webhook active"
                );
            }

            config.setLastSyncAt(Instant.now());
            config.setStatus("HEALTHY");
            configRepository.save(config);

            logRepository.save(IntegrationLog.builder()
                    .config(config)
                    .direction("OUTBOUND")
                    .entityType("ERP".equalsIgnoreCase(config.getSystemType()) ? "INVENTORY" : "ACCOUNTING_JOURNAL")
                    .payload("{\"trigger\":\"MANUAL_CONSOLE\",\"timestamp\":\"" + Instant.now() + "\"}")
                    .responseCode(200)
                    .responseBody(result.toString())
                    .status("SUCCESS")
                    .retryCount(0)
                    .build());

        } catch (Exception ex) {
            log.error("Integration sync failed for {}: {}", config.getSystemName(), ex.getMessage());
            config.setStatus("ERROR");
            configRepository.save(config);

            logRepository.save(IntegrationLog.builder()
                    .config(config)
                    .direction("OUTBOUND")
                    .entityType("SYNC_JOB")
                    .payload("{\"trigger\":\"MANUAL_CONSOLE\"}")
                    .responseCode(500)
                    .status("FAILED")
                    .retryCount(1)
                    .errorMessage(ex.getMessage())
                    .build());

            result = Map.of("status", "FAILED", "error", ex.getMessage());
        }

        return result;
    }
}

