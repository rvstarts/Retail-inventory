-- =============================================================================
-- RETAIL INVENTORY MANAGEMENT SYSTEM (RIMS)
-- Project Code: PRG_RIMS_001
-- Database Schema Definition (PostgreSQL 15+)
-- Client: XYZ Retail Corporation
-- =============================================================================

-- Drop tables if needed in reverse dependency order
DROP TABLE IF EXISTS integration_logs CASCADE;
DROP TABLE IF EXISTS integration_configs CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS rfid_scan_logs CASCADE;
DROP TABLE IF EXISTS barcode_records CASCADE;
DROP TABLE IF EXISTS return_items CASCADE;
DROP TABLE IF EXISTS returns CASCADE;
DROP TABLE IF EXISTS order_status_history CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS customer_orders CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS purchase_order_items CASCADE;
DROP TABLE IF EXISTS purchase_orders CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS stock_transfer_items CASCADE;
DROP TABLE IF EXISTS stock_transfers CASCADE;
DROP TABLE IF EXISTS stock_transactions CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS stores CASCADE;
DROP TABLE IF EXISTS warehouses CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- -----------------------------------------------------------------------------
-- 1. USERS
-- -----------------------------------------------------------------------------
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- -----------------------------------------------------------------------------
-- 2. ROLES
-- -----------------------------------------------------------------------------
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- -----------------------------------------------------------------------------
-- 3. PERMISSIONS
-- -----------------------------------------------------------------------------
CREATE TABLE permissions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    module VARCHAR(50) NOT NULL,
    description VARCHAR(255)
);

-- -----------------------------------------------------------------------------
-- 4. USER_ROLES (Many-to-Many)
-- -----------------------------------------------------------------------------
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- -----------------------------------------------------------------------------
-- 5. ROLE_PERMISSIONS (Many-to-Many)
-- -----------------------------------------------------------------------------
CREATE TABLE role_permissions (
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id BIGINT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- -----------------------------------------------------------------------------
-- 6. CATEGORIES
-- -----------------------------------------------------------------------------
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    parent_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 7. PRODUCTS
-- -----------------------------------------------------------------------------
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    sku VARCHAR(50) NOT NULL UNIQUE,
    barcode VARCHAR(100) UNIQUE,
    description TEXT,
    category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    brand VARCHAR(100),
    purchase_price DECIMAL(12, 2) NOT NULL CHECK (purchase_price >= 0),
    selling_price DECIMAL(12, 2) NOT NULL CHECK (selling_price >= 0),
    min_stock_level INT NOT NULL DEFAULT 10 CHECK (min_stock_level >= 0),
    reorder_point INT NOT NULL DEFAULT 20 CHECK (reorder_point >= 0),
    image_url VARCHAR(500),
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE, DISCONTINUED
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);

-- -----------------------------------------------------------------------------
-- 8. WAREHOUSES
-- -----------------------------------------------------------------------------
CREATE TABLE warehouses (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    address_line TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    contact_phone VARCHAR(20),
    contact_email VARCHAR(100),
    capacity INT NOT NULL DEFAULT 100000,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 9. STORES
-- -----------------------------------------------------------------------------
CREATE TABLE stores (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    address_line TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    contact_phone VARCHAR(20),
    contact_email VARCHAR(100),
    assigned_warehouse_id BIGINT REFERENCES warehouses(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 10. INVENTORY (Product Stock per Location)
-- -----------------------------------------------------------------------------
CREATE TABLE inventory (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    location_type VARCHAR(20) NOT NULL, -- 'WAREHOUSE' or 'STORE'
    warehouse_id BIGINT REFERENCES warehouses(id) ON DELETE CASCADE,
    store_id BIGINT REFERENCES stores(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    reserved_quantity INT NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
    reorder_point INT NOT NULL DEFAULT 20,
    safety_stock INT NOT NULL DEFAULT 10,
    last_audit_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_location_ref CHECK (
        (location_type = 'WAREHOUSE' AND warehouse_id IS NOT NULL AND store_id IS NULL) OR
        (location_type = 'STORE' AND store_id IS NOT NULL AND warehouse_id IS NULL)
    ),
    CONSTRAINT uq_product_warehouse UNIQUE (product_id, warehouse_id),
    CONSTRAINT uq_product_store UNIQUE (product_id, store_id),
    CONSTRAINT chk_quantity_reserved CHECK (quantity >= reserved_quantity)
);

CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_warehouse ON inventory(warehouse_id);
CREATE INDEX idx_inventory_store ON inventory(store_id);

-- -----------------------------------------------------------------------------
-- 11. STOCK_TRANSACTIONS (Ledger)
-- -----------------------------------------------------------------------------
CREATE TABLE stock_transactions (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    location_type VARCHAR(20) NOT NULL,
    warehouse_id BIGINT REFERENCES warehouses(id) ON DELETE SET NULL,
    store_id BIGINT REFERENCES stores(id) ON DELETE SET NULL,
    transaction_type VARCHAR(30) NOT NULL, -- 'STOCK_IN', 'STOCK_OUT', 'ADJUSTMENT', 'TRANSFER_IN', 'TRANSFER_OUT', 'RETURN_IN', 'FULFILLMENT_OUT'
    quantity_change INT NOT NULL, -- Positive or negative delta
    quantity_after INT NOT NULL,  -- Resulting physical stock
    reference_id VARCHAR(100),    -- PO#, Order#, Transfer#, Barcode Scan Ref
    notes TEXT,
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stock_trans_product ON stock_transactions(product_id);
CREATE INDEX idx_stock_trans_created ON stock_transactions(created_at);

-- -----------------------------------------------------------------------------
-- 12. STOCK_TRANSFERS
-- -----------------------------------------------------------------------------
CREATE TABLE stock_transfers (
    id BIGSERIAL PRIMARY KEY,
    transfer_number VARCHAR(50) NOT NULL UNIQUE,
    source_type VARCHAR(20) NOT NULL, -- 'WAREHOUSE' or 'STORE'
    source_warehouse_id BIGINT REFERENCES warehouses(id) ON DELETE SET NULL,
    source_store_id BIGINT REFERENCES stores(id) ON DELETE SET NULL,
    dest_type VARCHAR(20) NOT NULL,
    dest_warehouse_id BIGINT REFERENCES warehouses(id) ON DELETE SET NULL,
    dest_store_id BIGINT REFERENCES stores(id) ON DELETE SET NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'REQUESTED', -- REQUESTED, APPROVED, IN_TRANSIT, COMPLETED, CANCELLED
    tracking_notes TEXT,
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    approved_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 13. STOCK_TRANSFER_ITEMS
-- -----------------------------------------------------------------------------
CREATE TABLE stock_transfer_items (
    id BIGSERIAL PRIMARY KEY,
    transfer_id BIGINT NOT NULL REFERENCES stock_transfers(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INT NOT NULL CHECK (quantity > 0),
    received_quantity INT NOT NULL DEFAULT 0 CHECK (received_quantity >= 0)
);

-- -----------------------------------------------------------------------------
-- 14. SUPPLIERS
-- -----------------------------------------------------------------------------
CREATE TABLE suppliers (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    gstin VARCHAR(50),
    payment_terms VARCHAR(100),
    rating DECIMAL(3, 2) DEFAULT 4.50,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 15. PURCHASE_ORDERS
-- -----------------------------------------------------------------------------
CREATE TABLE purchase_orders (
    id BIGSERIAL PRIMARY KEY,
    po_number VARCHAR(50) NOT NULL UNIQUE,
    supplier_id BIGINT NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
    warehouse_id BIGINT NOT NULL REFERENCES warehouses(id) ON DELETE RESTRICT,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT', -- DRAFT, SUBMITTED, APPROVED, PARTIALLY_RECEIVED, RECEIVED, CANCELLED
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    expected_delivery_date DATE,
    notes TEXT,
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    approved_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_po_supplier ON purchase_orders(supplier_id);
CREATE INDEX idx_po_status ON purchase_orders(status);

-- -----------------------------------------------------------------------------
-- 16. PURCHASE_ORDER_ITEMS
-- -----------------------------------------------------------------------------
CREATE TABLE purchase_order_items (
    id BIGSERIAL PRIMARY KEY,
    purchase_order_id BIGINT NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    ordered_quantity INT NOT NULL CHECK (ordered_quantity > 0),
    received_quantity INT NOT NULL DEFAULT 0 CHECK (received_quantity >= 0),
    unit_cost DECIMAL(12, 2) NOT NULL CHECK (unit_cost >= 0),
    total_cost DECIMAL(12, 2) NOT NULL CHECK (total_cost >= 0)
);

-- -----------------------------------------------------------------------------
-- 17. CUSTOMERS
-- -----------------------------------------------------------------------------
CREATE TABLE customers (
    id BIGSERIAL PRIMARY KEY,
    customer_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    shipping_address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 18. CUSTOMER_ORDERS
-- -----------------------------------------------------------------------------
CREATE TABLE customer_orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    store_id BIGINT REFERENCES stores(id) ON DELETE SET NULL,
    warehouse_id BIGINT REFERENCES warehouses(id) ON DELETE SET NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    -- PENDING, CONFIRMED, PROCESSING, PICKED, PACKED, SHIPPED, DELIVERED, CANCELLED, RETURN_REQUESTED, RETURNED, REFUNDED
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    shipping_tracking_number VARCHAR(100),
    shipping_carrier VARCHAR(50),
    notes TEXT,
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_customer ON customer_orders(customer_id);
CREATE INDEX idx_orders_status ON customer_orders(status);
CREATE INDEX idx_orders_number ON customer_orders(order_number);

-- -----------------------------------------------------------------------------
-- 19. ORDER_ITEMS
-- -----------------------------------------------------------------------------
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES customer_orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(12, 2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(12, 2) NOT NULL CHECK (total_price >= 0),
    is_reserved BOOLEAN NOT NULL DEFAULT FALSE
);

-- -----------------------------------------------------------------------------
-- 20. ORDER_STATUS_HISTORY
-- -----------------------------------------------------------------------------
CREATE TABLE order_status_history (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES customer_orders(id) ON DELETE CASCADE,
    from_status VARCHAR(30),
    to_status VARCHAR(30) NOT NULL,
    comments TEXT,
    changed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 21. RETURNS
-- -----------------------------------------------------------------------------
CREATE TABLE returns (
    id BIGSERIAL PRIMARY KEY,
    return_number VARCHAR(50) NOT NULL UNIQUE,
    order_id BIGINT NOT NULL REFERENCES customer_orders(id) ON DELETE RESTRICT,
    reason TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- PENDING, INSPECTED, APPROVED, REJECTED, RESTOCKED, REFUNDED
    refund_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    restock_warehouse_id BIGINT REFERENCES warehouses(id) ON DELETE SET NULL,
    restock_store_id BIGINT REFERENCES stores(id) ON DELETE SET NULL,
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 22. RETURN_ITEMS
-- -----------------------------------------------------------------------------
CREATE TABLE return_items (
    id BIGSERIAL PRIMARY KEY,
    return_id BIGINT NOT NULL REFERENCES returns(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INT NOT NULL CHECK (quantity > 0),
    condition VARCHAR(50) NOT NULL DEFAULT 'RESTOCKABLE', -- RESTOCKABLE, DAMAGED, DEFECTIVE
    is_restocked BOOLEAN NOT NULL DEFAULT FALSE
);

-- -----------------------------------------------------------------------------
-- 23. BARCODE_RECORDS
-- -----------------------------------------------------------------------------
CREATE TABLE barcode_records (
    id BIGSERIAL PRIMARY KEY,
    barcode VARCHAR(100) NOT NULL UNIQUE,
    barcode_format VARCHAR(30) NOT NULL DEFAULT 'CODE_128',
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    serial_number VARCHAR(100),
    batch_number VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_barcode_records_code ON barcode_records(barcode);

-- -----------------------------------------------------------------------------
-- 24. RFID_SCAN_LOGS
-- -----------------------------------------------------------------------------
CREATE TABLE rfid_scan_logs (
    id BIGSERIAL PRIMARY KEY,
    epc_tag VARCHAR(100) NOT NULL,
    reader_id VARCHAR(50) NOT NULL,
    location_type VARCHAR(20) NOT NULL,
    warehouse_id BIGINT REFERENCES warehouses(id) ON DELETE SET NULL,
    store_id BIGINT REFERENCES stores(id) ON DELETE SET NULL,
    product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
    action_type VARCHAR(50) NOT NULL, -- INVENTORY_VERIFICATION, GATE_CHECK_IN, GATE_CHECK_OUT
    rssi_signal DECIMAL(5, 2),
    scan_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rfid_epc ON rfid_scan_logs(epc_tag);

-- -----------------------------------------------------------------------------
-- 25. NOTIFICATIONS
-- -----------------------------------------------------------------------------
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    recipient_user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- LOW_STOCK, ORDER_STATUS, PO_RECEIVED, TRANSFER_ALERT, SYSTEM
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    reference_link VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_recipient ON notifications(recipient_user_id, is_read);

-- -----------------------------------------------------------------------------
-- 26. AUDIT_LOGS
-- -----------------------------------------------------------------------------
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    username VARCHAR(50),
    action VARCHAR(50) NOT NULL, -- CREATE, UPDATE, DELETE, LOGIN, STOCK_ADJUST, EXPORT
    entity_name VARCHAR(50) NOT NULL,
    entity_id VARCHAR(50),
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

-- -----------------------------------------------------------------------------
-- 27. INTEGRATION_CONFIGS
-- -----------------------------------------------------------------------------
CREATE TABLE integration_configs (
    id BIGSERIAL PRIMARY KEY,
    system_name VARCHAR(50) NOT NULL UNIQUE, -- 'SAP_ERP', 'TALLY_ACCOUNTING', 'BLUEDART_SHIPPING'
    system_type VARCHAR(50) NOT NULL,        -- 'ERP', 'ACCOUNTING', 'LOGISTICS'
    api_endpoint VARCHAR(255) NOT NULL,
    auth_type VARCHAR(30) NOT NULL DEFAULT 'BEARER_TOKEN', -- API_KEY, BEARER_TOKEN, BASIC
    api_key VARCHAR(255),
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    sync_frequency_minutes INT NOT NULL DEFAULT 60,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(30) NOT NULL DEFAULT 'HEALTHY', -- HEALTHY, WARNING, ERROR, DISABLED
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 28. INTEGRATION_LOGS
-- -----------------------------------------------------------------------------
CREATE TABLE integration_logs (
    id BIGSERIAL PRIMARY KEY,
    config_id BIGINT NOT NULL REFERENCES integration_configs(id) ON DELETE CASCADE,
    direction VARCHAR(20) NOT NULL, -- INBOUND, OUTBOUND
    entity_type VARCHAR(50) NOT NULL, -- INVENTORY, ORDER, INVOICE, SHIPMENT
    payload TEXT,
    response_code INT,
    response_body TEXT,
    status VARCHAR(30) NOT NULL, -- SUCCESS, FAILED, RETRYING
    retry_count INT NOT NULL DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_integration_logs_config ON integration_logs(config_id);
CREATE INDEX idx_integration_logs_status ON integration_logs(status);

