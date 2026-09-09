# Changelog

All notable changes to the **generaticMed** platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Scaffolding for bi-directional WebSocket live courier GPS streaming (`wss://api.generatemed.com/tracking`).
- Stripe Connect escrow webhook receiver and automated chargeback clawback hooks.
- **Phase 4 implementation:** enterprise session protection, FHIR R4 medication lookup/request intake, configured SCRIPT NewRx/RxChange/CancelRx delivery, SLA store verification, and SHA-256 audit-chain endpoints.
- **Phase 5 implementation:** configured EDI 832/850 partner delivery, verified-store landed-cost routing, and 30-day seasonal inventory forecasts.

### Fixed
- Repaired the incomplete dispute-resolution response and aligned consumers with the exported baseline dispute dossier, restoring TypeScript compilation.

---

## [0.5.0] - 2026-09-09

### Added
- **Production Express REST API Backend ([`server/index.ts`](file:///c:/Users/ACER/Downloads/Genera_teMedicine/server/index.ts))**:
  - Full REST interface supporting catalog search, Buy-Box offer calculation, escrow order submission, and dispute adjudication.
  - Health check endpoint (`GET /api/v1/health`) reporting system uptime and service connectivity.
- **Multimodal Gemini 2.0 Flash OCR Engine (`POST /api/v1/prescriptions/scan`)**:
  - Server-side `@google/genai` integration ingesting base64 prescription images.
  - Automatic clinical handwriting transcription, doctor NPI parsing, and canonical RxNorm generic matching with savings calculation.
  - Resilient offline fallback matcher guaranteeing zero service disruption.
- **PostgreSQL Multi-Tenant Schema ([`server/schema.sql`](file:///c:/Users/ACER/Downloads/Genera_teMedicine/server/schema.sql), [`server/seed.ts`](file:///c:/Users/ACER/Downloads/Genera_teMedicine/server/seed.ts))**:
  - Production DDL for 8 relational tables (`users`, `pharmacy_stores`, `canonical_drugs`, `drug_offers`, `orders`, `order_items`, `dispute_cases`, `rfid_audit_ledger`).
  - Automated database seeding script for verified Springfield, IL pharmacies and canonical drugs.
- **Resilient Client API Service ([`src/services/api.ts`](file:///c:/Users/ACER/Downloads/Genera_teMedicine/src/services/api.ts))**:
  - Seamless frontend-backend bridge with transparent fallback to local state for zero-downtime offline execution.
- **Prescription Upload Modal Camera & File Ingestion ([`PrescriptionUploadModal.tsx`](file:///c:/Users/ACER/Downloads/Genera_teMedicine/src/components/patient/PrescriptionUploadModal.tsx))**:
  - Direct file/image drag-and-drop or device file selection wired to the Gemini 2.0 OCR pipeline.
  - Dynamic OCR engine badge indicator.

---

## [0.4.0] - 2026-09-08

### Added
- **Interactive System Architecture Blueprint ([`ArchitectureView.tsx`](file:///c:/Users/ACER/Downloads/Genera_teMedicine/src/components/enterprise/ArchitectureView.tsx))**:
  - Six-tier interactive topology explorer covering Presentation, Kong Edge Gateway, Canonical Normalization Engine, Redis/Kafka Pricing Stream, Escrow Vault, and Wholesale EDI feeds.
  - Interactive protocol blueprint detailing sub-15ms pricing ingest pipelines.
- **B2B API Syndication & FHIR Validator ([`ApiPartnersView.tsx`](file:///c:/Users/ACER/Downloads/Genera_teMedicine/src/components/enterprise/ApiPartnersView.tsx))**:
  - Real-time syndication feed monitor for McKesson (EDI 832), AmerisourceBergen (HL7 FHIR), Cardinal Health (gRPC), and ExpressRx (REST v2).
  - Production HL7 FHIR R4 `MedicationKnowledge` payload testing tool with instant schema syntax validation.
  - API credential management interface with 1-click token copy.
- **Persistent AI Engineering Context Files**:
  - [`decisions.md`](file:///c:/Users/ACER/Downloads/Genera_teMedicine/decisions.md): Complete index of 9 Architectural Decision Records (ADRs).
  - [`rules.md`](file:///c:/Users/ACER/Downloads/Genera_teMedicine/rules.md): Coding standards, folder structure, UI/UX, Git conventions, and security guidelines.
  - [`memory.md`](file:///c:/Users/ACER/Downloads/Genera_teMedicine/memory.md): Long-term memory repository covering tech stack, schema, endpoints, and business logic.
  - [`changelog.md`](file:///c:/Users/ACER/Downloads/Genera_teMedicine/changelog.md): Chronological history of project changes.

### Changed
- Standardized navigation bar in [`Navigation.tsx`](file:///c:/Users/ACER/Downloads/Genera_teMedicine/src/components/Navigation.tsx) with persistent mobile container frame toggle.
- Upgraded build tooling to Vite 6 and Tailwind CSS v4.

### Fixed
- Fixed mobile layout overflow in the Buy-Box compare view table on narrow viewport dimensions.
- Corrected RxNorm code display formatting for Metformin HCl 500mg ER.

---

## [0.3.0] - 2026-08-22

### Added
- **Store Operations Console ([`StoreOperationsView.tsx`](file:///c:/Users/ACER/Downloads/Genera_teMedicine/src/components/enterprise/StoreOperationsView.tsx))**:
  - Pharmacy command desk for ExpressRx Central Hub (#STR-80211).
  - **Live Price Desk**: Real-time Buy-Box winner status, stock tracking, and automated 1-click competitor price undercut suggestions.
  - **Dispense Queue**: Real-time prescription orders with physician NPI verification, print-ready bottle labels, and packaging checklist.
  - **Tote Scanner**: RFID tamper seal barcode association and digital tare scale package weighing.
- **Forensic Dispute Resolution Console ([`DisputeResolutionView.tsx`](file:///c:/Users/ACER/Downloads/Genera_teMedicine/src/components/enterprise/DisputeResolutionView.tsx))**:
  - Three-tiered triage system classifying cases by severity (`P0_CRITICAL`, `P1_HIGH`, `P2_NORMAL`).
  - Tare scale weight discrepancy comparison (Store dispatch weight vs. customer delivery weight).
  - High-resolution photographic evidence inspector for broken seals and package tampering.
  - Executable adjudications: Escrow Refund, Emergency Replacement Dispatch, Courier Chargeback, and Claim Rejection.
- **Executive Operations Dashboard ([`DashboardView.tsx`](file:///c:/Users/ACER/Downloads/Genera_teMedicine/src/components/enterprise/DashboardView.tsx))**:
  - Real-time KPI cards for Network GMV, Prescriptions Dispensed, Total Patient Savings, and Active Store Nodes.
  - Anomaly feed monitoring 80% price spikes, stale POS feeds (>30m), and unmatched NDC codes.

### Changed
- Enhanced [`types.ts`](file:///c:/Users/ACER/Downloads/Genera_teMedicine/src/types.ts) with `DisputeCase`, `MicroserviceHealth`, `FlaggedFeedAlert`, and `SystemMetric` interfaces.

### Fixed
- Prevented negative inventory counts during simulated multi-quantity checkout in `StoreOperationsView`.

---

## [0.2.0] - 2026-08-05

### Added
- **Multi-Seller Comparison Engine ([`CompareView.tsx`](file:///c:/Users/ACER/Downloads/Genera_teMedicine/src/components/patient/CompareView.tsx))**:
  - Detailed side-by-side comparison across 18 local pharmacies.
  - Filtering by `In Stock`, `Same Day Delivery`, `Drive-Thru`, and `High Rating (4.8+)`.
  - Sorting by Price, Distance, Delivery Speed, and Review Rating.
  - Expandable **Clinical Bioequivalence Drawer** detailing FDA Orange Book ANDA approval, dissolution profiles, and clinical salt equivalence notes.
- **Instant Prescription Price Match Modal ([`PrescriptionUploadModal.tsx`](file:///c:/Users/ACER/Downloads/Genera_teMedicine/src/components/patient/PrescriptionUploadModal.tsx))**:
  - Prescription upload zone supporting drag-and-drop file ingestion.
  - Simulated OCR parser extracting patient name, physician NPI, brand name, dosage, and refills.
  - Automatic brand-to-generic conversion displaying 78% immediate cost reduction.
- **Live Order & Courier Tracking ([`OrderTrackingView.tsx`](file:///c:/Users/ACER/Downloads/Genera_teMedicine/src/components/patient/OrderTrackingView.tsx))**:
  - Five-stage milestone progress stepper (`Placed` → `Store Accepted` → `Dispensed` → `Out for Delivery` → `Delivered`).
  - Courier profile card with vehicle description, delivery rating, and live ETA.
  - Serialized RFID tamper seal verification badge (`SEAL-8910-A`).
  - One-click dispute reporting interface.
- **Patient Cart & Escrow Checkout ([`CartView.tsx`](file:///c:/Users/ACER/Downloads/Genera_teMedicine/src/components/patient/CartView.tsx))**:
  - Itemized prescription bag with quantity adjustments and removal.
  - Total patient savings calculator against average retail pricing.
  - 15-minute price-lock guarantee countdown timer.

### Changed
- Upgraded cart item models to link specific `DrugOffer` records and pharmacy stores.

### Fixed
- Fixed bug where delivery fee was incorrectly charged when curbside pickup was selected.

---

## [0.1.0] - 2026-07-15

### Added
- Initial project scaffolding with Vite 6, React 19, TypeScript, and Tailwind CSS.
- **Canonical Drug Catalog ([`CanonicalCatalogView.tsx`](file:///c:/Users/ACER/Downloads/Genera_teMedicine/src/components/enterprise/CanonicalCatalogView.tsx))**:
  - Master dataset of canonical generic drugs normalized across RxNorm, NDC, and FDA Orange Book ratings.
  - Support for core therapeutic categories: Diabetes, Cardiac Care, Antibiotics, Pain Relief, Thyroid, Respiratory, and Mental Health.
- **Explore Screen ([`ExploreView.tsx`](file:///c:/Users/ACER/Downloads/Genera_teMedicine/src/components/patient/ExploreView.tsx))**:
  - Medication search bar with instant client-side filtering.
  - Category pill filter navigation.
  - Medication summary cards featuring lowest price, median price, and active seller counts.
- **Domain Modeling ([`types.ts`](file:///c:/Users/ACER/Downloads/Genera_teMedicine/src/types.ts))**:
  - Comprehensive TypeScript interfaces: `Drug`, `DrugOffer`, `PharmacyStore`, `CartItem`, and `Order`.
- **Mock Data Layer ([`mockData.ts`](file:///c:/Users/ACER/Downloads/Genera_teMedicine/src/data/mockData.ts))**:
  - High-fidelity mock pharmacy stores across Springfield, IL.
  - Detailed pharmaceutical drug profiles including Metformin, Atorvastatin, Lisinopril, Empagliflozin, Levothyroxine, Amoxicillin, Sertraline, and Gabapentin.

### Removed
- Removed default React/Vite boilerplate assets and styles.
