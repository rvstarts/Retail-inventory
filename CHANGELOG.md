# Changelog
All notable changes to the **Retail Inventory Management System (RIMS)** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-10-31

### Added
- **Epic 1 (Product Catalog):**
  - Full product CRUD with unique SKU and barcode validation.
  - Departmental category management.
  - Apache Commons CSV streaming bulk product import and export.
- **Epic 2 (Inventory Tracking & Multi-Location):**
  - Multi-facility management (3 distribution warehouses, 5 retail stores).
  - Real-time physical, reserved, and available-to-promise (ATP) inventory tracking.
  - Atomic inter-facility stock transfers (`REQUESTED` → `IN_TRANSIT` → `COMPLETED`).
  - Zero-negative inventory invariant enforcement across all write paths.
  - Immutable append-only `stock_transactions` audit ledger.
  - Automated low-stock and safety threshold alerts.
- **Epic 3 (Customer Order Management):**
  - Omnichannel sales order processing.
  - Real-time stock reservation engine upon order creation.
  - Immediate reserved stock release on order cancellation.
  - Pick-Pack-Ship fulfillment center pipeline.
  - Customer return inspection (`RESTOCKABLE` vs `DAMAGED`) and inventory restock logic.
- **Epic 4 (Supplier Management & Procurement):**
  - Vendor directory with performance scorecards (on-time delivery %, quality defect %).
  - Purchase order lifecycle (`DRAFT` → `SUBMITTED` → `APPROVED` → `PARTIALLY_RECEIVED` → `RECEIVED`).
  - Goods Inward Receipt (GRN) crediting warehouse inventory directly.
- **Epic 5 (Barcode & RFID Integration):**
  - Dynamic Code 128 barcode generation via ZXing.
  - Interactive barcode scanner terminal for instant scan-to-stock.
  - Pluggable `SimulatedRfidReaderAdapter` simulating UHF RFID portal reader bulk pallet scans.
- **Epic 6 (Reporting & Analytics):**
  - Executive dashboard with 10 computed live database KPIs and 6 Recharts charts.
  - 10 official business reports (Inventory Summary, Stock Movement, Low Stock, Out of Stock, Valuation, PO, Sales Order, Product Performance, Supplier Scorecard, Turnover).
- **Epic 7 (Security & Access Control):**
  - Stateless JWT authentication via JJWT 0.12.5.
  - BCrypt 12-round password hashing.
  - 8 enterprise role personas (`SUPER_ADMIN`, `ADMIN`, `WAREHOUSE_MANAGER`, `STORE_MANAGER`, `INVENTORY_STAFF`, `PROCUREMENT_MANAGER`, `SALES_STAFF`, `ANALYST`).
  - Immutable system security audit trail (`audit_logs`).
- **Epic 8 (System Integration):**
  - Bidirectional integration connectors for SAP S/4HANA ERP and Tally Prime accounting.
  - BlueDart courier gateway integration with automated AWB generation.
- **DevOps & Cloud Deployment:**
  - Multi-stage Dockerfiles for Spring Boot (Java 21 JRE runtime) and React (Nginx Alpine).
  - `docker-compose.yml` for unified local stack orchestration.
  - Declarative `Jenkinsfile` for automated CI/CD to AWS ECS.
  - AWS multi-AZ production architecture specification.
- **Documentation Suite:**
  - Comprehensive suite of 15 technical and agile documents: `README.md`, `PROJECT_OVERVIEW.md`, `SRS.md`, `ARCHITECTURE.md`, `DATABASE.md`, `ER_DIAGRAM.md`, `API.md`, `PRODUCT_BACKLOG.md`, `PROJECT_PLAN.md`, `TESTING.md`, `TEST_CASES.md`, `BUG_REPORT.md`, `DEPLOYMENT.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `LICENSE`.
- **Automated Tests:**
  - JUnit 5 & Mockito test suite (`ProductServiceTest`, `InventoryServiceTest`, `OrderServiceTest`, `JwtTokenProviderTest`) with 10/10 tests passing.

