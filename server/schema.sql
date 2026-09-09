-- ============================================================================
-- generaticMed Platform: Multi-Tenant PostgreSQL Schema DDL
-- Standard: PostgreSQL 15+ compatible
-- Normalized with RxNorm, NDC, FDA Orange Book & RFID Chain-of-Custody Ledgers
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS (Patients & Healthcare Consumers)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    trust_score NUMERIC(5, 2) DEFAULT 98.50,
    past_orders_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. PHARMACY STORES (Independent & Chain Fulfillment Hubs)
CREATE TABLE IF NOT EXISTS pharmacy_stores (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL, -- NABP / NCPDP license identifier
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip VARCHAR(20) NOT NULL,
    latitude DOUBLE PRECISION DEFAULT 39.7817,
    longitude DOUBLE PRECISION DEFAULT -89.6501,
    rating NUMERIC(3, 2) DEFAULT 4.80,
    review_count INTEGER DEFAULT 0,
    distance_miles NUMERIC(5, 2) DEFAULT 1.0,
    is_verified_hub BOOLEAN DEFAULT TRUE,
    has_drive_thru BOOLEAN DEFAULT FALSE,
    has_curbside BOOLEAN DEFAULT TRUE,
    fulfillment_time VARCHAR(100) DEFAULT '25-35 mins',
    sla_score NUMERIC(5, 2) DEFAULT 99.00,
    phone VARCHAR(50) NOT NULL,
    is_chain BOOLEAN DEFAULT FALSE,
    chain_name VARCHAR(100),
    is_accepting_orders BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CANONICAL DRUGS (RxNorm & FDA Orange Book Master Catalog)
CREATE TABLE IF NOT EXISTS canonical_drugs (
    id VARCHAR(100) PRIMARY KEY, -- Slug e.g., 'metformin-500-er'
    name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255) NOT NULL,
    strength VARCHAR(50) NOT NULL,
    form VARCHAR(50) NOT NULL,
    dosage_unit VARCHAR(50) NOT NULL,
    standard_quantity INTEGER DEFAULT 30,
    brand_equivalent VARCHAR(255) NOT NULL,
    molecular_formula VARCHAR(100) NOT NULL,
    clinical_salt VARCHAR(255) NOT NULL,
    therapeutic_class VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- e.g., 'Diabetes', 'Cardiac Care'
    rxnorm_code VARCHAR(50) NOT NULL,
    ndc_code VARCHAR(50) NOT NULL,
    fda_te_code VARCHAR(10) NOT NULL, -- AB1, AB2, AA
    fda_approval_date DATE NOT NULL,
    lowest_price NUMERIC(10, 2) NOT NULL,
    median_price NUMERIC(10, 2) NOT NULL,
    max_retail_price NUMERIC(10, 2) NOT NULL,
    available_sellers_count INTEGER DEFAULT 0,
    prescription_required BOOLEAN DEFAULT TRUE,
    description TEXT NOT NULL,
    clinical_equivalency_note TEXT NOT NULL,
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index canonical drugs for rapid sub-15ms text search & category filtering
CREATE INDEX IF NOT EXISTS idx_canonical_drugs_category ON canonical_drugs(category);
CREATE INDEX IF NOT EXISTS idx_canonical_drugs_rxnorm ON canonical_drugs(rxnorm_code);
CREATE INDEX IF NOT EXISTS idx_canonical_drugs_ndc ON canonical_drugs(ndc_code);

-- 4. DRUG OFFERS (Real-time Pharmacy Store Inventory & Buy-Box Pricing)
CREATE TABLE IF NOT EXISTS drug_offers (
    id VARCHAR(64) PRIMARY KEY,
    drug_id VARCHAR(100) NOT NULL REFERENCES canonical_drugs(id) ON DELETE CASCADE,
    store_id VARCHAR(64) NOT NULL REFERENCES pharmacy_stores(id) ON DELETE CASCADE,
    price NUMERIC(10, 2) NOT NULL,
    retail_price NUMERIC(10, 2) NOT NULL,
    stock_count INTEGER NOT NULL DEFAULT 0,
    in_stock BOOLEAN DEFAULT TRUE,
    packaging VARCHAR(100) NOT NULL,
    delivery_option VARCHAR(50) NOT NULL DEFAULT 'same_day', -- 'same_day', 'next_day', 'pickup_only'
    delivery_fee NUMERIC(10, 2) DEFAULT 0.00,
    is_lowest_price BOOLEAN DEFAULT FALSE,
    is_best_match BOOLEAN DEFAULT FALSE,
    buy_box_score NUMERIC(6, 2) DEFAULT 0.00,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_drug_offers_drug_id ON drug_offers(drug_id);
CREATE INDEX IF NOT EXISTS idx_drug_offers_store_id ON drug_offers(store_id);

-- 5. ORDERS (Escrow-Backed Prescription Handover)
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    order_number VARCHAR(100) UNIQUE NOT NULL,
    order_date DATE NOT NULL DEFAULT CURRENT_DATE,
    order_time TIME NOT NULL DEFAULT CURRENT_TIME,
    status VARCHAR(50) NOT NULL DEFAULT 'placed', -- 'placed', 'store_accepted', 'dispensed', 'out_for_delivery', 'delivered', 'disputed'
    patient_name VARCHAR(255) NOT NULL,
    patient_phone VARCHAR(50) NOT NULL,
    delivery_address TEXT NOT NULL,
    store_id VARCHAR(64) NOT NULL REFERENCES pharmacy_stores(id),
    subtotal NUMERIC(10, 2) NOT NULL,
    retail_value NUMERIC(10, 2) NOT NULL,
    savings NUMERIC(10, 2) NOT NULL,
    dispensing_fee NUMERIC(10, 2) DEFAULT 1.50,
    delivery_fee NUMERIC(10, 2) DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(100) DEFAULT 'Stripe Escrow Vault (Authorized)',
    escrow_hold_id VARCHAR(100),
    rfid_seal_number VARCHAR(100) NOT NULL,
    is_tamper_proof_verified BOOLEAN DEFAULT TRUE,
    tare_weight_grams NUMERIC(8, 2) DEFAULT 240.00,
    courier_name VARCHAR(100) DEFAULT 'Marcus Reyes',
    courier_vehicle VARCHAR(100) DEFAULT 'Toyota Prius (Silver) • Plate #IL-8819',
    courier_rating NUMERIC(3, 2) DEFAULT 4.95,
    courier_deliveries_count INTEGER DEFAULT 1420,
    estimated_arrival VARCHAR(100) DEFAULT '25-35 mins',
    tracking_step INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. ORDER ITEMS
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    drug_id VARCHAR(100) REFERENCES canonical_drugs(id),
    drug_name VARCHAR(255) NOT NULL,
    strength VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    prescription_number VARCHAR(100) NOT NULL,
    doctor_name VARCHAR(255) NOT NULL,
    doctor_npi VARCHAR(50)
);

-- 7. DISPUTE CASES (P0/P1/P2 Forensic Adjudication Matrix)
CREATE TABLE IF NOT EXISTS dispute_cases (
    id VARCHAR(64) PRIMARY KEY,
    case_number VARCHAR(100) UNIQUE NOT NULL,
    order_id VARCHAR(64) NOT NULL REFERENCES orders(id),
    order_number VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending_review', -- 'pending_review', 'escrow_frozen', 'resolved_refunded', 'resolved_replaced', 'claim_rejected'
    severity VARCHAR(50) NOT NULL DEFAULT 'P1_HIGH', -- 'P0_CRITICAL', 'P1_HIGH', 'P2_NORMAL'
    patient_name VARCHAR(255) NOT NULL,
    patient_phone VARCHAR(50) NOT NULL,
    patient_trust_score NUMERIC(5, 2) DEFAULT 98.00,
    patient_past_orders INTEGER DEFAULT 12,
    store_name VARCHAR(255) NOT NULL,
    store_id VARCHAR(64) NOT NULL REFERENCES pharmacy_stores(id),
    courier_name VARCHAR(100) NOT NULL,
    courier_id VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Tamper Seal Violation', 'Dosage Discrepancy', 'Missing Item', etc.
    opened_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    disputed_amount NUMERIC(10, 2) NOT NULL,
    description TEXT NOT NULL,
    forensic_photo_url TEXT,
    rfid_dispatched_time VARCHAR(50),
    courier_handover_time VARCHAR(50),
    customer_received_time VARCHAR(50),
    weight_at_store_grams NUMERIC(8, 2) NOT NULL,
    weight_at_customer_grams NUMERIC(8, 2) NOT NULL,
    resolution_notes TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 8. RFID AUDIT LEDGER (Immutable Chain of Custody)
CREATE TABLE IF NOT EXISTS rfid_audit_ledger (
    id SERIAL PRIMARY KEY,
    seal_number VARCHAR(100) NOT NULL,
    order_id VARCHAR(64) NOT NULL REFERENCES orders(id),
    scan_event VARCHAR(100) NOT NULL, -- 'DISPENSER_ATTACHED', 'COURIER_PICKUP', 'DELIVERY_HANDOVER', 'TAMPER_ALERT'
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    scanned_by VARCHAR(100) NOT NULL,
    location_lat DOUBLE PRECISION,
    location_lng DOUBLE PRECISION,
    is_tampered BOOLEAN DEFAULT FALSE,
    raw_telemetry JSONB
);
