-- V2__seed_data.sql - Complete Seed Data for RIMS
-- Client: XYZ Retail Corporation

-- 1. ROLES
INSERT INTO roles (id, name, description) VALUES
(1, 'SUPER_ADMIN', 'Super Administrator with full unrestricted access to all modules and system configurations'),
(2, 'ADMIN', 'System Administrator with access to users, settings, and full operational modules'),
(3, 'WAREHOUSE_MANAGER', 'Warehouse operations manager overseeing stock-in, stock-out, audits, and transfers'),
(4, 'STORE_MANAGER', 'Retail store manager responsible for store stock levels, receiving, and replenishment'),
(5, 'INVENTORY_STAFF', 'Inventory and warehouse floor staff handling scanning, receiving, and audits'),
(6, 'PROCUREMENT_MANAGER', 'Procurement officer managing suppliers, quotations, and purchase orders'),
(7, 'SALES_STAFF', 'Sales and counter staff processing customer orders, reserve stock, and returns'),
(8, 'ANALYST', 'Business analyst with read-only access to analytics, financial reports, and logs');

-- 2. PERMISSIONS
INSERT INTO permissions (id, name, module, description) VALUES
(1, 'PRODUCT_READ', 'PRODUCT', 'View products and catalog details'),
(2, 'PRODUCT_WRITE', 'PRODUCT', 'Create and modify products'),
(3, 'PRODUCT_DELETE', 'PRODUCT', 'Deactivate or delete products'),
(4, 'INVENTORY_READ', 'INVENTORY', 'View inventory levels across locations'),
(5, 'INVENTORY_WRITE', 'INVENTORY', 'Perform stock-in, stock-out, and adjustments'),
(6, 'INVENTORY_TRANSFER', 'INVENTORY', 'Initiate and approve stock transfers'),
(7, 'ORDER_READ', 'ORDER', 'View customer sales orders'),
(8, 'ORDER_WRITE', 'ORDER', 'Create and manage customer orders'),
(9, 'ORDER_FULFILL', 'ORDER', 'Process pick, pack, ship lifecycle'),
(10, 'SUPPLIER_READ', 'SUPPLIER', 'View suppliers and catalogs'),
(11, 'SUPPLIER_WRITE', 'SUPPLIER', 'Manage supplier profiles and rates'),
(12, 'PO_READ', 'PURCHASE_ORDER', 'View purchase orders'),
(13, 'PO_WRITE', 'PURCHASE_ORDER', 'Create purchase orders'),
(14, 'PO_RECEIVE', 'PURCHASE_ORDER', 'Receive goods against purchase orders'),
(15, 'BARCODE_MANAGE', 'BARCODE', 'Generate and scan barcodes/RFID'),
(16, 'REPORTS_VIEW', 'REPORTS', 'Access reports and analytical dashboards'),
(17, 'USER_MANAGE', 'USER', 'Manage user accounts and role assignments'),
(18, 'SYSTEM_CONFIG', 'SYSTEM', 'Manage integrations and global settings');

-- 3. ROLE_PERMISSIONS
-- Assign permissions to SUPER_ADMIN (all)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions;

-- Assign permissions to ADMIN
INSERT INTO role_permissions (role_id, permission_id)
SELECT 2, id FROM permissions WHERE id IN (1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18);

-- WAREHOUSE_MANAGER
INSERT INTO role_permissions (role_id, permission_id)
VALUES (3, 1), (3, 4), (3, 5), (3, 6), (3, 9), (3, 12), (3, 14), (3, 15), (3, 16);

-- STORE_MANAGER
INSERT INTO role_permissions (role_id, permission_id)
VALUES (4, 1), (4, 4), (4, 5), (4, 6), (4, 7), (4, 8), (4, 15), (4, 16);

-- INVENTORY_STAFF
INSERT INTO role_permissions (role_id, permission_id)
VALUES (5, 1), (5, 4), (5, 5), (5, 14), (5, 15);

-- PROCUREMENT_MANAGER
INSERT INTO role_permissions (role_id, permission_id)
VALUES (6, 1), (6, 10), (6, 11), (6, 12), (6, 13), (6, 14), (6, 16);

-- SALES_STAFF
INSERT INTO role_permissions (role_id, permission_id)
VALUES (7, 1), (7, 4), (7, 7), (7, 8), (7, 15);

-- ANALYST
INSERT INTO role_permissions (role_id, permission_id)
VALUES (8, 1), (8, 4), (8, 7), (8, 12), (8, 16);

-- 4. USERS (BCrypt for 'Admin@123': $2a$10$wN1G1eG18bJ1vK0rU0mX.u6jD9Z0bN5tB/L7A7XhY6uL2fD7fA1.e)
-- Standard BCrypt hash: $2a$10$Xb7vR6w3tq.1x7G8D5YQeOUf/R.XgN7WdD8VqE4y7n6m8j4k6l8a2
-- Note: In Spring Security, we will use BCryptPasswordEncoder. We can hash 'Admin@123' as:
-- $2a$10$7Zk7dZ4ZcZp20w9v1q7WpeF77WkWy/11gV78a4R.Z26kM75J1RzS6
INSERT INTO users (id, username, email, password_hash, first_name, last_name, phone_number, is_active) VALUES
(1, 'superadmin', 'superadmin@xyzretail.com', '$2a$10$7Zk7dZ4ZcZp20w9v1q7WpeF77WkWy/11gV78a4R.Z26kM75J1RzS6', 'Suresh', 'Nambiar', '+91 9820011223', TRUE),
(2, 'admin', 'admin@xyzretail.com', '$2a$10$7Zk7dZ4ZcZp20w9v1q7WpeF77WkWy/11gV78a4R.Z26kM75J1RzS6', 'Kavita', 'Iyer', '+91 9820022334', TRUE),
(3, 'wh_manager', 'warehouse.head@xyzretail.com', '$2a$10$7Zk7dZ4ZcZp20w9v1q7WpeF77WkWy/11gV78a4R.Z26kM75J1RzS6', 'Manoj', 'Tiwari', '+91 9820033445', TRUE),
(4, 'store_manager', 'store.lead@xyzretail.com', '$2a$10$7Zk7dZ4ZcZp20w9v1q7WpeF77WkWy/11gV78a4R.Z26kM75J1RzS6', 'Ananya', 'Roy', '+91 9820044556', TRUE),
(5, 'inv_staff', 'inventory.staff@xyzretail.com', '$2a$10$7Zk7dZ4ZcZp20w9v1q7WpeF77WkWy/11gV78a4R.Z26kM75J1RzS6', 'Rohan', 'Verma', '+91 9820055667', TRUE),
(6, 'proc_manager', 'procurement@xyzretail.com', '$2a$10$7Zk7dZ4ZcZp20w9v1q7WpeF77WkWy/11gV78a4R.Z26kM75J1RzS6', 'Deepak', 'Chawla', '+91 9820066778', TRUE),
(7, 'sales_staff', 'sales.counter@xyzretail.com', '$2a$10$7Zk7dZ4ZcZp20w9v1q7WpeF77WkWy/11gV78a4R.Z26kM75J1RzS6', 'Pooja', 'Deshmukh', '+91 9820077889', TRUE),
(8, 'analyst', 'analyst@xyzretail.com', '$2a$10$7Zk7dZ4ZcZp20w9v1q7WpeF77WkWy/11gV78a4R.Z26kM75J1RzS6', 'Arjun', 'Mehta', '+91 9820088990', TRUE);

-- 5. USER_ROLES
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1), -- superadmin -> SUPER_ADMIN
(2, 2), -- admin -> ADMIN
(3, 3), -- wh_manager -> WAREHOUSE_MANAGER
(4, 4), -- store_manager -> STORE_MANAGER
(5, 5), -- inv_staff -> INVENTORY_STAFF
(6, 6), -- proc_manager -> PROCUREMENT_MANAGER
(7, 7), -- sales_staff -> SALES_STAFF
(8, 8); -- analyst -> ANALYST

-- 6. CATEGORIES (8 Categories)
INSERT INTO categories (id, name, code, description) VALUES
(1, 'Men''s Apparel', 'CAT_MEN_APP', 'Formal shirts, trousers, ethnic kurtas, casual tees and denims'),
(2, 'Women''s Apparel', 'CAT_WOMEN_APP', 'Ethnic sarees, salwar suits, western tops, dresses, and bottom wear'),
(3, 'Footwear & Shoes', 'CAT_FOOTWEAR', 'Formal leather shoes, casual sneakers, sports running shoes and sandals'),
(4, 'Consumer Electronics', 'CAT_ELEC_CONSUMER', 'Smartphones, noise-canceling headphones, smart watches, soundbars'),
(5, 'Smart Home Appliances', 'CAT_HOME_APP', 'Air purifiers, robotic vacuum cleaners, microwave ovens, blenders'),
(6, 'Kitchen & Dining', 'CAT_KITCHEN', 'Stainless steel cookware sets, dinnerware, non-stick pans and cutlery'),
(7, 'Bedding & Furnishing', 'CAT_BEDDING', 'Cotton bedsheets, memory foam pillows, blackout curtains, duvets'),
(8, 'Luggage & Accessories', 'CAT_ACCESSORIES', 'Hard-shell trolley bags, leather wallets, backpacks, travel duffels');

-- 7. WAREHOUSES (3 Warehouses)
INSERT INTO warehouses (id, code, name, address_line, city, state, postal_code, contact_phone, contact_email, capacity) VALUES
(1, 'WH_MUM_01', 'Mumbai Central Distribution Hub', 'Plot 42, MIDC Industrial Area, Bhiwandi', 'Mumbai', 'Maharashtra', '421302', '+91 22 2845 9001', 'bhiwandi.hub@xyzretail.com', 250000),
(2, 'WH_BLR_01', 'Bengaluru Southern Logistics Center', 'Gate 3, Hoskote Industrial Corridor', 'Bengaluru', 'Karnataka', '562114', '+91 80 4120 7800', 'hoskote.wh@xyzretail.com', 200000),
(3, 'WH_DEL_01', 'Delhi NCR Northern Fulfillment Center', 'Sector 88, Bilaspur Logistics Park', 'Gurugram', 'Haryana', '122413', '+91 124 490 8200', 'gurugram.wh@xyzretail.com', 220000);

-- 8. STORES (5 Stores)
INSERT INTO stores (id, code, name, address_line, city, state, postal_code, contact_phone, contact_email, assigned_warehouse_id) VALUES
(1, 'STR_MUM_PHX', 'Phoenix Marketcity Store', 'G-14 Lower Ground, LBS Marg, Kurla West', 'Mumbai', 'Maharashtra', '400070', '+91 22 6180 1200', 'store.kurla@xyzretail.com', 1),
(2, 'STR_BLR_IND', 'Indiranagar Flagship Store', '542 100 Feet Road, HAL 2nd Stage, Indiranagar', 'Bengaluru', 'Karnataka', '560038', '+91 80 2521 8800', 'store.indiranagar@xyzretail.com', 2),
(3, 'STR_DEL_CP', 'Connaught Place Retail Hub', 'Block B, Inner Circle, Connaught Place', 'New Delhi', 'Delhi', '110001', '+91 11 4350 9900', 'store.cp@xyzretail.com', 3),
(4, 'STR_CHN_EA', 'Express Avenue Mall Store', 'Shop 208, 2nd Floor, Royapettah', 'Chennai', 'Tamil Nadu', '600014', '+91 44 2846 4400', 'store.chennai@xyzretail.com', 2),
(5, 'STR_HYD_BH', 'Banjara Hills Luxury Outlet', 'Road No. 2, Opp. Park Hyatt, Banjara Hills', 'Hyderabad', 'Telangana', '500034', '+91 40 6678 3300', 'store.hyderabad@xyzretail.com', 2);

-- 9. SUPPLIERS (5 Suppliers)
INSERT INTO suppliers (id, code, name, contact_person, email, phone, address, gstin, payment_terms, rating) VALUES
(1, 'SUP_RAYMOND', 'Raymond Apparel Mills Ltd', 'Sunil Singhania', 'orders@raymondapparel.com', '+91 22 4036 7000', 'New Hind Mills, Ballard Estate, Mumbai', '27AAACR1234F1Z1', 'NET_30', 4.85),
(2, 'SUP_TATA', 'Tata Consumer Products & Appliances', 'Ramesh Sen', 'b2b.supplies@tataconsumer.com', '+91 33 2288 3100', '1 Bishop Lefroy Road, Kolkata', '19AAACT5678G1Z4', 'NET_45', 4.90),
(3, 'SUP_HAVELLS', 'Havells India Electricals & Home', 'Vikas Gupta', 'procurement@havells.com', '+91 120 477 1000', 'QRG Towers, 2D Expressway, Noida', '09AAACH9012H1Z7', 'NET_30', 4.70),
(4, 'SUP_TITAN', 'Titan Company Accessories & Lifestyle', 'Meenakshi Iyer', 'corporate.orders@titan.co.in', '+91 80 6660 9000', 'Integrity Campus, Hosur Road, Electronic City, Bengaluru', '29AAACT3456J1Z9', 'NET_60', 4.95),
(5, 'SUP_BOMBAYDYE', 'Bombay Dyeing & Manufacturing Co', 'Kunal Wadia', 'sales@bombaydyeing.com', '+91 22 6665 8282', 'Neville House, J.N. Heredia Marg, Ballard Estate, Mumbai', '27AAACB7890K1Z2', 'NET_30', 4.60);

-- 10. PRODUCTS (32 Realistic Indian Retail Products across 8 Categories)
INSERT INTO products (id, name, sku, barcode, description, category_id, brand, purchase_price, selling_price, min_stock_level, reorder_point, image_url, status) VALUES
-- Category 1: Men's Apparel
(1, 'Raymond Pure Linen Slim Fit Shirt - White', 'MEN-SHIRT-LIN-001', '8901234000018', 'Premium breathable French flax linen shirt with spread collar', 1, 'Raymond', 1250.00, 2499.00, 15, 30, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400', 'ACTIVE'),
(2, 'Park Avenue Formal Poly-Viscose Trousers - Charcoal Grey', 'MEN-TROU-CHR-002', '8901234000025', 'Flat front tailored fit formal trousers with flexi-waistband', 1, 'Park Avenue', 950.00, 1999.00, 20, 40, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400', 'ACTIVE'),
(3, 'Manyavar Embroidered Silk Jacquard Kurta - Navy Blue', 'MEN-KURT-JAC-003', '8901234000032', 'Traditional festive mandarin collar kurta with intricate zardozi threadwork', 1, 'Manyavar', 1800.00, 3999.00, 10, 25, 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=400', 'ACTIVE'),
(4, 'Wrangler Rugged Heavyweight Denim Jacket - Classic Indigo', 'MEN-JACK-DEN-004', '8901234000049', '100% cotton stone washed denim jacket with dual chest flap pockets', 1, 'Wrangler', 1600.00, 3499.00, 12, 25, 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400', 'ACTIVE'),

-- Category 2: Women's Apparel
(5, 'Fabindia Handblock Chanderi Silk Saree - Ruby Red', 'WOM-SARE-CHA-005', '8901234000056', 'Artisanal handwoven lightweight chanderi silk saree with zari border', 2, 'Fabindia', 2800.00, 5999.00, 8, 20, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400', 'ACTIVE'),
(6, 'Biba A-Line Festive Anarkali Suit Set with Dupatta - Mustard', 'WOM-SUIT-ANR-006', '8901234000063', 'Pure cotton 3-piece festive anarkali kurta with churidar and printed chiffon dupatta', 2, 'Biba', 1900.00, 4299.00, 15, 30, 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400', 'ACTIVE'),
(7, 'AND Georgette Floral Print Pleated Midi Dress - Emerald', 'WOM-DRES-GEO-007', '8901234000070', 'Contemporary evening midi dress with v-neck and belt accentuation', 2, 'AND', 1100.00, 2799.00, 12, 25, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400', 'ACTIVE'),
(8, 'W for Woman Gold Print Rayon Flared Palazzos - Off White', 'WOM-PLZO-RAY-008', '8901234000087', 'Flowy rayon palazzos with elasticated back and geometric foil motifs', 2, 'W for Woman', 650.00, 1499.00, 20, 45, 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=400', 'ACTIVE'),

-- Category 3: Footwear & Shoes
(9, 'Woodland Heavy-Duty Oiled Nubuck Leather Trek Shoes - Khaki', 'SHO-BOOT-NUB-009', '8901234000094', 'All-weather genuine nubuck leather high ankle boots with rugged traction sole', 3, 'Woodland', 2400.00, 4995.00, 10, 20, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 'ACTIVE'),
(10, 'Red Tape Dual-Tone Oxford Dress Shoes - Tan Brown', 'SHO-FORM-OXF-010', '8901234000100', 'Handcrafted Argentine leather formal oxfords with cushioned Ortholite insole', 3, 'Red Tape', 1400.00, 3199.00, 15, 30, 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400', 'ACTIVE'),
(11, 'Puma Nitro Pro Velocity Running Sneakers - Neon/Black', 'SHO-SNEK-RUN-011', '8901234000117', 'Ultralight responsive nitrogen-injected foam athletic road running trainers', 3, 'Puma', 2800.00, 5999.00, 15, 35, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400', 'ACTIVE'),
(12, 'Bata Comfit Ergonomic Leather Slip-On Sandals - Black', 'SHO-SAND-SLP-012', '8901234000124', 'Everyday casual arch support leather strap slippers with slip-resistant PU base', 3, 'Bata', 550.00, 1299.00, 25, 50, 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=400', 'ACTIVE'),

-- Category 4: Consumer Electronics
(13, 'boAt Rockerz 550 Over-Ear Wireless Headphones - Army Green', 'ELE-HEAD-WIR-013', '8901234000131', '50mm dynamic drivers, 20 hours playback, physical noise isolation cushions', 4, 'boAt', 850.00, 1999.00, 25, 60, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 'ACTIVE'),
(14, 'Noise ColorFit Pro 5 AMOLED Smartwatch - Starlight Grey', 'ELE-WATC-AML-014', '8901234000148', '1.85 inch high-definition AMOLED display, BT calling, SpO2 & 100+ sports modes', 4, 'Noise', 1500.00, 3499.00, 20, 50, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 'ACTIVE'),
(15, 'Portronics SoundDrum P 20W Bluetooth Speaker - Midnight Blue', 'ELE-SPKR-BLU-015', '8901234000155', 'Dual bass passive radiators, IPX6 water resistance, Type-C quick charging', 4, 'Portronics', 900.00, 2199.00, 15, 35, 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400', 'ACTIVE'),
(16, 'Zebronics 100W Dolby Audio Cinema Soundbar with Subwoofer', 'ELE-BARS-DOL-016', '8901234000162', '2.1 channel audio system with dedicated wireless subwoofer and HDMI ARC', 4, 'Zebronics', 2700.00, 5999.00, 8, 18, 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400', 'ACTIVE'),

-- Category 5: Smart Home Appliances
(17, 'Havells Air Pure CleanShield HEPA 13 Room Purifier', 'HOM-PURF-HEP-017', '8901234000179', 'True HEPA 13 filtration removing 99.97% allergens, PM 2.5 real-time indicator', 5, 'Havells', 4800.00, 9499.00, 6, 15, 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400', 'ACTIVE'),
(18, 'Philips Daily Collection 750W 4-Jar Mixer Grinder - Black/Silver', 'HOM-MIXG-750-018', '8901234000186', 'Tough Torque motor, stainless steel leak-proof jars with specialized chutneymatic blade', 5, 'Philips', 1850.00, 3695.00, 15, 30, 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400', 'ACTIVE'),
(19, 'Bajaj Flora Instant 3-Litre 3kW Water Heater Geyser - White', 'HOM-GEYS-3LT-019', '8901234000193', 'High-pressure resistance engineered for multi-story apartments, thermoplastic outer body', 5, 'Bajaj', 1450.00, 2999.00, 10, 20, 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=400', 'ACTIVE'),
(20, 'Eureka Forbes Smart Robotic Vacuum & Mop with LiDAR Navigation', 'HOM-ROBO-VAC-020', '8901234000209', '4000Pa intense suction, 3D obstacle avoidance, automatic carpet boost detection', 5, 'Eureka Forbes', 11500.00, 21990.00, 4, 10, 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400', 'ACTIVE'),

-- Category 6: Kitchen & Dining
(21, 'Prestige Tri-Ply Stainless Steel 3-Piece Cookware Set', 'KIT-COOK-TRP-021', '8901234000216', 'Even heat induction base kadai with glass lid, fry pan and saucepan', 6, 'Prestige', 1800.00, 3750.00, 15, 30, 'https://images.unsplash.com/photo-1584990347449-3a3f5f69c766?w=400', 'ACTIVE'),
(22, 'Borosil Prime 42-Piece Opalware Dinner Set - Royal Blue Motif', 'KIT-DINN-OPL-022', '8901234000223', 'Bone-ash free scratch-resistant microwave and dishwasher safe luxury dinnerware', 6, 'Borosil', 2100.00, 4490.00, 8, 16, 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=400', 'ACTIVE'),
(23, 'Milton Pro Cook Granite 28cm Die-Cast Non-Stick Dosa Tawa', 'KIT-TAWA-NON-023', '8901234000230', '5-layer food-grade durable granite coating with heat-resistant soft bakelite handle', 6, 'Milton', 520.00, 1150.00, 20, 40, 'https://images.unsplash.com/photo-1584990347449-3a3f5f69c766?w=400', 'ACTIVE'),
(24, 'Cello Dura-Steel 1000ml Double Wall Vacuum Insulated Flask', 'KIT-FLSK-VAC-024', '8901234000247', 'Keeps liquids hot or chilled for 24 hours with copper coating technology', 6, 'Cello', 420.00, 899.00, 30, 60, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', 'ACTIVE'),

-- Category 7: Bedding & Furnishing
(25, 'Bombay Dyeing 300 TC Satin Weave King Bedsheet with 2 Pillow Covers', 'BED-SHT-SAT-025', '8901234000254', '100% combed Egyptian long staple cotton silky soft satin bed linen', 7, 'Bombay Dyeing', 1100.00, 2499.00, 15, 30, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400', 'ACTIVE'),
(26, 'Sleepwell Cocoon Orthopedic Memory Foam Pillow - Cervical Contour', 'BED-PILW-MEM-026', '8901234000261', 'Therapeutic slow recovery memory foam with bamboo fabric washable zippered cover', 7, 'Sleepwell', 850.00, 1899.00, 12, 25, 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400', 'ACTIVE'),
(27, 'D''Decor Luxury Thermal Blackout Grommet Curtains (Set of 2) - Stone Grey', 'BED-CURT-BLK-027', '8901234000278', '99% UV and sunlight blocking heavy weave 7-feet door curtains', 7, 'D''Decor', 1300.00, 2999.00, 10, 20, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400', 'ACTIVE'),
(28, 'Trident Microfiber All-Season Reversible AC King Comforter', 'BED-COMF-MIC-028', '8901234000285', 'Hypoallergenic 250 GSM siliconized fiber quilted soft down-alternative duvet', 7, 'Trident', 950.00, 2199.00, 10, 25, 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400', 'ACTIVE'),

-- Category 8: Luggage & Accessories
(29, 'Skybags Trooper 55cm Cabin Polycarbonate Hard-Shell Trolley - Teal', 'LUG-TROL-CAB-029', '8901234000292', 'Ultra-durable scratch resistant polycarbonate shell with 360-degree silent spinner wheels', 8, 'Skybags', 1650.00, 3999.00, 10, 20, 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=400', 'ACTIVE'),
(30, 'American Tourister 32L Casual Laptop Travel Backpack - Jet Black', 'LUG-BACK-LAP-030', '8901234000308', 'Ergonomic air-mesh padded back, dedicated 15.6 inch padded laptop sleeve, water repellent', 8, 'American Tourister', 850.00, 1999.00, 20, 40, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', 'ACTIVE'),
(31, 'Titan Classic Hunter Vintage Genuine Leather Bi-Fold Wallet - Tan', 'ACC-WALT-LTH-031', '8901234000315', 'RFID-blocking top grain hunter cowhide leather wallet with 8 card slots and coin pocket', 8, 'Titan', 550.00, 1395.00, 25, 50, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400', 'ACTIVE'),
(32, 'Fastrack Polarized Aviator UV-Protection Sunglasses - Gunmetal', 'ACC-SUNG-POL-032', '8901234000322', 'Category 3 polarized glare protection with lightweight corrosion-resistant metal frame', 8, 'Fastrack', 600.00, 1499.00, 15, 30, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400', 'ACTIVE');

-- 11. INVENTORY (Warehouse stock + Store stock)
-- Populate warehouse inventory for products 1-32
INSERT INTO inventory (product_id, location_type, warehouse_id, store_id, quantity, reserved_quantity, reorder_point, safety_stock)
VALUES
-- Mumbai WH (1)
(1, 'WAREHOUSE', 1, NULL, 150, 15, 30, 15),
(2, 'WAREHOUSE', 1, NULL, 120, 10, 40, 20),
(3, 'WAREHOUSE', 1, NULL, 45, 5, 25, 10),
(4, 'WAREHOUSE', 1, NULL, 60, 0, 25, 12),
(5, 'WAREHOUSE', 1, NULL, 30, 4, 20, 8),
(6, 'WAREHOUSE', 1, NULL, 80, 5, 30, 15),
(7, 'WAREHOUSE', 1, NULL, 50, 2, 25, 12),
(8, 'WAREHOUSE', 1, NULL, 90, 8, 45, 20),
(9, 'WAREHOUSE', 1, NULL, 40, 0, 20, 10),
(10, 'WAREHOUSE', 1, NULL, 65, 5, 30, 15),
(11, 'WAREHOUSE', 1, NULL, 75, 10, 35, 15),
(12, 'WAREHOUSE', 1, NULL, 110, 0, 50, 25),
(13, 'WAREHOUSE', 1, NULL, 180, 20, 60, 25),
(14, 'WAREHOUSE', 1, NULL, 140, 12, 50, 20),
(15, 'WAREHOUSE', 1, NULL, 85, 0, 35, 15),
(16, 'WAREHOUSE', 1, NULL, 35, 2, 18, 8),
(17, 'WAREHOUSE', 1, NULL, 28, 2, 15, 6),
(18, 'WAREHOUSE', 1, NULL, 65, 0, 30, 15),
(19, 'WAREHOUSE', 1, NULL, 42, 0, 20, 10),
(20, 'WAREHOUSE', 1, NULL, 18, 1, 10, 4),
(21, 'WAREHOUSE', 1, NULL, 70, 5, 30, 15),
(22, 'WAREHOUSE', 1, NULL, 35, 0, 16, 8),
(23, 'WAREHOUSE', 1, NULL, 85, 4, 40, 20),
(24, 'WAREHOUSE', 1, NULL, 130, 0, 60, 30),
(25, 'WAREHOUSE', 1, NULL, 60, 5, 30, 15),
(26, 'WAREHOUSE', 1, NULL, 50, 0, 25, 12),
(27, 'WAREHOUSE', 1, NULL, 40, 2, 20, 10),
(28, 'WAREHOUSE', 1, NULL, 45, 0, 25, 10),
(29, 'WAREHOUSE', 1, NULL, 40, 3, 20, 10),
(30, 'WAREHOUSE', 1, NULL, 95, 8, 40, 20),
(31, 'WAREHOUSE', 1, NULL, 120, 5, 50, 25),
(32, 'WAREHOUSE', 1, NULL, 60, 0, 30, 15),

-- Bengaluru WH (2)
(1, 'WAREHOUSE', 2, NULL, 90, 0, 30, 15),
(5, 'WAREHOUSE', 2, NULL, 25, 0, 20, 8),
(9, 'WAREHOUSE', 2, NULL, 30, 2, 20, 10),
(13, 'WAREHOUSE', 2, NULL, 110, 0, 60, 25),
(14, 'WAREHOUSE', 2, NULL, 80, 5, 50, 20),
(17, 'WAREHOUSE', 2, NULL, 15, 0, 15, 6), -- At reorder point
(20, 'WAREHOUSE', 2, NULL, 8, 0, 10, 4),   -- Low stock alert (8 <= 10)
(21, 'WAREHOUSE', 2, NULL, 40, 0, 30, 15),
(29, 'WAREHOUSE', 2, NULL, 25, 0, 20, 10),
(30, 'WAREHOUSE', 2, NULL, 55, 0, 40, 20),

-- Delhi NCR WH (3)
(2, 'WAREHOUSE', 3, NULL, 85, 0, 40, 20),
(6, 'WAREHOUSE', 3, NULL, 60, 0, 30, 15),
(10, 'WAREHOUSE', 3, NULL, 45, 0, 30, 15),
(13, 'WAREHOUSE', 3, NULL, 95, 0, 60, 25),
(18, 'WAREHOUSE', 3, NULL, 50, 0, 30, 15),
(22, 'WAREHOUSE', 3, NULL, 12, 0, 16, 8), -- Low stock alert (12 <= 16)
(25, 'WAREHOUSE', 3, NULL, 40, 0, 30, 15),
(31, 'WAREHOUSE', 3, NULL, 80, 0, 50, 25),

-- Store 1: Phoenix Marketcity Mumbai (STR_MUM_PHX)
(1, 'STORE', NULL, 1, 24, 0, 15, 8),
(2, 'STORE', NULL, 1, 18, 0, 15, 8),
(5, 'STORE', NULL, 1, 12, 0, 10, 5),
(9, 'STORE', NULL, 1, 8, 0, 10, 5),    -- Low stock
(13, 'STORE', NULL, 1, 35, 0, 20, 10),
(14, 'STORE', NULL, 1, 22, 0, 15, 8),
(21, 'STORE', NULL, 1, 14, 0, 12, 6),
(25, 'STORE', NULL, 1, 10, 0, 12, 6),   -- Low stock
(29, 'STORE', NULL, 1, 7, 0, 8, 4),     -- Low stock
(31, 'STORE', NULL, 1, 28, 0, 20, 10),

-- Store 2: Indiranagar Bengaluru (STR_BLR_IND)
(1, 'STORE', NULL, 2, 16, 0, 12, 6),
(3, 'STORE', NULL, 2, 6, 0, 8, 4),      -- Low stock
(6, 'STORE', NULL, 2, 14, 0, 10, 5),
(11, 'STORE', NULL, 2, 20, 0, 15, 8),
(13, 'STORE', NULL, 2, 25, 0, 18, 8),
(15, 'STORE', NULL, 2, 15, 0, 12, 6),
(22, 'STORE', NULL, 2, 8, 0, 10, 4),    -- Low stock
(30, 'STORE', NULL, 2, 18, 0, 12, 6),

-- Store 3: Connaught Place Delhi (STR_DEL_CP)
(2, 'STORE', NULL, 3, 20, 0, 12, 6),
(4, 'STORE', NULL, 3, 11, 0, 10, 5),
(7, 'STORE', NULL, 3, 9, 0, 10, 5),     -- Low stock
(10, 'STORE', NULL, 3, 14, 0, 12, 6),
(16, 'STORE', NULL, 3, 5, 0, 6, 3),     -- Low stock
(23, 'STORE', NULL, 3, 22, 0, 15, 8),
(27, 'STORE', NULL, 3, 8, 0, 8, 4),

-- Store 4: Express Avenue Chennai (STR_CHN_EA)
(1, 'STORE', NULL, 4, 15, 0, 10, 5),
(8, 'STORE', NULL, 4, 18, 0, 12, 6),
(12, 'STORE', NULL, 4, 22, 0, 15, 8),
(14, 'STORE', NULL, 4, 12, 0, 12, 6),
(24, 'STORE', NULL, 4, 20, 0, 15, 8),
(32, 'STORE', NULL, 4, 14, 0, 10, 5),

-- Store 5: Banjara Hills Hyderabad (STR_HYD_BH)
(3, 'STORE', NULL, 5, 8, 0, 8, 4),
(5, 'STORE', NULL, 5, 10, 0, 8, 4),
(9, 'STORE', NULL, 5, 12, 0, 10, 5),
(17, 'STORE', NULL, 5, 4, 0, 5, 2),     -- Low stock
(20, 'STORE', NULL, 5, 2, 0, 3, 1),     -- Low stock (2 units left)
(29, 'STORE', NULL, 5, 6, 0, 6, 3),
(31, 'STORE', NULL, 5, 19, 0, 15, 8);

-- 12. BARCODE_RECORDS
INSERT INTO barcode_records (barcode, barcode_format, product_id, serial_number, batch_number) VALUES
('8901234000018', 'CODE_128', 1, 'SN-RAY-2026-001', 'BATCH-2026-A1'),
('8901234000025', 'CODE_128', 2, 'SN-PRK-2026-002', 'BATCH-2026-A1'),
('8901234000032', 'CODE_128', 3, 'SN-MNY-2026-003', 'BATCH-2026-A2'),
('8901234000049', 'CODE_128', 4, 'SN-WRG-2026-004', 'BATCH-2026-B1'),
('8901234000056', 'CODE_128', 5, 'SN-FAB-2026-005', 'BATCH-2026-B2'),
('8901234000094', 'CODE_128', 9, 'SN-WOD-2026-009', 'BATCH-2026-C1'),
('8901234000131', 'CODE_128', 13, 'SN-BOT-2026-013', 'BATCH-2026-D1'),
('8901234000148', 'CODE_128', 14, 'SN-NOI-2026-014', 'BATCH-2026-D2'),
('8901234000179', 'CODE_128', 17, 'SN-HAV-2026-017', 'BATCH-2026-E1'),
('8901234000216', 'CODE_128', 21, 'SN-PRE-2026-021', 'BATCH-2026-F1'),
('8901234000254', 'CODE_128', 25, 'SN-BDY-2026-025', 'BATCH-2026-G1'),
('8901234000292', 'CODE_128', 29, 'SN-SKY-2026-029', 'BATCH-2026-H1');

-- 13. CUSTOMERS
INSERT INTO customers (id, customer_code, name, email, phone, shipping_address, city, state, postal_code) VALUES
(1, 'CUST_MUM_001', 'Rajesh Kumar', 'rajesh.kumar@gmail.com', '+91 9819012345', 'Flat 402, Sea Green Apts, Worli Sea Face', 'Mumbai', 'Maharashtra', '400018'),
(2, 'CUST_BLR_002', 'Priya Sharma', 'priya.sharma@yahoo.com', '+91 9845023456', 'Villa 12, Palm Meadows, Whitefield', 'Bengaluru', 'Karnataka', '560066'),
(3, 'CUST_DEL_003', 'Vikram Malhotra', 'vikram.m@outlook.com', '+91 9811034567', 'D-14 Green Park Main', 'New Delhi', 'Delhi', '110016'),
(4, 'CUST_HYD_004', 'Sneha Reddy', 'sneha.reddy@gmail.com', '+91 9849045678', 'Plot 88, Jubilee Hills Road 36', 'Hyderabad', 'Telangana', '500033'),
(5, 'CUST_CHN_005', 'Karthik Subramanian', 'karthik.s@gmail.com', '+91 9840056789', '24 Karpagam Avenue, R.A. Puram', 'Chennai', 'Tamil Nadu', '600028');

-- 14. PURCHASE_ORDERS & ITEMS
INSERT INTO purchase_orders (id, po_number, supplier_id, warehouse_id, status, total_amount, expected_delivery_date, notes, created_by, approved_by) VALUES
(1, 'PO-2026-0001', 1, 1, 'RECEIVED', 212500.00, '2026-10-15', 'Bulk seasonal procurement of formal linen shirts and trousers', 6, 2),
(2, 'PO-2026-0002', 3, 1, 'PARTIALLY_RECEIVED', 194000.00, '2026-11-05', 'Pre-winter festive air purifier and water heater shipment', 6, 2),
(3, 'PO-2026-0003', 4, 2, 'APPROVED', 137500.00, '2026-11-12', 'Restocking fast-moving Titan leather accessories for southern distribution', 6, 2),
(4, 'PO-2026-0004', 2, 3, 'SUBMITTED', 85000.00, '2026-11-20', 'Kitchen appliances initial trial batch for northern logistics center', 6, NULL),
(5, 'PO-2026-0005', 5, 1, 'DRAFT', 55000.00, '2026-11-25', 'Bedding and satin bedsheet replacement quotation', 6, NULL);

INSERT INTO purchase_order_items (id, purchase_order_id, product_id, ordered_quantity, received_quantity, unit_cost, total_cost) VALUES
(1, 1, 1, 100, 100, 1250.00, 125000.00),
(2, 1, 2, 70, 70, 950.00, 66500.00),
(3, 1, 4, 13, 13, 1600.00, 20800.00),
(4, 2, 17, 30, 20, 4800.00, 144000.00), -- 20 received out of 30
(5, 2, 19, 34, 15, 1450.00, 49300.00),  -- 15 received out of 34
(6, 3, 31, 250, 0, 550.00, 137500.00),
(7, 4, 18, 45, 0, 1850.00, 83250.00),
(8, 5, 25, 50, 0, 1100.00, 55000.00);

-- 15. CUSTOMER_ORDERS & ITEMS
INSERT INTO customer_orders (id, order_number, customer_id, store_id, warehouse_id, status, total_amount, shipping_tracking_number, shipping_carrier, notes, created_by) VALUES
(1, 'ORD-2026-1001', 1, NULL, 1, 'DELIVERED', 8997.00, 'BD-MUM-991204', 'BlueDart Express', 'Customer requested weekend morning delivery', 7),
(2, 'ORD-2026-1002', 2, 2, NULL, 'SHIPPED', 5498.00, 'DTDC-BLR-44102', 'DTDC Prime', 'In-store online order pickup from Indiranagar store', 7),
(3, 'ORD-2026-1003', 3, NULL, 3, 'PROCESSING', 9499.00, 'DELHIV-NCR-771', 'Delhivery Express', 'Air purifier urgent priority shipment', 7),
(4, 'ORD-2026-1004', 4, 5, NULL, 'CONFIRMED', 3999.00, NULL, NULL, 'Skybags cabin trolley order from Banjara Hills', 7),
(5, 'ORD-2026-1005', 5, NULL, 1, 'PENDING', 4998.00, NULL, NULL, 'New web order waiting for payment authorization and stock reservation', 7),
(6, 'ORD-2026-1006', 1, NULL, 1, 'RETURN_REQUESTED', 3199.00, 'BD-MUM-882190', 'BlueDart Express', 'Customer requested size replacement for Oxford formal shoes', 7);

INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, total_price, is_reserved) VALUES
(1, 1, 1, 1, 2499.00, 2499.00, FALSE),
(2, 1, 5, 1, 5999.00, 5999.00, FALSE),
(3, 1, 31, 1, 1395.00, 1395.00, FALSE),
(4, 2, 13, 1, 1999.00, 1999.00, TRUE),
(5, 2, 14, 1, 3499.00, 3499.00, TRUE),
(6, 3, 17, 1, 9499.00, 9499.00, TRUE),
(7, 4, 29, 1, 3999.00, 3999.00, TRUE),
(8, 5, 1, 2, 2499.00, 4998.00, TRUE),
(9, 6, 10, 1, 3199.00, 3199.00, FALSE);

-- 16. ORDER_STATUS_HISTORY
INSERT INTO order_status_history (order_id, from_status, to_status, comments, changed_by) VALUES
(1, 'PENDING', 'CONFIRMED', 'Payment verified successfully via Razorpay gateway', 7),
(1, 'CONFIRMED', 'PROCESSING', 'Order routed to Mumbai Central Warehouse for picking', 3),
(1, 'PROCESSING', 'PICKED', 'Items picked from aisle A-12 and rack B-04', 5),
(1, 'PICKED', 'PACKED', 'Packed securely in branded corrugated box with seal', 5),
(1, 'PACKED', 'SHIPPED', 'Handed over to BlueDart courier airway bill BD-MUM-991204', 3),
(1, 'SHIPPED', 'DELIVERED', 'Delivered safely and OTP confirmed by customer', 3),
(2, 'PENDING', 'CONFIRMED', 'Confirmed for store counter collection', 4),
(2, 'CONFIRMED', 'PROCESSING', 'Reserved from store inventory', 4),
(2, 'PROCESSING', 'SHIPPED', 'Dispatched with local DTDC express courier', 4),
(6, 'DELIVERED', 'RETURN_REQUESTED', 'Size issue - customer requested size 9 instead of size 8', 7);

-- 17. STOCK_TRANSFERS & ITEMS
INSERT INTO stock_transfers (id, transfer_number, source_type, source_warehouse_id, source_store_id, dest_type, dest_warehouse_id, dest_store_id, status, tracking_notes, created_by, approved_by) VALUES
(1, 'TRF-2026-0001', 'WAREHOUSE', 1, NULL, 'STORE', NULL, 1, 'COMPLETED', 'Replenishment for Phoenix Marketcity Store Mumbai for weekend festival sale', 3, 3),
(2, 'TRF-2026-0002', 'WAREHOUSE', 2, NULL, 'STORE', NULL, 2, 'IN_TRANSIT', 'Dispatched via dedicated logistics van KA-04-E-4501 to Indiranagar Store', 3, 3),
(3, 'TRF-2026-0003', 'WAREHOUSE', 1, NULL, 'WAREHOUSE', 2, NULL, 'APPROVED', 'Inter-warehouse balancing from Mumbai Hub to Bengaluru Logistics Center', 3, 2);

INSERT INTO stock_transfer_items (id, transfer_id, product_id, quantity, received_quantity) VALUES
(1, 1, 1, 20, 20),
(2, 1, 2, 15, 15),
(3, 1, 13, 25, 25),
(4, 2, 14, 15, 0),
(5, 2, 30, 20, 0),
(6, 3, 5, 20, 0),
(7, 3, 17, 10, 0);

-- 18. STOCK_TRANSACTIONS (Ledger)
INSERT INTO stock_transactions (product_id, location_type, warehouse_id, store_id, transaction_type, quantity_change, quantity_after, reference_id, notes, created_by) VALUES
(1, 'WAREHOUSE', 1, NULL, 'STOCK_IN', 100, 150, 'PO-2026-0001', 'Received initial Raymond bulk PO shipment', 5),
(2, 'WAREHOUSE', 1, NULL, 'STOCK_IN', 70, 120, 'PO-2026-0001', 'Received Park Avenue formal trousers shipment', 5),
(1, 'WAREHOUSE', 1, NULL, 'TRANSFER_OUT', -20, 130, 'TRF-2026-0001', 'Dispatched replenishment to Store STR_MUM_PHX', 5),
(1, 'STORE', NULL, 1, 'TRANSFER_IN', 20, 24, 'TRF-2026-0001', 'Received replenishment at Phoenix Marketcity', 4),
(1, 'WAREHOUSE', 1, NULL, 'FULFILLMENT_OUT', -1, 149, 'ORD-2026-1001', 'Shipped order ORD-2026-1001 to customer Rajesh Kumar', 3),
(13, 'WAREHOUSE', 1, NULL, 'STOCK_IN', 50, 180, 'PO-RECEIVE', 'Manual stock entry batch for BoAt Rockerz 550', 5),
(17, 'WAREHOUSE', 1, NULL, 'STOCK_IN', 20, 28, 'PO-2026-0002', 'Partial delivery of 20 Havells Air Purifiers received', 5);

-- 19. RETURNS & RETURN_ITEMS
INSERT INTO returns (id, return_number, order_id, reason, status, refund_amount, restock_warehouse_id, restock_store_id, created_by) VALUES
(1, 'RET-2026-0001', 6, 'Customer reported wrong fit/size for formal shoes', 'PENDING', 3199.00, 1, NULL, 7);

INSERT INTO return_items (id, return_id, product_id, quantity, condition, is_restocked) VALUES
(1, 1, 10, 1, 'RESTOCKABLE', FALSE);

-- 20. RFID_SCAN_LOGS
INSERT INTO rfid_scan_logs (epc_tag, reader_id, location_type, warehouse_id, store_id, product_id, action_type, rssi_signal) VALUES
('EPC-96-3001-A01-00000001', 'RDR-MUM-DOCK-1', 'WAREHOUSE', 1, NULL, 1, 'GATE_CHECK_IN', -42.50),
('EPC-96-3001-A02-00000002', 'RDR-MUM-DOCK-1', 'WAREHOUSE', 1, NULL, 2, 'GATE_CHECK_IN', -43.10),
('EPC-96-3001-B05-00000005', 'RDR-BLR-AISLE-3', 'WAREHOUSE', 2, NULL, 13, 'INVENTORY_VERIFICATION', -38.20),
('EPC-96-3001-C09-00000009', 'RDR-STR-MUM-GATE', 'STORE', NULL, 1, 9, 'INVENTORY_VERIFICATION', -48.70),
('EPC-96-3001-D14-00000014', 'RDR-BLR-DOCK-2', 'WAREHOUSE', 2, NULL, 14, 'GATE_CHECK_OUT', -41.00);

-- 21. NOTIFICATIONS
INSERT INTO notifications (recipient_user_id, title, message, type, is_read, reference_link) VALUES
(1, 'Low Stock Alert: Eureka Forbes Smart Robot Vacuum', 'Current stock at Bengaluru Warehouse (2) is 8 units, which is at or below the safety threshold (10).', 'LOW_STOCK', FALSE, '/inventory'),
(1, 'Purchase Order Delivered: PO-2026-0001', 'Purchase order PO-2026-0001 from Raymond Apparel Mills has been fully received into Mumbai Central Hub.', 'PO_RECEIVED', FALSE, '/purchase-orders'),
(3, 'Low Stock Alert: Borosil Opalware Dinner Set', 'Current stock at Delhi NCR Fulfillment Center is 12 units, below the reorder point of 16.', 'LOW_STOCK', FALSE, '/inventory'),
(4, 'Low Stock Alert: Woodland Leather Trek Shoes', 'Current store stock at Phoenix Marketcity Store is 8 pairs (reorder point 10).', 'LOW_STOCK', TRUE, '/inventory'),
(2, 'System Integration Health Check Passed', 'ERP synchronization with SAP S/4HANA completed with 100% data fidelity.', 'SYSTEM', TRUE, '/integrations');

-- 22. AUDIT_LOGS
INSERT INTO audit_logs (user_id, username, action, entity_name, entity_id, details, ip_address) VALUES
(1, 'superadmin', 'LOGIN', 'USER', '1', 'Successful multi-factor console login from administrator terminal', '192.168.1.100'),
(6, 'proc_manager', 'CREATE', 'PURCHASE_ORDER', '1', 'Created PO-2026-0001 for Raymond Apparel Mills Ltd', '192.168.1.105'),
(2, 'admin', 'UPDATE', 'PURCHASE_ORDER', '1', 'Approved purchase order PO-2026-0001', '192.168.1.102'),
(5, 'inv_staff', 'STOCK_ADJUST', 'INVENTORY', '1', 'Stock-in 100 units against PO-2026-0001 at Mumbai Hub', '192.168.1.110'),
(7, 'sales_staff', 'CREATE', 'CUSTOMER_ORDER', '1', 'Created sales order ORD-2026-1001 for customer Rajesh Kumar', '192.168.1.115'),
(3, 'wh_manager', 'UPDATE', 'CUSTOMER_ORDER', '1', 'Updated order ORD-2026-1001 status to SHIPPED via BlueDart', '192.168.1.108');

-- 23. INTEGRATION_CONFIGS
INSERT INTO integration_configs (id, system_name, system_type, api_endpoint, auth_type, api_key, is_enabled, sync_frequency_minutes, last_sync_at, status) VALUES
(1, 'SAP_S4HANA_ERP', 'ERP', 'https://mock-erp.xyzretail.com/api/v2/inventory-sync', 'BEARER_TOKEN', 'rims_erp_live_key_99218734912', TRUE, 30, CURRENT_TIMESTAMP, 'HEALTHY'),
(2, 'TALLY_PRIME_ACCOUNTING', 'ACCOUNTING', 'https://mock-tally.xyzretail.com/api/v1/ledger-export', 'API_KEY', 'tally_sec_token_552199042', TRUE, 60, CURRENT_TIMESTAMP, 'HEALTHY'),
(3, 'BLUEDART_LOGISTICS_API', 'LOGISTICS', 'https://mock-logistics.bluedart.com/api/v1/shipment/track', 'BASIC', 'bluedart_corp_api_auth_881', TRUE, 15, CURRENT_TIMESTAMP, 'HEALTHY');

-- 24. INTEGRATION_LOGS
INSERT INTO integration_logs (config_id, direction, entity_type, payload, response_code, response_body, status, retry_count, error_message) VALUES
(1, 'OUTBOUND', 'INVENTORY', '{"action":"SYNC_LEDGER","recordsCount":32,"timestamp":"2026-10-31T12:00:00Z"}', 200, '{"status":"SUCCESS","syncedItems":32,"batchId":"SAP-BATCH-9941"}', 'SUCCESS', 0, NULL),
(2, 'OUTBOUND', 'INVOICE', '{"action":"POST_JOURNAL_VOUCHERS","poCount":1,"orderCount":1}', 200, '{"status":"POSTED","tallyVoucherNumber":"TV-2026-1092"}', 'SUCCESS', 0, NULL),
(3, 'INBOUND', 'SHIPMENT', '{"trackingNumber":"BD-MUM-991204","carrier":"BlueDart"}', 200, '{"status":"DELIVERED","deliveryTime":"2026-10-30T16:45:00Z","recipientSignature":"Rajesh K."}', 'SUCCESS', 0, NULL);

