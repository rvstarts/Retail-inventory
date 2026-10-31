package com.rims.rfid;

import java.util.List;

public interface RfidReaderAdapter {
    String getReaderModel();
    boolean isConnected();
    RfidScanResult scanTag(String epcTag, String locationType, Long locationId);
    List<RfidScanResult> simulateGatePortalReading(String gateReaderId, String locationType, Long locationId, int simulatedTagCount);

    record RfidScanResult(
            String epcTag,
            String readerId,
            String locationType,
            Long locationId,
            double rssiSignal,
            String actionType,
            long timestamp
    ) {}
}

