export interface Product {
  id: number;
  name: string;
  sku: string;
  barcode: string;
  description: string;
  categoryId: number;
  categoryName: string;
  categoryCode: string;
  brand: string;
  purchasePrice: number;
  sellingPrice: number;
  minStockLevel: number;
  reorderPoint: number;
  imageUrl: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';
  totalStock?: number;
  totalReserved?: number;
  availableStock?: number;
}

export interface Category {
  id: number;
  name: string;
  code: string;
  description: string;
  parentId?: number | null;
  isActive: boolean;
}

export interface Warehouse {
  id: number;
  code: string;
  name: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  contactPhone: string;
  contactEmail: string;
  capacity: number;
  isActive: boolean;
}

export interface Store {
  id: number;
  code: string;
  name: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  contactPhone: string;
  contactEmail: string;
  assignedWarehouseId: number;
  assignedWarehouseName: string;
  isActive: boolean;
}

export interface InventoryItem {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  productBarcode: string;
  categoryName: string;
  purchasePrice: number;
  sellingPrice: number;
  locationType: 'WAREHOUSE' | 'STORE';
  warehouseId?: number;
  warehouseName?: string;
  storeId?: number;
  storeName?: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  reorderPoint: number;
  safetyStock: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
  valuation: number;
  lastAuditAt?: string;
  updatedAt?: string;
}

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: "Men's Apparel", code: "CAT_MEN_APP", description: "Formal shirts, trousers, ethnic kurtas, casual tees and denims", isActive: true },
  { id: 2, name: "Women's Apparel", code: "CAT_WOMEN_APP", description: "Ethnic sarees, salwar suits, western tops, dresses, and bottom wear", isActive: true },
  { id: 3, name: "Footwear & Shoes", code: "CAT_FOOTWEAR", description: "Formal leather shoes, casual sneakers, sports running shoes and sandals", isActive: true },
  { id: 4, name: "Consumer Electronics", code: "CAT_ELEC_CONSUMER", description: "Smartphones, noise-canceling headphones, smart watches, soundbars", isActive: true },
  { id: 5, name: "Smart Home Appliances", code: "CAT_HOME_APP", description: "Air purifiers, robotic vacuum cleaners, microwave ovens, blenders", isActive: true },
  { id: 6, name: "Kitchen & Dining", code: "CAT_KITCHEN", description: "Stainless steel cookware sets, dinnerware, non-stick pans and cutlery", isActive: true },
  { id: 7, name: "Bedding & Furnishing", code: "CAT_BEDDING", description: "Cotton bedsheets, memory foam pillows, blackout curtains, duvets", isActive: true },
  { id: 8, name: "Luggage & Accessories", code: "CAT_ACCESSORIES", description: "Hard-shell trolley bags, leather wallets, backpacks, travel duffels", isActive: true },
];

export const MOCK_WAREHOUSES: Warehouse[] = [
  { id: 1, code: "WH_MUM_01", name: "Mumbai Central Distribution Hub", addressLine: "Plot 42, MIDC Industrial Area, Bhiwandi", city: "Mumbai", state: "Maharashtra", postalCode: "421302", contactPhone: "+91 22 2845 9001", contactEmail: "bhiwandi.hub@xyzretail.com", capacity: 250000, isActive: true },
  { id: 2, code: "WH_BLR_01", name: "Bengaluru Southern Logistics Center", addressLine: "Gate 3, Hoskote Industrial Corridor", city: "Bengaluru", state: "Karnataka", postalCode: "562114", contactPhone: "+91 80 4120 7800", contactEmail: "hoskote.wh@xyzretail.com", capacity: 200000, isActive: true },
  { id: 3, code: "WH_DEL_01", name: "Delhi NCR Northern Fulfillment Center", addressLine: "Sector 88, Bilaspur Logistics Park", city: "Gurugram", state: "Haryana", postalCode: "122413", contactPhone: "+91 124 490 8200", contactEmail: "gurugram.wh@xyzretail.com", capacity: 220000, isActive: true },
];

export const MOCK_STORES: Store[] = [
  { id: 1, code: "STR_MUM_PHX", name: "Phoenix Marketcity Store", addressLine: "G-14 Lower Ground, LBS Marg, Kurla West", city: "Mumbai", state: "Maharashtra", postalCode: "400070", contactPhone: "+91 22 6180 1200", contactEmail: "store.kurla@xyzretail.com", assignedWarehouseId: 1, assignedWarehouseName: "Mumbai Central Distribution Hub", isActive: true },
  { id: 2, code: "STR_BLR_IND", name: "Indiranagar Flagship Store", addressLine: "542 100 Feet Road, HAL 2nd Stage", city: "Bengaluru", state: "Karnataka", postalCode: "560038", contactPhone: "+91 80 2521 8800", contactEmail: "store.indiranagar@xyzretail.com", assignedWarehouseId: 2, assignedWarehouseName: "Bengaluru Southern Logistics Center", isActive: true },
  { id: 3, code: "STR_DEL_CP", name: "Connaught Place Retail Hub", addressLine: "Block B, Inner Circle, Connaught Place", city: "New Delhi", state: "Delhi", postalCode: "110001", contactPhone: "+91 11 4350 9900", contactEmail: "store.cp@xyzretail.com", assignedWarehouseId: 3, assignedWarehouseName: "Delhi NCR Northern Fulfillment Center", isActive: true },
  { id: 4, code: "STR_CHN_EA", name: "Express Avenue Mall Store", addressLine: "Shop 208, 2nd Floor, Royapettah", city: "Chennai", state: "Tamil Nadu", postalCode: "600014", contactPhone: "+91 44 2846 4400", contactEmail: "store.chennai@xyzretail.com", assignedWarehouseId: 2, assignedWarehouseName: "Bengaluru Southern Logistics Center", isActive: true },
  { id: 5, code: "STR_HYD_BH", name: "Banjara Hills Luxury Outlet", addressLine: "Road No. 2, Opp. Park Hyatt", city: "Hyderabad", state: "Telangana", postalCode: "500034", contactPhone: "+91 40 6678 3300", contactEmail: "store.hyderabad@xyzretail.com", assignedWarehouseId: 2, assignedWarehouseName: "Bengaluru Southern Logistics Center", isActive: true },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: "Raymond Pure Linen Slim Fit Shirt - White", sku: "MEN-SHIRT-LIN-001", barcode: "8901234000018", description: "Premium breathable French flax linen shirt with spread collar", categoryId: 1, categoryName: "Men's Apparel", categoryCode: "CAT_MEN_APP", brand: "Raymond", purchasePrice: 1250, sellingPrice: 2499, minStockLevel: 15, reorderPoint: 30, imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400", status: "ACTIVE", totalStock: 174, totalReserved: 15, availableStock: 159 },
  { id: 2, name: "Park Avenue Formal Poly-Viscose Trousers - Charcoal", sku: "MEN-TROU-CHR-002", barcode: "8901234000025", description: "Flat front tailored fit formal trousers with flexi-waistband", categoryId: 1, categoryName: "Men's Apparel", categoryCode: "CAT_MEN_APP", brand: "Park Avenue", purchasePrice: 950, sellingPrice: 1999, minStockLevel: 20, reorderPoint: 40, imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400", status: "ACTIVE", totalStock: 138, totalReserved: 10, availableStock: 128 },
  { id: 3, name: "Manyavar Embroidered Silk Jacquard Kurta - Navy", sku: "MEN-KURT-JAC-003", barcode: "8901234000032", description: "Traditional festive mandarin collar kurta with intricate zardozi threadwork", categoryId: 1, categoryName: "Men's Apparel", categoryCode: "CAT_MEN_APP", brand: "Manyavar", purchasePrice: 1800, sellingPrice: 3999, minStockLevel: 10, reorderPoint: 25, imageUrl: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=400", status: "ACTIVE", totalStock: 51, totalReserved: 5, availableStock: 46 },
  { id: 4, name: "Wrangler Rugged Heavyweight Denim Jacket - Classic Indigo", sku: "MEN-JACK-DEN-004", barcode: "8901234000049", description: "100% cotton stone washed denim jacket with dual chest flap pockets", categoryId: 1, categoryName: "Men's Apparel", categoryCode: "CAT_MEN_APP", brand: "Wrangler", purchasePrice: 1600, sellingPrice: 3499, minStockLevel: 12, reorderPoint: 25, imageUrl: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400", status: "ACTIVE", totalStock: 71, totalReserved: 0, availableStock: 71 },
  { id: 5, name: "Fabindia Handblock Chanderi Silk Saree - Ruby Red", sku: "WOM-SARE-CHA-005", barcode: "8901234000056", description: "Artisanal handwoven lightweight chanderi silk saree with zari border", categoryId: 2, categoryName: "Women's Apparel", categoryCode: "CAT_WOMEN_APP", brand: "Fabindia", purchasePrice: 2800, sellingPrice: 5999, minStockLevel: 8, reorderPoint: 20, imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400", status: "ACTIVE", totalStock: 42, totalReserved: 4, availableStock: 38 },
  { id: 6, name: "Biba A-Line Festive Anarkali Suit Set - Mustard", sku: "WOM-SUIT-ANR-006", barcode: "8901234000063", description: "Pure cotton 3-piece festive anarkali kurta with churidar and printed chiffon dupatta", categoryId: 2, categoryName: "Women's Apparel", categoryCode: "CAT_WOMEN_APP", brand: "Biba", purchasePrice: 1900, sellingPrice: 4299, minStockLevel: 15, reorderPoint: 30, imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400", status: "ACTIVE", totalStock: 94, totalReserved: 5, availableStock: 89 },
  { id: 7, name: "AND Georgette Floral Print Pleated Midi Dress - Emerald", sku: "WOM-DRES-GEO-007", barcode: "8901234000070", description: "Contemporary evening midi dress with v-neck and belt accentuation", categoryId: 2, categoryName: "Women's Apparel", categoryCode: "CAT_WOMEN_APP", brand: "AND", purchasePrice: 1100, sellingPrice: 2799, minStockLevel: 12, reorderPoint: 25, imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400", status: "ACTIVE", totalStock: 59, totalReserved: 2, availableStock: 57 },
  { id: 8, name: "W for Woman Gold Print Rayon Flared Palazzos", sku: "WOM-PLZO-RAY-008", barcode: "8901234000087", description: "Flowy rayon palazzos with elasticated back and geometric foil motifs", categoryId: 2, categoryName: "Women's Apparel", categoryCode: "CAT_WOMEN_APP", brand: "W for Woman", purchasePrice: 650, sellingPrice: 1499, minStockLevel: 20, reorderPoint: 45, imageUrl: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=400", status: "ACTIVE", totalStock: 108, totalReserved: 8, availableStock: 100 },
  { id: 9, name: "Woodland Heavy-Duty Oiled Nubuck Trek Shoes", sku: "SHO-BOOT-NUB-009", barcode: "8901234000094", description: "All-weather genuine nubuck leather high ankle boots with rugged traction sole", categoryId: 3, categoryName: "Footwear & Shoes", categoryCode: "CAT_FOOTWEAR", brand: "Woodland", purchasePrice: 2400, sellingPrice: 4995, minStockLevel: 10, reorderPoint: 20, imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", status: "ACTIVE", totalStock: 48, totalReserved: 2, availableStock: 46 },
  { id: 10, name: "Red Tape Dual-Tone Oxford Dress Shoes - Tan", sku: "SHO-FORM-OXF-010", barcode: "8901234000100", description: "Handcrafted Argentine leather formal oxfords with cushioned Ortholite insole", categoryId: 3, categoryName: "Footwear & Shoes", categoryCode: "CAT_FOOTWEAR", brand: "Red Tape", purchasePrice: 1400, sellingPrice: 3199, minStockLevel: 15, reorderPoint: 30, imageUrl: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400", status: "ACTIVE", totalStock: 79, totalReserved: 5, availableStock: 74 },
  { id: 11, name: "Puma Nitro Pro Velocity Running Sneakers", sku: "SHO-SNEK-RUN-011", barcode: "8901234000117", description: "Ultralight responsive nitrogen-injected foam athletic road running trainers", categoryId: 3, categoryName: "Footwear & Shoes", categoryCode: "CAT_FOOTWEAR", brand: "Puma", purchasePrice: 2800, sellingPrice: 5999, minStockLevel: 15, reorderPoint: 35, imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400", status: "ACTIVE", totalStock: 95, totalReserved: 10, availableStock: 85 },
  { id: 12, name: "Bata Comfit Ergonomic Leather Slip-On Sandals", sku: "SHO-SAND-SLP-012", barcode: "8901234000124", description: "Everyday casual arch support leather strap slippers with slip-resistant PU base", categoryId: 3, categoryName: "Footwear & Shoes", categoryCode: "CAT_FOOTWEAR", brand: "Bata", purchasePrice: 550, sellingPrice: 1299, minStockLevel: 25, reorderPoint: 50, imageUrl: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=400", status: "ACTIVE", totalStock: 132, totalReserved: 0, availableStock: 132 },
  { id: 13, name: "boAt Rockerz 550 Wireless Headphones - Army Green", sku: "ELE-HEAD-WIR-013", barcode: "8901234000131", description: "50mm dynamic drivers, 20 hours playback, physical noise isolation cushions", categoryId: 4, categoryName: "Consumer Electronics", categoryCode: "CAT_ELEC_CONSUMER", brand: "boAt", purchasePrice: 850, sellingPrice: 1999, minStockLevel: 25, reorderPoint: 60, imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", status: "ACTIVE", totalStock: 215, totalReserved: 20, availableStock: 195 },
  { id: 14, name: "Noise ColorFit Pro 5 AMOLED Smartwatch", sku: "ELE-WATC-AML-014", barcode: "8901234000148", description: "1.85 inch high-definition AMOLED display, BT calling, SpO2 & 100+ sports modes", categoryId: 4, categoryName: "Consumer Electronics", categoryCode: "CAT_ELEC_CONSUMER", brand: "Noise", purchasePrice: 1500, sellingPrice: 3499, minStockLevel: 20, reorderPoint: 50, imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", status: "ACTIVE", totalStock: 162, totalReserved: 12, availableStock: 150 },
  { id: 15, name: "Portronics SoundDrum P 20W Bluetooth Speaker", sku: "ELE-SPKR-BLU-015", barcode: "8901234000155", description: "Dual bass passive radiators, IPX6 water resistance, Type-C quick charging", categoryId: 4, categoryName: "Consumer Electronics", categoryCode: "CAT_ELEC_CONSUMER", brand: "Portronics", purchasePrice: 900, sellingPrice: 2199, minStockLevel: 15, reorderPoint: 35, imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400", status: "ACTIVE", totalStock: 100, totalReserved: 0, availableStock: 100 },
  { id: 16, name: "Zebronics 100W Dolby Cinema Soundbar Subwoofer", sku: "ELE-BARS-DOL-016", barcode: "8901234000162", description: "2.1 channel audio system with dedicated wireless subwoofer and HDMI ARC", categoryId: 4, categoryName: "Consumer Electronics", categoryCode: "CAT_ELEC_CONSUMER", brand: "Zebronics", purchasePrice: 2700, sellingPrice: 5999, minStockLevel: 8, reorderPoint: 18, imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400", status: "ACTIVE", totalStock: 40, totalReserved: 2, availableStock: 38 },
  { id: 17, name: "Havells Air Pure CleanShield HEPA 13 Purifier", sku: "HOM-PURF-HEP-017", barcode: "8901234000179", description: "True HEPA 13 filtration removing 99.97% allergens, PM 2.5 real-time indicator", categoryId: 5, categoryName: "Smart Home Appliances", categoryCode: "CAT_HOME_APP", brand: "Havells", purchasePrice: 4800, sellingPrice: 9499, minStockLevel: 6, reorderPoint: 15, imageUrl: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400", status: "ACTIVE", totalStock: 32, totalReserved: 2, availableStock: 30 },
  { id: 18, name: "Philips Daily Collection 750W 4-Jar Mixer Grinder", sku: "HOM-MIXG-750-018", barcode: "8901234000186", description: "Tough Torque motor, stainless steel leak-proof jars with specialized chutneymatic blade", categoryId: 5, categoryName: "Smart Home Appliances", categoryCode: "CAT_HOME_APP", brand: "Philips", purchasePrice: 1850, sellingPrice: 3695, minStockLevel: 15, reorderPoint: 30, imageUrl: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400", status: "ACTIVE", totalStock: 65, totalReserved: 0, availableStock: 65 },
  { id: 19, name: "Bajaj Flora Instant 3-Litre 3kW Water Heater Geyser", sku: "HOM-GEYS-3LT-019", barcode: "8901234000193", description: "High-pressure resistance engineered for multi-story apartments, thermoplastic outer body", categoryId: 5, categoryName: "Smart Home Appliances", categoryCode: "CAT_HOME_APP", brand: "Bajaj", purchasePrice: 1450, sellingPrice: 2999, minStockLevel: 10, reorderPoint: 20, imageUrl: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=400", status: "ACTIVE", totalStock: 42, totalReserved: 0, availableStock: 42 },
  { id: 20, name: "Eureka Forbes Smart Robot Vacuum LiDAR Mop", sku: "HOM-ROBO-VAC-020", barcode: "8901234000209", description: "4000Pa intense suction, 3D obstacle avoidance, automatic carpet boost detection", categoryId: 5, categoryName: "Smart Home Appliances", categoryCode: "CAT_HOME_APP", brand: "Eureka Forbes", purchasePrice: 11500, sellingPrice: 21990, minStockLevel: 4, reorderPoint: 10, imageUrl: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400", status: "ACTIVE", totalStock: 20, totalReserved: 1, availableStock: 19 },
  { id: 21, name: "Prestige Tri-Ply Stainless Steel 3-Piece Cookware", sku: "KIT-COOK-TRP-021", barcode: "8901234000216", description: "Even heat induction base kadai with glass lid, fry pan and saucepan", categoryId: 6, categoryName: "Kitchen & Dining", categoryCode: "CAT_KITCHEN", brand: "Prestige", purchasePrice: 1800, sellingPrice: 3750, minStockLevel: 15, reorderPoint: 30, imageUrl: "https://images.unsplash.com/photo-1584990347449-3a3f5f69c766?w=400", status: "ACTIVE", totalStock: 84, totalReserved: 5, availableStock: 79 },
  { id: 22, name: "Borosil Prime 42-Piece Opalware Dinner Set", sku: "KIT-DINN-OPL-022", barcode: "8901234000223", description: "Bone-ash free scratch-resistant microwave and dishwasher safe luxury dinnerware", categoryId: 6, categoryName: "Kitchen & Dining", categoryCode: "CAT_KITCHEN", brand: "Borosil", purchasePrice: 2100, sellingPrice: 4490, minStockLevel: 8, reorderPoint: 16, imageUrl: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=400", status: "ACTIVE", totalStock: 43, totalReserved: 0, availableStock: 43 },
  { id: 23, name: "Milton Pro Cook Granite 28cm Non-Stick Dosa Tawa", sku: "KIT-TAWA-NON-023", barcode: "8901234000230", description: "5-layer food-grade durable granite coating with heat-resistant soft bakelite handle", categoryId: 6, categoryName: "Kitchen & Dining", categoryCode: "CAT_KITCHEN", brand: "Milton", purchasePrice: 520, sellingPrice: 1150, minStockLevel: 20, reorderPoint: 40, imageUrl: "https://images.unsplash.com/photo-1584990347449-3a3f5f69c766?w=400", status: "ACTIVE", totalStock: 107, totalReserved: 4, availableStock: 103 },
  { id: 24, name: "Cello Dura-Steel 1000ml Vacuum Insulated Flask", sku: "KIT-FLSK-VAC-024", barcode: "8901234000247", description: "Keeps liquids hot or chilled for 24 hours with copper coating technology", categoryId: 6, categoryName: "Kitchen & Dining", categoryCode: "CAT_KITCHEN", brand: "Cello", purchasePrice: 420, sellingPrice: 899, minStockLevel: 30, reorderPoint: 60, imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400", status: "ACTIVE", totalStock: 150, totalReserved: 0, availableStock: 150 },
  { id: 25, name: "Bombay Dyeing 300 TC Satin Weave King Bedsheet", sku: "BED-SHT-SAT-025", barcode: "8901234000254", description: "100% combed Egyptian long staple cotton silky soft satin bed linen", categoryId: 7, categoryName: "Bedding & Furnishing", categoryCode: "CAT_BEDDING", brand: "Bombay Dyeing", purchasePrice: 1100, sellingPrice: 2499, minStockLevel: 15, reorderPoint: 30, imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400", status: "ACTIVE", totalStock: 70, totalReserved: 5, availableStock: 65 },
  { id: 26, name: "Sleepwell Cocoon Orthopedic Memory Foam Pillow", sku: "BED-PILW-MEM-026", barcode: "8901234000261", description: "Therapeutic slow recovery memory foam with bamboo fabric washable zippered cover", categoryId: 7, categoryName: "Bedding & Furnishing", categoryCode: "CAT_BEDDING", brand: "Sleepwell", purchasePrice: 850, sellingPrice: 1899, minStockLevel: 12, reorderPoint: 25, imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400", status: "ACTIVE", totalStock: 50, totalReserved: 0, availableStock: 50 },
  { id: 27, name: "D'Decor Luxury Thermal Blackout Curtains (Set of 2)", sku: "BED-CURT-BLK-027", barcode: "8901234000278", description: "99% UV and sunlight blocking heavy weave 7-feet door curtains", categoryId: 7, categoryName: "Bedding & Furnishing", categoryCode: "CAT_BEDDING", brand: "D'Decor", purchasePrice: 1300, sellingPrice: 2999, minStockLevel: 10, reorderPoint: 20, imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400", status: "ACTIVE", totalStock: 48, totalReserved: 2, availableStock: 46 },
  { id: 28, name: "Trident Microfiber All-Season Reversible AC Comforter", sku: "BED-COMF-MIC-028", barcode: "8901234000285", description: "Hypoallergenic 250 GSM siliconized fiber quilted soft down-alternative duvet", categoryId: 7, categoryName: "Bedding & Furnishing", categoryCode: "CAT_BEDDING", brand: "Trident", purchasePrice: 950, sellingPrice: 2199, minStockLevel: 10, reorderPoint: 25, imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400", status: "ACTIVE", totalStock: 45, totalReserved: 0, availableStock: 45 },
  { id: 29, name: "Skybags Trooper 55cm Cabin Hard-Shell Trolley", sku: "LUG-TROL-CAB-029", barcode: "8901234000292", description: "Ultra-durable scratch resistant polycarbonate shell with 360-degree silent spinner wheels", categoryId: 8, categoryName: "Luggage & Accessories", categoryCode: "CAT_ACCESSORIES", brand: "Skybags", purchasePrice: 1650, sellingPrice: 3999, minStockLevel: 10, reorderPoint: 20, imageUrl: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=400", status: "ACTIVE", totalStock: 47, totalReserved: 3, availableStock: 44 },
  { id: 30, name: "American Tourister 32L Casual Laptop Backpack", sku: "LUG-BACK-LAP-030", barcode: "8901234000308", description: "Ergonomic air-mesh padded back, dedicated 15.6 inch padded laptop sleeve", categoryId: 8, categoryName: "Luggage & Accessories", categoryCode: "CAT_ACCESSORIES", brand: "American Tourister", purchasePrice: 850, sellingPrice: 1999, minStockLevel: 20, reorderPoint: 40, imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400", status: "ACTIVE", totalStock: 113, totalReserved: 8, availableStock: 105 },
  { id: 31, name: "Titan Classic Hunter Genuine Leather Bi-Fold Wallet", sku: "ACC-WALT-LTH-031", barcode: "8901234000315", description: "RFID-blocking top grain hunter cowhide leather wallet with 8 card slots", categoryId: 8, categoryName: "Luggage & Accessories", categoryCode: "CAT_ACCESSORIES", brand: "Titan", purchasePrice: 550, sellingPrice: 1395, minStockLevel: 25, reorderPoint: 50, imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400", status: "ACTIVE", totalStock: 148, totalReserved: 5, availableStock: 143 },
  { id: 32, name: "Fastrack Polarized Aviator UV-Protection Sunglasses", sku: "ACC-SUNG-POL-032", barcode: "8901234000322", description: "Category 3 polarized glare protection with lightweight corrosion-resistant metal frame", categoryId: 8, categoryName: "Luggage & Accessories", categoryCode: "CAT_ACCESSORIES", brand: "Fastrack", purchasePrice: 600, sellingPrice: 1499, minStockLevel: 15, reorderPoint: 30, imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400", status: "ACTIVE", totalStock: 74, totalReserved: 0, availableStock: 74 },
];

export const MOCK_SUPPLIERS = [
  { id: 1, code: "SUP_RAYMOND", name: "Raymond Apparel Mills Ltd", contactPerson: "Sunil Singhania", email: "orders@raymondapparel.com", phone: "+91 22 4036 7000", address: "New Hind Mills, Ballard Estate, Mumbai", gstin: "27AAACR1234F1Z1", paymentTerms: "NET_30", rating: 4.85, isActive: true },
  { id: 2, code: "SUP_TATA", name: "Tata Consumer Products & Appliances", contactPerson: "Ramesh Sen", email: "b2b.supplies@tataconsumer.com", phone: "+91 33 2288 3100", address: "1 Bishop Lefroy Road, Kolkata", gstin: "19AAACT5678G1Z4", paymentTerms: "NET_45", rating: 4.90, isActive: true },
  { id: 3, code: "SUP_HAVELLS", name: "Havells India Electricals & Home", contactPerson: "Vikas Gupta", email: "procurement@havells.com", phone: "+91 120 477 1000", address: "QRG Towers, 2D Expressway, Noida", gstin: "09AAACH9012H1Z7", paymentTerms: "NET_30", rating: 4.70, isActive: true },
  { id: 4, code: "SUP_TITAN", name: "Titan Company Accessories & Lifestyle", contactPerson: "Meenakshi Iyer", email: "corporate.orders@titan.co.in", phone: "+91 80 6660 9000", address: "Integrity Campus, Hosur Road, Electronic City, Bengaluru", gstin: "29AAACT3456J1Z9", paymentTerms: "NET_60", rating: 4.95, isActive: true },
  { id: 5, code: "SUP_BOMBAYDYE", name: "Bombay Dyeing & Manufacturing Co", contactPerson: "Kunal Wadia", email: "sales@bombaydyeing.com", phone: "+91 22 6665 8282", address: "Neville House, J.N. Heredia Marg, Ballard Estate, Mumbai", gstin: "27AAACB7890K1Z2", paymentTerms: "NET_30", rating: 4.60, isActive: true },
];

export const MOCK_CUSTOMERS = [
  { id: 1, customerCode: "CUST_MUM_001", name: "Rajesh Kumar", email: "rajesh.kumar@gmail.com", phone: "+91 9819012345", shippingAddress: "Flat 402, Sea Green Apts, Worli Sea Face", city: "Mumbai", state: "Maharashtra", postalCode: "400018" },
  { id: 2, customerCode: "CUST_BLR_002", name: "Priya Sharma", email: "priya.sharma@yahoo.com", phone: "+91 9845023456", shippingAddress: "Villa 12, Palm Meadows, Whitefield", city: "Bengaluru", state: "Karnataka", postalCode: "560066" },
  { id: 3, customerCode: "CUST_DEL_003", name: "Vikram Malhotra", email: "vikram.m@outlook.com", phone: "+91 9811034567", shippingAddress: "D-14 Green Park Main", city: "New Delhi", state: "Delhi", postalCode: "110016" },
  { id: 4, customerCode: "CUST_HYD_004", name: "Sneha Reddy", email: "sneha.reddy@gmail.com", phone: "+91 9849045678", shippingAddress: "Plot 88, Jubilee Hills Road 36", city: "Hyderabad", state: "Telangana", postalCode: "500033" },
  { id: 5, customerCode: "CUST_CHN_005", name: "Karthik Subramanian", email: "karthik.s@gmail.com", phone: "+91 9840056789", shippingAddress: "24 Karpagam Avenue, R.A. Puram", city: "Chennai", state: "Tamil Nadu", postalCode: "600028" },
];

export const MOCK_ORDERS = [
  { id: 1, orderNumber: "ORD-2026-1001", customerId: 1, customerName: "Rajesh Kumar", status: "DELIVERED", totalAmount: 8997, shippingTrackingNumber: "BD-MUM-991204", shippingCarrier: "BlueDart Express", notes: "Delivered on Saturday morning", createdAt: "2026-10-28T10:30:00Z" },
  { id: 2, orderNumber: "ORD-2026-1002", customerId: 2, customerName: "Priya Sharma", storeId: 2, storeName: "Indiranagar Flagship Store", status: "SHIPPED", totalAmount: 5498, shippingTrackingNumber: "DTDC-BLR-44102", shippingCarrier: "DTDC Prime", notes: "Dispatched from Indiranagar Store", createdAt: "2026-10-29T14:20:00Z" },
  { id: 3, orderNumber: "ORD-2026-1003", customerId: 3, customerName: "Vikram Malhotra", warehouseId: 3, warehouseName: "Delhi NCR Northern Fulfillment Center", status: "PROCESSING", totalAmount: 9499, shippingTrackingNumber: "DELHIV-NCR-771", shippingCarrier: "Delhivery Express", notes: "Air purifier priority shipment", createdAt: "2026-10-30T09:15:00Z" },
  { id: 4, orderNumber: "ORD-2026-1004", customerId: 4, customerName: "Sneha Reddy", storeId: 5, storeName: "Banjara Hills Luxury Outlet", status: "CONFIRMED", totalAmount: 3999, notes: "Skybags trolley counter pickup", createdAt: "2026-10-30T16:45:00Z" },
  { id: 5, orderNumber: "ORD-2026-1005", customerId: 5, customerName: "Karthik Subramanian", warehouseId: 1, warehouseName: "Mumbai Central Distribution Hub", status: "PENDING", totalAmount: 4998, notes: "Awaiting bank gateway settlement", createdAt: "2026-10-31T08:00:00Z" },
  { id: 6, orderNumber: "ORD-2026-1006", customerId: 1, customerName: "Rajesh Kumar", warehouseId: 1, warehouseName: "Mumbai Central Distribution Hub", status: "RETURN_REQUESTED", totalAmount: 3199, notes: "Size exchange requested", createdAt: "2026-10-31T11:25:00Z" },
];

export const MOCK_PURCHASE_ORDERS = [
  { id: 1, poNumber: "PO-2026-0001", supplierId: 1, supplierName: "Raymond Apparel Mills Ltd", warehouseId: 1, warehouseName: "Mumbai Central Distribution Hub", status: "RECEIVED", totalAmount: 212500, expectedDeliveryDate: "2026-10-15", notes: "Bulk formal shirts & trousers" },
  { id: 2, poNumber: "PO-2026-0002", supplierId: 3, supplierName: "Havells India Electricals & Home", warehouseId: 1, warehouseName: "Mumbai Central Distribution Hub", status: "PARTIALLY_RECEIVED", totalAmount: 194000, expectedDeliveryDate: "2026-11-05", notes: "Pre-winter air purifier restock" },
  { id: 3, poNumber: "PO-2026-0003", supplierId: 4, supplierName: "Titan Company Accessories", warehouseId: 2, warehouseName: "Bengaluru Southern Logistics Center", status: "APPROVED", totalAmount: 137500, expectedDeliveryDate: "2026-11-12", notes: "Titan leather wallets Southern distribution" },
  { id: 4, poNumber: "PO-2026-0004", supplierId: 2, supplierName: "Tata Consumer Products", warehouseId: 3, warehouseName: "Delhi NCR Northern Fulfillment Center", status: "SUBMITTED", totalAmount: 85000, expectedDeliveryDate: "2026-11-20", notes: "Kitchen appliances trial lot" },
  { id: 5, poNumber: "PO-2026-0005", supplierId: 5, supplierName: "Bombay Dyeing & Mfg Co", warehouseId: 1, warehouseName: "Mumbai Central Distribution Hub", status: "DRAFT", totalAmount: 55000, expectedDeliveryDate: "2026-11-25", notes: "King satin bedsheet replacement" },
];


export const mockProducts = MOCK_PRODUCTS.map((p) => ({
  ...p,
  id: String(p.id),
  costPrice: p.purchasePrice,
  currentStock: p.totalStock,
}));

export const mockCategories = MOCK_CATEGORIES.map((c) => ({
  ...c,
  id: String(c.id),
  productCount: 4,
}));

export const mockWarehouses = MOCK_WAREHOUSES.map((w) => ({
  ...w,
  id: String(w.id),
  address: w.addressLine,
  contactPerson: 'Sandeep Sharma',
  capacityUnits: w.capacity,
  currentStockUnits: Math.round(w.capacity * 0.45),
  totalValuation: Math.round(w.capacity * 0.45 * 2500),
}));

export const mockStores = MOCK_STORES.map((s) => ({
  ...s,
  id: String(s.id),
  address: s.addressLine,
  contactPerson: 'Retail Store Manager',
  currentStockUnits: 450,
  monthlyRevenue: 1250000,
}));

export const mockSuppliers = MOCK_SUPPLIERS.map((sup) => ({
  ...sup,
  id: String(sup.id),
  onTimeDeliveryRate: Math.round(sup.rating * 20),
  activeOrders: 1,
}));

export const mockCustomers = MOCK_CUSTOMERS.map((c) => ({
  ...c,
  id: String(c.id),
}));

export const mockOrders = MOCK_ORDERS.map((o) => ({
  ...o,
  id: String(o.id),
  orderDate: o.createdAt,
  shippingAddress: '402 Skyline Towers, Indiranagar, Bengaluru 560038',
  itemCount: 2,
  items: [
    {
      productName: 'Raymond Men Slim Fit Suit',
      sku: 'APP-SUIT-001',
      unitPrice: 7999,
      quantity: 1,
      total: 7999,
    },
    {
      productName: 'Fabindia Cotton Kurta',
      sku: 'APP-KRT-003',
      unitPrice: 998,
      quantity: 1,
      total: 998,
    },
  ],
}));

export const mockPurchaseOrders = MOCK_PURCHASE_ORDERS.map((po) => ({
  ...po,
  id: String(po.id),
  items: [
    {
      productName: 'Raymond Men Slim Fit Suit',
      sku: 'APP-SUIT-001',
      quantityOrdered: 50,
      quantityReceived: po.status === 'RECEIVED' ? 50 : po.status === 'PARTIALLY_RECEIVED' ? 25 : 0,
      unitCost: 3800,
    },
  ],
}));

export const mockTransfers = [
  {
    id: '1',
    transferNumber: 'TRF-2026-0001',
    sourceLocation: 'Central Distribution (BOM)',
    targetLocation: 'Indiranagar Flagship Store',
    productName: 'Fabindia Cotton Kurta',
    sku: 'APP-KRT-003',
    quantity: 30,
    vehicleNumber: 'KA-01-MJ-4412',
    status: 'COMPLETED',
    createdAt: '2026-10-31T09:30:00Z',
  },
  {
    id: '2',
    transferNumber: 'TRF-2026-0002',
    sourceLocation: 'Central Distribution (BOM)',
    targetLocation: 'Bandra Retail Outlet',
    productName: 'Eureka Forbes Robot Vacuum',
    sku: 'HOM-VAC-004',
    quantity: 10,
    vehicleNumber: 'MH-02-AB-9912',
    status: 'IN_TRANSIT',
    createdAt: '2026-10-31T12:00:00Z',
  },
  {
    id: '3',
    transferNumber: 'TRF-2026-0003',
    sourceLocation: 'North Logistics Hub (DEL)',
    targetLocation: 'Connaught Place Store',
    productName: 'Sony WH-1000XM5 Headphones',
    sku: 'ELE-AUD-002',
    quantity: 15,
    vehicleNumber: 'DL-1C-ZZ-1004',
    status: 'REQUESTED',
    createdAt: '2026-10-31T14:45:00Z',
  },
];

export const mockDashboardStats = {
  totalProducts: 32,
  totalWarehouses: 3,
  totalStores: 5,
  totalInventoryUnits: 5740,
  totalInventoryValue: 14285000,
  lowStockProducts: 3,
  outOfStockProducts: 0,
  pendingOrders: 2,
  completedOrders: 28,
  totalSuppliers: 5,
  stockByCategory: [
    { category: 'Apparel', units: 1450, value: 2850000 },
    { category: 'Electronics', units: 620, value: 5400000 },
    { category: 'Home Goods', units: 890, value: 1650000 },
    { category: 'Footwear', units: 580, value: 1450000 },
    { category: 'Beauty', units: 410, value: 680000 },
    { category: 'Groceries', units: 1100, value: 890000 },
  ],
  warehouseValue: [
    { name: 'Central Distribution (BOM)', value: 6850000, color: '#2563eb' },
    { name: 'North Hub (DEL)', value: 4320000, color: '#0d9488' },
    { name: 'South Hub (BLR)', value: 3115000, color: '#f59e0b' },
  ],
};
