package com.rims.rfid;

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
@RequestMapping("/api/v1/rfid")
@RequiredArgsConstructor
@Tag(name = "RFID Integration", description = "Endpoints for UHF RFID gate portals, simulated readers, and scan history logs")
public class RfidController {

    private final RfidService rfidService;

    @GetMapping("/logs")
    @Operation(summary = "Get paginated RFID scan history logs")
    public ResponseEntity<ApiResponse<PagedResponse<RfidScanLogDto>>> getScanLogs(@PageableDefault(size = 15) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(rfidService.getScanLogs(pageable)));
    }

    @GetMapping("/recent")
    @Operation(summary = "Get 20 most recent RFID tag scan events")
    public ResponseEntity<ApiResponse<List<RfidScanLogDto>>> getRecentScans() {
        return ResponseEntity.ok(ApiResponse.success(rfidService.getRecentScans()));
    }

    @PostMapping("/simulate-gate-scan")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'WAREHOUSE_MANAGER', 'INVENTORY_STAFF')")
    @Operation(summary = "Trigger simulated UHF RFID gate portal batch scan event")
    public ResponseEntity<ApiResponse<List<RfidScanLogDto>>> simulateGateScan(@RequestBody Map<String, Object> body) {
        String gateId = (String) body.getOrDefault("gateId", "RDR-MUM-DOCK-PORTAL-1");
        String locationType = (String) body.getOrDefault("locationType", "WAREHOUSE");
        Long locationId = Long.valueOf(body.getOrDefault("locationId", 1).toString());
        int count = Integer.parseInt(body.getOrDefault("count", 5).toString());

        return ResponseEntity.ok(ApiResponse.success("Simulated RFID scan completed",
                rfidService.triggerSimulatedPortalScan(gateId, locationType, locationId, count)));
    }
}

