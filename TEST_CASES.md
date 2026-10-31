# Comprehensive Test Cases Specification
## Retail Inventory Management System (RIMS)
**Project Code:** `PRG_RIMS_001`  
**Client:** XYZ Retail Corporation  
**Coverage:** Epics 1 to 8 Functional & Invariant Test Cases  

---

## 1. Test Case Matrix

| Test Case ID | Epic / Module | Scenario Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-CAT-01** | Epic 1: Catalog | Create product with valid parameters | Operator logged in with `ADMIN` role | 1. Enter Name: "Philips Air Fryer"<br>2. SKU: "HOM-AF-006"<br>3. Cost: ₹4,200, Sell: ₹8,999<br>4. Submit | Product created, HTTP 201 Created, assigned unique ID | Product created with ID 6 | **PASS** |
| **TC-CAT-02** | Epic 1: Catalog | Enforce unique SKU rejection | Existing SKU "APP-SUIT-001" in catalog | 1. Attempt to create new product with SKU "APP-SUIT-001"<br>2. Submit | System throws `DuplicateResourceException`, HTTP 409 Conflict | Rejected with duplicate SKU message | **PASS** |
| **TC-CAT-03** | Epic 1: Catalog | Enforce Selling Price ≥ Cost Price | Operator in Add Product screen | 1. Enter Cost: ₹5,000<br>2. Enter Sell: ₹4,000<br>3. Submit | System throws `BadRequestException`, HTTP 400 Bad Request | Rejected: "Selling price cannot be lower than cost price" | **PASS** |
| **TC-INV-01** | Epic 2: Inventory | Inbound Stock-In updates balance & ledger | Product ID 1 has 60 units in BOM Hub | 1. Post Stock-In of 50 units with PO reference<br>2. Verify inventory balance<br>3. Verify transaction ledger | Physical quantity becomes 110. Transaction recorded in `stock_transactions` with delta +50. | Balance = 110, transaction TXN logged | **PASS** |
| **TC-INV-02** | Epic 2: Inventory | Prevent negative stock on Stock-Out | Available stock is 14 units | 1. Attempt to issue Stock-Out of 20 units<br>2. Submit | System throws `InsufficientStockException`, HTTP 400. Stock remains 14. | Stock deduction blocked. Zero-negative stock preserved. | **PASS** |
| **TC-INV-03** | Epic 2: Inventory | Atomic transfer between facilities | BOM Hub has 100 units; Indiranagar Store has 10 units | 1. Create transfer order of 25 units<br>2. Dispatch (`IN_TRANSIT`)<br>3. Complete transfer (`COMPLETED`) | BOM Hub balance drops to 75. Indiranagar balance increases to 35. Single `@Transactional` execution. | Balances updated atomically. Source = 75, Target = 35. | **PASS** |
| **TC-ORD-01** | Epic 3: Orders | Order creation reserves available stock | Product has 100 physical, 0 reserved, 100 available | 1. Create order for 10 units<br>2. Submit order | Physical remains 100. Reserved becomes 10. Available becomes 90. | Reserved = 10, Available = 90. Double-sell prevented. | **PASS** |
| **TC-ORD-02** | Epic 3: Orders | Order cancellation releases reserved stock | Order has reserved 10 units of product | 1. Cancel order prior to dispatch<br>2. Submit cancellation | Order status becomes `CANCELLED`. Reserved drops by 10. Available increases by 10. | Reserved = 0, Available = 100. Released immediately. | **PASS** |
| **TC-ORD-03** | Epic 3: Orders | Dispatch shipment deducts physical stock | Order is `PACKED` with 10 units reserved | 1. Advance order status to `SHIPPED`<br>2. Assign carrier AWB | Order status becomes `SHIPPED`. Physical stock decreases by 10. Reserved stock decreases by 10. | Physical = 90, Reserved = 0. Physical goods dispatched. | **PASS** |
| **TC-RET-01** | Epic 3: Returns | Restock undamaged return to inventory | Store stock is 20 units | 1. Record customer return of 2 units<br>2. Set condition to `RESTOCKABLE`<br>3. Confirm restock | Store physical stock increases to 22. Status marked `RESTOCKED_AND_REFUNDED`. | Stock = 22, refund approved. | **PASS** |
| **TC-PRO-01** | Epic 4: Procurement | Goods receipt (GRN) increases warehouse inventory | Warehouse stock is 50 units. PO ordered is 50 units. | 1. Receive 50 units with vendor challan<br>2. Submit GRN | Warehouse stock increases to 100. PO status becomes `RECEIVED`. | Warehouse stock = 100. PO closed. | **PASS** |
| **TC-PRO-02** | Epic 4: Procurement | Partial PO delivery support | PO ordered is 100 units | 1. Receive 40 units<br>2. Submit GRN | Warehouse stock increases by 40. PO status becomes `PARTIALLY_RECEIVED`. Remaining to receive: 60 units. | Stock updated. PO status = `PARTIALLY_RECEIVED`. | **PASS** |
| **TC-BAR-01** | Epic 5: Barcode | Code 128 barcode generation via ZXing | Valid SKU / Barcode text exists | 1. Call GET `/tracking/barcode/generate/8901234000018` | Returns valid PNG image stream with correct Code 128 encoding pattern. | 200 OK image/png stream rendered. | **PASS** |
| **TC-RFID-01**| Epic 5: RFID | Simulated UHF portal gate bulk pallet scan | Inbound Dock Gate 01 is `ONLINE` | 1. Trigger simulated pallet pass-through<br>2. Await reader telemetry | Adapter captures 20+ EPC tags with RSSI values in < 250ms. Logs written to `rfid_scan_logs`. | 24 tags read in 180ms. Telemetry recorded. | **PASS** |
| **TC-REP-01** | Epic 6: Analytics | Dynamic KPI dashboard calculation | 32 products, 3 warehouses, 5 stores seeded | 1. Call GET `/dashboard/summary` | Returns computed values matching SQL aggregate queries. No hardcoded constants. | Live KPIs match exact database rows. | **PASS** |
| **TC-SEC-01** | Epic 7: Security | JWT authentication with valid credentials | User `superadmin` seeded with BCrypt hash | 1. Post valid credentials to `/auth/login` | Returns signed JWT token with valid claims and expiration. | 200 OK, token issued. | **PASS** |
| **TC-SEC-02** | Epic 7: Security | Reject tampered or invalid JWT token | Token with corrupted signature | 1. Send request with header `Authorization: Bearer invalid.token.xyz` | System returns HTTP 401 Unauthorized. Access denied. | 401 Unauthorized returned. | **PASS** |
| **TC-INT-01** | Epic 8: Integration | Bidirectional sync with SAP S/4HANA adapter | Mock SAP connector registered | 1. Trigger manual sync for SAP ERP | Delta sync completed. Response logged in `integration_logs` with latency and record count. | Log created, status = `SUCCESS`. | **PASS** |

---
© 2026 XYZ Retail Corporation • Document Reference: `PRG_RIMS_001_TC_V2`

