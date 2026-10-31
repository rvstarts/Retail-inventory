package com.rims.rfid;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Slf4j
@Component
public class SimulatedRfidReaderAdapter implements RfidReaderAdapter {

    private final Random random = new Random();

    @Override
    public String getReaderModel() {
        return "Zebra FX9600 Fixed 8-Port Passive UHF RFID Reader (Simulated)";
    }

    @Override
    public boolean isConnected() {
        return true;
    }

    @Override
    public RfidScanResult scanTag(String epcTag, String locationType, Long locationId) {
        double rssi = -35.0 - (random.nextDouble() * 20.0); // e.g. -42.5 dBm
        return new RfidScanResult(
                epcTag,
                "SIM-FX9600-DOCK-1",
                locationType,
                locationId,
                Math.round(rssi * 100.0) / 100.0,
                "INVENTORY_VERIFICATION",
                System.currentTimeMillis()
        );
    }

    @Override
    public List<RfidScanResult> simulateGatePortalReading(String gateReaderId, String locationType, Long locationId, int tagCount) {
        List<RfidScanResult> results = new ArrayList<>();
        int count = Math.max(1, Math.min(tagCount, 25));

        for (int i = 1; i <= count; i++) {
            String epc = String.format("EPC-96-3001-A%02d-%08d", (i % 8) + 1, i);
            double rssi = -35.0 - (random.nextDouble() * 15.0);
            results.add(new RfidScanResult(
                    epc,
                    gateReaderId != null ? gateReaderId : "SIM-DOCK-PORTAL-A",
                    locationType,
                    locationId,
                    Math.round(rssi * 100.0) / 100.0,
                    "GATE_CHECK_IN",
                    System.currentTimeMillis()
            ));
        }

        return results;
    }
}

