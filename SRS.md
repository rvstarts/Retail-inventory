# Software Requirements Specification (SRS)
## Retail Inventory Management System (RIMS)
**Project Code:** `PRG_RIMS_001`  
**Client:** XYZ Retail Corporation  
**Document Version:** `2.0.0`  
**Standard:** IEEE Std 830-1998 Compliant  

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) establishes the complete functional and non-functional specifications for the **Retail Inventory Management System (RIMS)**. It serves as the formal contract between XYZ Retail Corporation and the engineering development team.

### 1.2 Scope
RIMS encompasses the centralized management of merchandise cataloging, multi-facility inventory tracking across 3 regional distribution hubs and 500+ retail outlets, order processing, stock allocation, supplier procurement, barcode and RFID telemetry, executive business analytics, and ERP system integrations.

---

## 2. Functional Requirements (Mapped to 8 Official Epics)

### 2.1 Epic 1: Product Catalog Management
- **FR-1.1 (Product CRUD):** The system shall allow authorized operators to create, view, update, and soft-delete product records.
- **FR-1.2 (Unique SKU & Barcode):** Every product must possess a globally unique SKU and unique barcode identifier. Duplicate SKU or barcode inputs must be rejected with HTTP 409 Conflict.
- **FR-1.3 (Pricing Rules):** The system must mandate valid monetary values where Selling Price (MSRP) ≥ Cost Price (COGS).
- **FR-1.4 (Categorization):** Every product must be assigned to an active departmental category.
- **FR-1.5 (Bulk CSV Operations):** The system shall support bulk CSV imports with schema validation and offer one-click CSV export of the catalog.
- **FR-1.6 (Safety Levels):** Each SKU must maintain configurable `min_stock_level` and `reorder_point` values.

### 2.2 Epic 2: Inventory Tracking and Management
- **FR-2.1 (Multi-Location Segregation):** The system shall track inventory distinctly per location node (Warehouse vs. Retail Store).
- **FR-2.2 (Stock-In Receipt):** Authorized operators must be able to record inbound stock receipts referencing a PO, return, or audit surplus.
- **FR-2.3 (Stock-Out Issue):** The system shall issue stock deductions for sales dispatch or scrap write-off.
- **FR-2.4 (Zero-Negative Invariant):** The system shall strictly prevent any operation that results in physical or available stock falling below zero (`quantity >= 0`). Insufficient stock attempts must throw an `InsufficientStockException` (HTTP 400).
- **FR-2.5 (Inter-Facility Transfers):** The system shall process stock transfers across nodes with explicit state transitions (`REQUESTED` → `IN_TRANSIT` → `COMPLETED`). Stock updates to source and destination must execute within a single atomic database transaction (`@Transactional`).
- **FR-2.6 (Immutable Transaction Ledger):** Every stock delta (addition, subtraction, transfer, adjustment) must create an immutable entry in `stock_transactions` capturing previous balance, new balance, operator, and timestamp.
- **FR-2.7 (Low-Stock Alerts):** When `quantity <= reorder_point`, the system must generate a high-priority low-stock notification.

### 2.3 Epic 3: Order Management & Fulfillment
- **FR-3.1 (Order Creation):** Support omnichannel sales order creation with customer contact and delivery address.
- **FR-3.2 (Stock Reservation):** Creating an order must immediately increment `reserved_quantity` and decrement `available_to_promise` (ATP) without physically moving goods.
- **FR-3.3 (Order Cancellation):** Cancelling an order before dispatch must immediately release reserved stock back to available inventory.
- **FR-3.4 (Fulfillment Pipeline):** The order must advance through a validated state machine: `PENDING` → `CONFIRMED` → `PROCESSING` → `PICKED` → `PACKED` → `SHIPPED` → `DELIVERED`.
- **FR-3.5 (Physical Stock Deduction):** Transitioning to `SHIPPED` must deduct physical stock and clear reserved stock.
- **FR-3.6 (Returns Inspection):** Return orders must undergo inspection. `RESTOCKABLE` goods must be credited back to active sellable inventory; `DAMAGED` goods must be written off.

### 2.4 Epic 4: Supplier Management & Procurement
- **FR-4.1 (Supplier Registry):** Maintain vendor profiles, contact registers, payment terms, and historical ratings.
- **FR-4.2 (Purchase Order Lifecycle):** PO state machine: `DRAFT` → `SUBMITTED` → `APPROVED` → `PARTIALLY_RECEIVED` → `RECEIVED` (or `CANCELLED`).
- **FR-4.3 (Goods Inward Receipt - GRN):** Receiving goods against a PO must increment destination warehouse inventory and update the PO received balance. Partial deliveries must be supported.
- **FR-4.4 (Supplier Scorecard):** Calculate on-time delivery percentages and quality defect rates based on GRN history.

### 2.5 Epic 5: Barcode & RFID Integration
- **FR-5.1 (Barcode Generation):** Generate Code 128 barcodes via ZXing library for any catalog item.
- **FR-5.2 (Scanner Terminal):** Decode camera feeds or USB HID scanner inputs to instantly identify products.
- **FR-5.3 (Scan-to-Stock):** Support rapid single-click Stock-In and Stock-Out directly from the scanner terminal.
- **FR-5.4 (Simulated RFID Reader Adapter):** Implement an extensible `RfidReaderAdapter` interface with a `SimulatedRfidReaderAdapter` for bulk EPC Gen 2 tag capture during pallet pass-through.

### 2.6 Epic 6: Reporting and Analytics
- **FR-6.1 (Real-Time KPIs):** The dashboard must compute 10 live metrics from database tables: Total Products, Total Warehouses, Total Stores, Total Inventory Units, Total Inventory Value, Low Stock Count, Out-of-Stock Count, Pending Orders, Completed Orders, and Total Suppliers. Hardcoded figures are prohibited.
- **FR-6.2 (Visual Charts):** Render 6 Recharts visual components: Category distribution, warehouse valuation share, monthly flow, order statuses, top products, and turnover ratios.
- **FR-6.3 (10 Business Reports):** Deliver 10 formal reports with date filters, warehouse filters, CSV export, and print formatting:
  1. Inventory Summary Report
  2. Stock Movement Report
  3. Low Stock Report
  4. Out-of-Stock Report
  5. Inventory Valuation Report
  6. Purchase Order Report
  7. Sales Order Report
  8. Product Performance Report
  9. Supplier Performance Report
  10. Inventory Turnover Report

### 2.7 Epic 7: User Management and Access Control
- **FR-7.1 (Authentication):** Secure login endpoint returning signed HMAC-SHA256 JWT tokens.
- **FR-7.2 (Password Security):** Enforce BCrypt password hashing with cost factor 12. Plaintext passwords must never be stored or logged.
- **FR-7.3 (Role-Based Authorization):** Enforce granular method and route security for 8 personas: `SUPER_ADMIN`, `ADMIN`, `WAREHOUSE_MANAGER`, `STORE_MANAGER`, `INVENTORY_STAFF`, `PROCUREMENT_MANAGER`, `SALES_STAFF`, and `ANALYST`.
- **FR-7.4 (Audit Trail):** Persist all security and critical inventory modifications in an append-only `audit_logs` table.

### 2.8 Epic 8: System Integration
- **FR-8.1 (RESTful APIs):** Standard JSON REST endpoints with pagination, filtering, and OpenAPI 3.0 documentation.
- **FR-8.2 (ERP Integration):** Mock SAP S/4HANA connector for material master and purchase order synchronization.
- **FR-8.3 (Accounting Integration):** Mock Tally Prime connector for sales invoice ledger postings.
- **FR-8.4 (Logistics Carrier Integration):** Mock BlueDart connector for automated AWB generation and shipment tracking.

---

## 3. Non-Functional Requirements (NFRs)

### 3.1 Performance & Scalability (NFR-01)
- **API Latency:** 95% of read requests must respond within 150 milliseconds. Transactional writes must complete within 300 milliseconds.
- **Throughput:** Support 500 concurrent retail point-of-sale store terminals without performance degradation.
- **Database Indexing:** B-Tree indexes must be maintained on all foreign keys, SKUs, barcodes, order numbers, and transaction timestamps.

### 3.2 Security & Compliance (NFR-02)
- **Transport Security:** All HTTP traffic must be encrypted over TLS 1.3 in production.
- **Token Expiry:** JWT tokens must expire after 24 hours (`86400000 ms`) with stateless verification.
- **CORS Protection:** Explicit CORS configuration restricting allowed origins and headers.

### 3.3 Reliability & Availability (NFR-03)
- **High Availability:** 99.9% uptime target achieved through containerized deployment across multi-AZ AWS ECS clusters.
- **Database Durability:** WAL (Write-Ahead Logging) enabled with point-in-time recovery (PITR).

### 3.4 Usability & Accessibility (NFR-04)
- Responsive layout supporting 1920x1080 desktop displays, 1024x768 tablets, and 375px mobile scanner viewports.
- WCAG 2.1 Level AA color contrast compliance across slate/navy enterprise theme.

---
© 2026 XYZ Retail Corporation • Document Reference: `PRG_RIMS_001_SRS_V2`

