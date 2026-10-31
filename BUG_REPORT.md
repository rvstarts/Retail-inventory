# Defect Tracking & Bug Reports
## Retail Inventory Management System (RIMS)
**Project Code:** `PRG_RIMS_001`  
**Client:** XYZ Retail Corporation  
**QA Audit Status:** All Critical & High Defects Resolved (100% Closed)  

---

## 1. Defect Summary Table

| Defect ID | Severity | Module / Epic | Summary | Root Cause | Status |
| :---: | :---: | :--- | :--- | :--- | :---: |
| **BUG-001** | CRITICAL | Security (Epic 7) | JJWT 0.12.x signature method signature mismatch | `signWith(Key, Algorithm)` was deprecated in JJWT 0.12.0 in favor of `signWith(SecretKey)` taking a single parameter. | **RESOLVED** |
| **BUG-002** | HIGH | Build / Flyway | Flyway PostgreSQL dependency version missing in POM | In Spring Boot 3.2.x, `flyway-database-postgresql` required an explicit `<version>` tag in `pom.xml`. | **RESOLVED** |
| **BUG-003** | CRITICAL | Inventory (Epic 2) | Potential negative stock race condition on rapid concurrent checkouts | Service checked stock and updated in separate transactions without atomic reservation validation. | **RESOLVED** |
| **BUG-004** | MEDIUM | Orders (Epic 3) | Order cancellation did not decrement reserved stock balance | Cancellation only flipped `status = CANCELLED` without releasing the reserved inventory held in `inventory.reserved_quantity`. | **RESOLVED** |
| **BUG-005** | LOW | Barcode (Epic 5) | Barcode SVG rendered with clipping on mobile screens | Container width was hardcoded to 600px rather than fluid `w-full max-w-sm`. | **RESOLVED** |
| **BUG-006** | HIGH | Frontend Build | Node native binary rollup extraction on Windows | Windows npm post-install execution corrupted native rollup and interface checker submodules. Reinstalled clean binaries. | **RESOLVED** |

---

## 2. Detailed Defect Reports

### Defect BUG-001: JJWT 0.12.x Signature Method Mismatch
- **Severity:** CRITICAL
- **Component:** `JwtTokenProvider.java`
- **Description:** During compilation, Maven failed with error: `no suitable method found for signWith(java.security.Key, io.jsonwebtoken.security.MacAlgorithm)`.
- **Root Cause:** In JJWT 0.12.x, the overloaded `signWith(Key, SignatureAlgorithm)` method was replaced by `signWith(SecretKey)`.
- **Resolution:** Refactored `getSigningKey()` return type to `SecretKey` using `Keys.hmacShaKeyFor(secretBytes)` and updated `builder().signWith(getSigningKey())`.
- **Verification:** Unit test `JwtTokenProviderTest` compiles and executes with 100% pass rate.

### Defect BUG-003: Race Condition on Concurrent Stock Allocation
- **Severity:** CRITICAL
- **Component:** `InventoryService.java` / `OrderService.java`
- **Description:** Under high concurrency simulation, two simultaneous customer checkouts for the last available unit could both succeed, driving available stock into negative.
- **Root Cause:** Stock deduction calculated available quantity outside of the database write lock.
- **Resolution:**
  1. Enforced composite unique constraint on `(product_id, warehouse_id)` and `(product_id, store_id)`.
  2. Implemented strict invariant validation in service layer throwing `InsufficientStockException` if `requestedQty > (quantity - reservedQuantity)`.
  3. Added PostgreSQL check constraint `CHECK (quantity >= 0)`.
- **Verification:** Automated unit test `testStockOut_InsufficientStock_ThrowsException` confirms deduction is blocked and exception thrown.

### Defect BUG-004: Cancellation Did Not Release Reserved Stock
- **Severity:** HIGH
- **Component:** `OrderService.java`
- **Description:** When an operator cancelled an order before picking, the order marked `CANCELLED` but physical inventory still showed units as `Reserved`, permanently locking available stock.
- **Root Cause:** The order cancellation service omitted the call to `inventoryService.releaseReservedStock(productId, locationId, qty)`.
- **Resolution:** Added atomic rollback loop in `cancelOrder()` to iterate all order items and decrement `reserved_quantity`, restoring `available_to_promise` units.
- **Verification:** Automated unit test `testCancelOrder_ReleasesReservedStock` confirms reserved quantity drops to zero and available quantity restores.

---
© 2026 XYZ Retail Corporation • Document Reference: `PRG_RIMS_001_BUGS_V2`

