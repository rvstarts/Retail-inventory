# REST API Specification
## Retail Inventory Management System (RIMS)
**Project Code:** `PRG_RIMS_001`  
**Base URL:** `http://localhost:8080/api/v1` (Production: `https://rims.xyzretail.com/api/v1`)  
**Standard:** OpenAPI 3.0.3 / JSON REST  
**Authentication:** Bearer JWT (`Authorization: Bearer <token>`)  

---

## 1. Authentication & Security Endpoints

### 1.1 Authenticate Operator (Login)
- **Method:** `POST`
- **Path:** `/auth/login`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "username": "superadmin",
    "password": "Password123!"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Authentication successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdXBlcmFkbWluIi...",
      "tokenType": "Bearer",
      "expiresIn": 86400000,
      "user": {
        "id": 1,
        "username": "superadmin",
        "email": "superadmin@xyzretail.com",
        "roles": ["ROLE_SUPER_ADMIN"]
      }
    }
  }
  ```

### 1.2 Get Current User Profile
- **Method:** `GET`
- **Path:** `/auth/me`
- **Access:** Authenticated

---

## 2. Product Catalog Management (Epic 1)

### 2.1 Get All Products
- **Method:** `GET`
- **Path:** `/products`
- **Query Params:** `categoryId` (optional), `status` (optional), `search` (optional), `page` (default: 0), `size` (default: 50)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "1",
        "name": "Raymond Men Slim Fit Suit",
        "sku": "APP-SUIT-001",
        "barcode": "8901234000018",
        "categoryName": "Apparel",
        "costPrice": 3800.00,
        "sellingPrice": 7999.00,
        "minStockLevel": 10,
        "reorderPoint": 20,
        "status": "ACTIVE"
      }
    ]
  }
  ```

### 2.2 Create Product
- **Method:** `POST`
- **Path:** `/products`
- **Access:** `SUPER_ADMIN`, `ADMIN`, `INVENTORY_STAFF`
- **Request Body:**
  ```json
  {
    "name": "Philips Air Fryer HD9252/90",
    "sku": "HOM-AF-006",
    "categoryId": 3,
    "brand": "Philips",
    "costPrice": 4200.00,
    "sellingPrice": 8999.00,
    "barcode": "8901234000063",
    "minStockLevel": 10,
    "reorderPoint": 20,
    "status": "ACTIVE"
  }
  ```
- **Response (201 Created)**

### 2.3 Bulk CSV Catalog Import
- **Method:** `POST`
- **Path:** `/products/bulk-import`
- **Content-Type:** `multipart/form-data`
- **Form Param:** `file` (CSV file)

---

## 3. Inventory Operations & Ledger (Epic 2)

### 3.1 Get Stock Overview
- **Method:** `GET`
- **Path:** `/inventory`
- **Query Params:** `warehouseId` (optional), `storeId` (optional), `lowStockOnly` (boolean)

### 3.2 Inbound Stock Receipt (Stock-In)
- **Method:** `POST`
- **Path:** `/inventory/stock-in`
- **Request Body:**
  ```json
  {
    "warehouseId": 1,
    "productId": 1,
    "quantity": 50,
    "unitCost": 3800.00,
    "transactionType": "PURCHASE_RECEIPT",
    "referenceNumber": "PO-2026-0001",
    "notes": "Delivered against verified supplier manifest"
  }
  ```

### 3.3 Outbound Stock Issue (Stock-Out)
- **Method:** `POST`
- **Path:** `/inventory/stock-out`
- **Request Body:**
  ```json
  {
    "warehouseId": 1,
    "productId": 1,
    "quantity": 10,
    "transactionType": "SALES_DISPATCH",
    "referenceNumber": "DISP-2026-904"
  }
  ```
- **Error Response (400 Bad Request):** If requested quantity > available stock.
  ```json
  {
    "success": false,
    "message": "Insufficient stock! Available: 4, Requested: 10. Negative inventory strictly prohibited.",
    "errorCode": "INSUFFICIENT_STOCK"
  }
  ```

### 3.4 Inter-Facility Stock Transfer
- **Method:** `POST`
- **Path:** `/inventory/transfers`
- **Request Body:**
  ```json
  {
    "sourceLocationId": 1,
    "sourceType": "WAREHOUSE",
    "destinationLocationId": 2,
    "destinationType": "STORE",
    "items": [
      { "productId": 1, "quantity": 25 }
    ],
    "vehicleNumber": "KA-01-MJ-4412"
  }
  ```

---

## 4. Customer Order Management (Epic 3)

### 4.1 Create Sales Order (Reserves Stock)
- **Method:** `POST`
- **Path:** `/orders`
- **Request Body:**
  ```json
  {
    "customerName": "Aarav Sharma",
    "customerPhone": "+91 98201 55678",
    "shippingAddress": "402 Skyline Towers, Indiranagar, Bengaluru 560038",
    "items": [
      { "productId": 1, "quantity": 2, "unitPrice": 7999.00 }
    ],
    "totalAmount": 18877.64
  }
  ```

### 4.2 Advance Fulfillment Stage
- **Method:** `POST`
- **Path:** `/orders/{orderId}/advance-status`
- **Request Body:** `{"nextStatus": "SHIPPED", "trackingNumber": "BD-MUM-991204"}`

### 4.3 Cancel Order (Releases Reserved Stock)
- **Method:** `POST`
- **Path:** `/orders/{orderId}/cancel`

---

## 5. Procurement & Purchase Orders (Epic 4)

### 5.1 Issue Purchase Order
- **Method:** `POST`
- **Path:** `/purchase-orders`
- **Request Body:**
  ```json
  {
    "supplierId": 1,
    "warehouseId": 1,
    "expectedDeliveryDate": "2026-11-08",
    "items": [
      { "productId": 1, "quantityOrdered": 100, "unitCost": 3800.00 }
    ]
  }
  ```

### 5.2 Goods Inward Receipt (GRN)
- **Method:** `POST`
- **Path:** `/purchase-orders/{id}/receive`
- **Request Body:**
  ```json
  {
    "docketNumber": "DN-89210-MUM",
    "receivedItems": [
      { "itemId": 1, "quantityReceived": 100, "quantityDamaged": 0 }
    ]
  }
  ```

---

## 6. Barcode & RFID Integration (Epic 5)

### 6.1 Generate Code 128 Barcode Image
- **Method:** `GET`
- **Path:** `/tracking/barcode/generate/{barcodeText}`
- **Response:** `image/png` binary stream.

### 6.2 Simulate UHF RFID Pallet Pass-Through
- **Method:** `POST`
- **Path:** `/tracking/rfid/scan-pallet`
- **Request Body:** `{"gateId": "GATE-01", "timeoutMs": 500}`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "tagsCaptured": 24,
    "durationMs": 180,
    "results": [
      { "epcTagId": "E280116060000208D1612001", "sku": "APP-SUIT-001", "rssiDbm": -48, "antennaId": "ANT-1" }
    ]
  }
  ```

---

## 7. Analytics & Business Reports (Epic 6)

### 7.1 Dashboard Executive KPI Summary
- **Method:** `GET`
- **Path:** `/dashboard/summary`
- **Response (200 OK):** Returns 10 live database calculated KPIs + 6 chart telemetry series.

### 7.2 Generate Business Report
- **Method:** `GET`
- **Path:** `/reports/{reportType}`
- **Path Params:** `inventory_summary`, `stock_movement`, `low_stock`, `out_of_stock`, `inventory_valuation`, `purchase_orders`, `sales_orders`, `product_performance`, `supplier_performance`, `inventory_turnover`
- **Query Params:** `format` (`json` or `csv`), `timeRange` (`7d`, `30d`, `90d`, `1y`)

---
© 2026 XYZ Retail Corporation • Document Reference: `PRG_RIMS_001_API_V2`

