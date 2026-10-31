package com.rims.integration;

import com.rims.common.response.ApiResponse;
import com.rims.common.response.PagedResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/integrations")
@RequiredArgsConstructor
@Tag(name = "System Integrations", description = "Endpoints for external ERP, Accounting (Tally), and Logistics (BlueDart) adapters and sync monitoring")
public class IntegrationController {

    private final IntegrationService integrationService;

    @GetMapping("/configs")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Get list of all external integration configurations")
    public ResponseEntity<ApiResponse<List<IntegrationConfigDto>>> getConfigs() {
        return ResponseEntity.ok(ApiResponse.success(integrationService.getAllConfigs()));
    }

    @GetMapping("/configs/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Get integration configuration details by ID")
    public ResponseEntity<ApiResponse<IntegrationConfigDto>> getConfigById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(integrationService.getConfigById(id)));
    }

    @PutMapping("/configs/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Update integration API endpoint, auth credentials, or sync schedule")
    public ResponseEntity<ApiResponse<IntegrationConfigDto>> updateConfig(
            @PathVariable Long id,
            @RequestBody IntegrationConfigDto dto
    ) {
        return ResponseEntity.ok(ApiResponse.success("Configuration updated", integrationService.updateConfig(id, dto)));
    }

    @GetMapping("/logs")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Get integration execution logs and data synchronization telemetry")
    public ResponseEntity<ApiResponse<PagedResponse<IntegrationLogDto>>> getLogs(
            @RequestParam(required = false) Long configId,
            @PageableDefault(size = 15) Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.success(integrationService.getLogs(configId, pageable)));
    }

    @PostMapping("/configs/{id}/sync")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Trigger immediate data synchronization with external system")
    public ResponseEntity<ApiResponse<Map<String, Object>>> triggerSync(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Synchronization triggered", integrationService.triggerSync(id)));
    }
}

