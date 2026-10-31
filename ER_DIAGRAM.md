# Entity-Relationship (ER) Diagram
## Retail Inventory Management System (RIMS)
**Project Code:** `PRG_RIMS_001`  
**Client:** XYZ Retail Corporation  
**Engine:** PostgreSQL 16 (3NF Normalized Schema)  

---

## 1. Visual Entity-Relationship Architecture

The diagram below represents the core database relationships across Catalog, Inventory, Locations, Procurement, Customer Orders, and Ledger Auditing:

```mermaid
erDiagram
    CATEGORIES ||--o{ PRODUCTS : "classifies"
    PRODUCTS ||--o{ PRODUCT_IMAGES : "has"
    PRODUCTS ||--o{ INVENTORY : "held_as"
    PRODUCTS ||--o{ STOCK_TRANSACTIONS : "recorded_in"
    PRODUCTS ||--o{ ORDER_ITEMS : "ordered_in"
    PRODUCTS ||--o{ PURCHASE_ORDER_ITEMS : "procured_in"
    PRODUCTS ||--o{ STOCK_TRANSFER_ITEMS : "transferred_in"
    PRODUCTS ||--o{ BARCODE_RECORDS : "labeled_with"

    WAREHOUSES ||--o{ INVENTORY : "stores"
    WAREHOUSES ||--o{ STORES : "replenishes"
    WAREHOUSES ||--o{ PURCHASE_ORDERS : "receives"
    WAREHOUSES ||--o{ STOCK_TRANSFERS : "originates_or_receives"

    STORES ||--o{ INVENTORY : "displays"
    STORES ||--o{ CUSTOMER_ORDERS : "fulfills"
    STORES ||--o{ STOCK_TRANSFERS : "requests"

    CUSTOMERS ||--o{ CUSTOMER_ORDERS : "places"
    CUSTOMER_ORDERS ||--|{ ORDER_ITEMS : "contains"
    CUSTOMER_ORDERS ||--o{ ORDER_STATUS_HISTORY : "tracks"
    CUSTOMER_ORDERS ||--o{ RETURN_ORDERS : "generates"

    RETURN_ORDERS ||--|{ RETURN_ITEMS : "contains"

    SUPPLIERS ||--o{ PURCHASE_ORDERS : "supplies"
    PURCHASE_ORDERS ||--|{ PURCHASE_ORDER_ITEMS : "contains"

    STOCK_TRANSFERS ||--|{ STOCK_TRANSFER_ITEMS : "contains"

    USERS ||--o{ USER_ROLES : "assigned"
    ROLES ||--o{ USER_ROLES : "grants"
    ROLES ||--o{ ROLE_PERMISSIONS : "includes"
    PERMISSIONS ||--o{ ROLE_PERMISSIONS : "granted_by"

    USERS ||--o{ STOCK_TRANSACTIONS : "authorizes"
    USERS ||--o{ AUDIT_LOGS : "performed_by"

    PRODUCTS {
        bigint id PK
        varchar sku UK
        varchar barcode UK
        varchar name
        numeric cost_price
        numeric selling_price
        integer min_stock_level
        integer reorder_point
        varchar status
        bigint category_id FK
    }

    CATEGORIES {
        bigint id PK
        varchar code UK
        varchar name
        text description
        bigint parent_id FK
    }

    INVENTORY {
        bigint id PK
        bigint product_id FK
        bigint warehouse_id FK
        bigint store_id FK
        integer quantity
        integer reserved_quantity
        integer reorder_level
        timestamp last_counted_at
    }

    STOCK_TRANSACTIONS {
        bigint id PK
        bigint product_id FK
        bigint warehouse_id FK
        bigint store_id FK
        varchar transaction_type
        integer quantity_delta
        integer previous_balance
        integer new_balance
        varchar reference_number
        varchar performed_by
        timestamp created_at
    }

    WAREHOUSES {
        bigint id PK
        varchar code UK
        varchar name
        varchar city
        integer capacity_units
        varchar status
    }

    STORES {
        bigint id PK
        varchar code UK
        varchar name
        varchar city
        bigint warehouse_id FK
        varchar status
    }

    SUPPLIERS {
        bigint id PK
        varchar code UK
        varchar name
        varchar contact_person
        varchar phone
        varchar email
        numeric rating
        numeric on_time_delivery_rate
    }

    PURCHASE_ORDERS {
        bigint id PK
        varchar po_number UK
        bigint supplier_id FK
        bigint warehouse_id FK
        numeric total_amount
        varchar status
        date expected_delivery_date
    }

    CUSTOMER_ORDERS {
        bigint id PK
        varchar order_number UK
        bigint customer_id FK
        numeric total_amount
        varchar status
        varchar shipping_carrier
        varchar tracking_number
    }

    USERS {
        bigint id PK
        varchar username UK
        varchar email UK
        varchar password_hash
        varchar status
    }
```

---

## 2. Cardinality & Foreign Key Constraints

1. **One-to-Many (`CATEGORIES` → `PRODUCTS`):** Every category contains multiple products. Deleting a category with active products is restricted.
2. **One-to-Many (`PRODUCTS` / `LOCATIONS` → `INVENTORY`):** Every product has specific stock records per warehouse or store with a database unique composite constraint (`product_id`, `warehouse_id`) and (`product_id`, `store_id`).
3. **One-to-Many (`PURCHASE_ORDERS` → `PURCHASE_ORDER_ITEMS`):** Cascade delete permitted only when PO is in `DRAFT` status.
4. **One-to-Many (`CUSTOMER_ORDERS` → `ORDER_ITEMS`):** Immutable once the order transitions to `CONFIRMED`.
5. **Append-Only (`STOCK_TRANSACTIONS`):** No `UPDATE` or `DELETE` operations permitted on the transaction ledger.

---
© 2026 XYZ Retail Corporation • Document Reference: `PRG_RIMS_001_ERD_V2`

