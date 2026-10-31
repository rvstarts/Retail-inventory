package com.rims.integration;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Map;

@Slf4j
@Component
public class AccountingIntegrationAdapter {

    public Map<String, Object> exportVouchersToTally(String endpoint, String apiKey, int voucherCount) {
        log.info("Executing mock Accounting voucher posting with Tally Prime at endpoint: {}", endpoint);
        return Map.of(
                "status", "POSTED",
                "tallyVoucherNumber", "TV-" + (System.currentTimeMillis() % 100000),
                "vouchersPosted", voucherCount,
                "accountingCode", 200,
                "message", "Journal vouchers posted to balance sheet and profit & loss account"
        );
    }
}

