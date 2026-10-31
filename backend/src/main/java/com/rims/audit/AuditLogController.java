package com.rims.audit;

import com.rims.common.response.ApiResponse;
import com.rims.common.response.PagedResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/audit-logs")
@RequiredArgsConstructor
@Tag(name = "Audit Trails", description = "Endpoints for immutable system activity audit trails, security events, and user operations")
public class AuditLogController {

    private final AuditLogRepository auditLogRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Get paginated audit trail logs")
    public ResponseEntity<ApiResponse<PagedResponse<AuditLogDto>>> getAuditLogs(
            @RequestParam(required = false) String entityName,
            @PageableDefault(size = 15) Pageable pageable
    ) {
        if (entityName != null && !entityName.isBlank()) {
            return ResponseEntity.ok(ApiResponse.success(PagedResponse.from(
                    auditLogRepository.findByEntityName(entityName, pageable).map(AuditLogDto::from)
            )));
        }
        return ResponseEntity.ok(ApiResponse.success(PagedResponse.from(
                auditLogRepository.findAll(pageable).map(AuditLogDto::from)
        )));
    }

    @GetMapping("/recent")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Get top 20 recent audit log entries")
    public ResponseEntity<ApiResponse<List<AuditLogDto>>> getRecentAuditLogs() {
        return ResponseEntity.ok(ApiResponse.success(
                auditLogRepository.findTop20ByOrderByCreatedAtDesc().stream().map(AuditLogDto::from).toList()
        ));
    }
}

