# Database Architecture & Data Dictionary
## Retail Inventory Management System (RIMS)
**Project Code:** `PRG_RIMS_001`  
**Client:** XYZ Retail Corporation  
**Database Engine:** PostgreSQL 16  
**Dialect:** Standard Relational (3NF Normalized)  

---

## 1. Relational Design Principles

The RIMS database is engineered to enterprise banking and retail ERP standards:
1. **Third Normal Form (3NF):** Elimination of transitive dependencies and data redundancies across all 28 tables.
2. **Referential Integrity:** Foreign key constraints with `ON DELETE RESTRICT` on core ledger records to prevent orphaned inventory data.
3. **Check Constraints:** Business rules enforced at the database level (`quantity >= 0`, `selling_price >= cost_price`, `reorder_point >= 0`).
4. **Optimized B-Tree Indexing:** Created on all foreign keys, natural keys (`sku`, `barcode`, `po_number`, `order_number`), and query filters (`status`, `created_at`).
5. **Auditing Columns:** Standard timestamp tracking (`created_at`, `updated_at`, `created_by`, `updated_by`) across all operational entities.

---

## 2. Table Catalog (28 Relational Entities)

### 2.1 Security & Access Control (Tables 1–4)
- `users`: Core operator identities, unique username, email, BCrypt password hash, status (`ACTIVE`/`INACTIVE`).
- `roles`: Enterprise functional roles (`SUPER_ADMIN`, `ADMIN`, `WAREHOUSE_MANAGER`, `STORE_MANAGER`, `INVENTORY_STAFF`, `PROCUREMENT_MANAGER`, `SALES_STAFF`, `ANALYST`).
- `permissions`: Fine-grained privileges (`CATALOG_READ`, `CATALOG_WRITE`, `STOCK_ADJUST`, `TRANSFER_DISPATCH`, etc.).
- `user_roles`: Many-to-many junction mapping users to assigned roles.

### 2.2 Product Catalog (Tables 5–7)
- `categories`: Departmental taxonomy with unique category codes and parent-child hierarchy support.
- `products`: Product master repository, unique SKU, unique barcode, cost price, selling price, safety stock thresholds.
- `product_images`: Multi-image gallery per product with primary image indicator.

### 2.3 Facilities & Locations (Tables 8–9)
- `warehouses`: Regional distribution centers (BOM, DEL, BLR), storage unit capacities, manager contacts.
- `stores`: 500+ point-of-sale retail outlets, associated replenishing warehouse mapping, contact details.

### 2.4 Inventory & Stock Ledger (Tables 10–12)
- `inventory`: Core stock balance table tracking `quantity` (physical on-hand), `reserved_quantity` (held for customer orders), and computed available stock per product/location.
- `stock_transactions`: Immutable audit ledger recording every stock delta (`STOCK_IN`, `STOCK_OUT`, `TRANSFER_IN`, `TRANSFER_OUT`, `ADJUSTMENT`, `RETURN`), previous balance, new balance, user, and reference docket.
- `inventory_audits`: Periodic cycle count audit sessions with discrepancy reconciliation.

### 2.5 Inter-Facility Transfers (Tables 13–14)
- `stock_transfers`: Multi-node transfer orders with lifecycle status (`REQUESTED`, `IN_TRANSIT`, `COMPLETED`, `CANCELLED`), origin location, destination location, carrier vehicle.
- `stock_transfer_items`: Line items and quantities associated with each transfer order.

### 2.6 Customer Order Management (Tables 15–18)
- `customers`: Customer profiles, contact numbers, corporate and shipping addresses.
- `customer_orders`: Omnichannel sales orders, unique order numbers, total billing amount, status (`PENDING` → `CONFIRMED` → `PROCESSING` → `PICKED` → `PACKED` → `SHIPPED` → `DELIVERED`).
- `order_items`: Line items, ordered quantity, unit price, and allocated stock.
- `order_status_history`: Timestamped audit trail of order fulfillment progression.

### 2.7 Returns & Reverse Logistics (Tables 19–20)
- `return_orders`: Customer return tracking referencing the original sales order, inspection condition (`RESTOCKABLE` vs `DAMAGED`), and refund status.
- `return_items`: Returned SKU line items and quantities.

### 2.8 Procurement & Supplier Management (Tables 21–23)
- `suppliers`: Procurement vendor master directory, ratings, on-time delivery percentages, payment terms.
- `purchase_orders`: Vendor replenishment purchase orders with lifecycle status (`DRAFT`, `SUBMITTED`, `APPROVED`, `PARTIALLY_RECEIVED`, `RECEIVED`).
- `purchase_order_items`: Line items, ordered quantities, received quantities, and negotiated unit costs.

### 2.9 Barcode & RFID Telemetry (Tables 24–25)
- `barcode_records`: Code 128 barcode registration and print history.
- `rfid_scan_logs`: High-throughput EPC Gen 2 tag scan events from portal gate antennas with RSSI signal telemetry.

### 2.10 System Notifications, Auditing & Integrations (Tables 26–28)
- `notifications`: Priority system alerts (Low-Stock breaches, PO approvals, transfer updates).
- `audit_logs`: Regulatory audit trail capturing user IP addresses, actions, entity alterations, and timestamps.
- `integration_logs`: External system payload exchange journal for SAP S/4HANA ERP, Tally Prime, and BlueDart API.

---

## 3. Database Indexes Specification

```sql
-- Product Catalog Indexes
CREATE UNIQUE INDEX idx_products_sku ON products(sku);
CREATE UNIQUE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(status);

-- Inventory & Ledger Indexes
CREATE UNIQUE INDEX idx_inventory_product_warehouse ON inventory(product_id, warehouse_id) WHERE warehouse_id IS NOT NULL;
CREATE UNIQUE INDEX idx_inventory_product_store ON inventory(product_id, store_id) WHERE store_id IS NOT NULL;
CREATE INDEX idx_stock_transactions_product_id ON stock_transactions(product_id);
CREATE INDEX idx_stock_transactions_created_at ON stock_transactions(created_at);

-- Orders & Procurement Indexes
CREATE UNIQUE INDEX idx_customer_orders_order_number ON customer_orders(order_number);
CREATE INDEX idx_customer_orders_status ON customer_orders(status);
CREATE UNIQUE INDEX idx_purchase_orders_po_number ON purchase_orders(po_number);
CREATE INDEX idx_purchase_orders_status ON purchase_orders(status);

-- RFID & Auditing Indexes
CREATE INDEX idx_rfid_scan_logs_epc ON rfid_scan_logs(epc_tag_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(created_at);
```

---
© 2026 XYZ Retail Corporation • Document Reference: `PRG_RIMS_001_DB_V2`

