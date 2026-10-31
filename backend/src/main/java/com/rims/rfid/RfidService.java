package com.rims.rfid;

import com.rims.common.response.PagedResponse;
import com.rims.product.Product;
import com.rims.product.ProductRepository;
import com.rims.store.Store;
import com.rims.store.StoreRepository;
import com.rims.warehouse.Warehouse;
import com.rims.warehouse.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RfidService {

    private final RfidScanLogRepository rfidScanLogRepository;
    private final RfidReaderAdapter rfidReaderAdapter;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final StoreRepository storeRepository;

    @Transactional(readOnly = true)
    public PagedResponse<RfidScanLogDto> getScanLogs(Pageable pageable) {
        Page<RfidScanLog> page = rfidScanLogRepository.findAll(pageable);
        return PagedResponse.from(page.map(RfidScanLogDto::from));
    }

    @Transactional(readOnly = true)
    public List<RfidScanLogDto> getRecentScans() {
        return rfidScanLogRepository.findTop20ByOrderByScanTimestampDesc().stream()
                .map(RfidScanLogDto::from)
                .toList();
    }

    @Transactional
    public List<RfidScanLogDto> triggerSimulatedPortalScan(String gateId, String locationType, Long locationId, int count) {
        List<RfidReaderAdapter.RfidScanResult> scanResults = rfidReaderAdapter.simulateGatePortalReading(
                gateId, locationType, locationId, count
        );

        Warehouse wh = "WAREHOUSE".equalsIgnoreCase(locationType) && locationId != null
                ? warehouseRepository.findById(locationId).orElse(null) : null;
        Store st = "STORE".equalsIgnoreCase(locationType) && locationId != null
                ? storeRepository.findById(locationId).orElse(null) : null;

        List<Product> sampleProducts = productRepository.findAll();
        List<RfidScanLog> logsToSave = new ArrayList<>();

        for (int i = 0; i < scanResults.size(); i++) {
            RfidReaderAdapter.RfidScanResult res = scanResults.get(i);
            Product matchedProduct = !sampleProducts.isEmpty() ? sampleProducts.get(i % sampleProducts.size()) : null;

            RfidScanLog log = RfidScanLog.builder()
                    .epcTag(res.epcTag())
                    .readerId(res.readerId())
                    .locationType(locationType.toUpperCase())
                    .warehouse(wh)
                    .store(st)
                    .product(matchedProduct)
                    .actionType(res.actionType())
                    .rssiSignal(BigDecimal.valueOf(res.rssiSignal()))
                    .build();

            logsToSave.add(log);
        }

        logsToSave = rfidScanLogRepository.saveAll(logsToSave);
        return logsToSave.stream().map(RfidScanLogDto::from).toList();
    }
}

