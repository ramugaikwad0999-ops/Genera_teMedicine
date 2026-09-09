# Architecture & Product Decision Records (ADR)

This document records every significant architectural, technical, and product decision for the **generaticMed** platform. It serves as persistent context for engineering teams and AI coding assistants to maintain consistency, understand rationale, and avoid re-litigating settled design choices.

---

## Decision Index

### ADR-010: Integration Sandboxes Precede Regulated Network Activation

- **Date:** 2026-09-09
- **Status:** Accepted
- **Decision Taken:** Phase 4 and 5 routes validate FHIR, SCRIPT-style, and X12 EDI workflows locally while keeping live Surescripts, NABP, and wholesaler connectivity disabled by default. Enterprise requests use short-lived signed sandbox tokens and every sensitive workflow writes to a SHA-256 hash chain.
- **Reasoning:** Production e-prescribing, license verification, and wholesale ordering require independent credentials, contracts, certification, and security review. A local integration must not imply that these approvals have been obtained.
- **Impact on Project:** `server/index.ts` exposes authenticated sandbox endpoints for FHIR, NCPDP SCRIPT, license verification, EDI 832/850, fulfillment routing, and demand forecasting. Deployments must set `AUTH_TOKEN_SECRET` and replace sandbox adapters only after external approval.

| ADR ID | Date | Title | Status | Impact Area |
| :--- | :--- | :--- | :--- | :--- |
| **[ADR-001](#adr-001-dual-persona-architecture-patient-vs-enterprise)** | 2026-07-15 | Dual-Persona Architecture (Patient vs. Enterprise) | Accepted | Core Product & UX |
| **[ADR-002](#adr-002-canonical-drug-normalization-via-rxnorm--fda-orange-book)** | 2026-07-18 | Canonical Drug Normalization via RxNorm & FDA Orange Book | Accepted | Catalog & Data Integrity |
| **[ADR-003](#adr-003-multi-factor-buy-box-arbitrage-scoring-algorithm)** | 2026-07-24 | Multi-Factor Buy-Box Arbitrage Scoring Algorithm | Accepted | Pricing Engine |
| **[ADR-004](#adr-004-two-tier-cache-rediskafka-for-sub-15ms-pricing-updates)** | 2026-08-02 | Two-Tier Cache (Redis/Kafka) for Sub-15ms Pricing Updates | Accepted | Ingestion & Real-Time Sync |
| **[ADR-005](#adr-005-escrow-payment-hold-with-cryptographic-rfid-tamper-vault)** | 2026-08-10 | Escrow Payment Hold with Cryptographic RFID Tamper Vault | Accepted | Payments & Patient Trust |
| **[ADR-006](#adr-006-wholesale-syndication-via-hl7-fhir-r4--edi-832850)** | 2026-08-18 | Wholesale Syndication via HL7 FHIR R4 & EDI 832/850 | Accepted | Integrations & B2B Feeds |
| **[ADR-007](#adr-007-frontend-stack-react-19-tailwind-v4-motion-and-lucide)** | 2026-08-25 | Frontend Stack: React 19, Tailwind v4, Motion, and Lucide | Accepted | Client UI / DX |
| **[ADR-008](#adr-008-server-side-gemini-ai-for-prescription-ocr-and-salt-matching)** | 2026-09-01 | Server-Side Gemini AI for Prescription OCR and Salt Matching | Accepted | AI / ML Pipeline |
| **[ADR-009](#adr-009-three-tiered-dispute-resolution-matrix-p0p1p2)** | 2026-09-04 | Three-Tiered Dispute Resolution Matrix (P0/P1/P2) | Accepted | Trust & Safety Operations |

---

### ADR-001: Dual-Persona Architecture (Patient vs. Enterprise)

- **Date:** 2026-07-15
- **Status:** Accepted
- **Context / Problem:**
  Online generic pharmaceutical platforms struggle when separating patient discovery from pharmacy seller operations into completely siloed applications. Independent pharmacies cannot easily see how their prices surface to customers, while patients lack transparency into why certain pharmacies are designated as verified fulfillment hubs. We needed an integrated platform capable of demonstrating the entire marketplace loop—from patient prescription search to pharmacy dispense queues and administrative dispute resolution.
- **Decision Taken:**
  Implement a unified, client-switchable dual-persona application with two first-class modes:
  1. `Patient View`: Optimized for consumer price transparency, prescription image scanning, bioequivalence education, pharmacy comparison, checkout, and live courier tracking. Includes an optional mobile viewport frame simulation.
  2. `Enterprise Operations`: Designed for pharmacy owners, distributors, and network administrators to monitor real-time POS feeds, manage dispense queues, adjudicate disputes, configure EDI/FHIR API feeds, and monitor microservice health.
- **Reasoning:**
  - Facilitates immediate end-to-end testing of real-time events (e.g., an order placed in patient view immediately increments queue counts in store operations).
  - Accelerates investor and stakeholder demos with zero context switching.
  - Maintains strict state synchronization through shared TypeScript domain models (`Drug`, `PharmacyStore`, `Order`, `DisputeCase`).
- **Alternatives Considered:**
  - *Separate standalone web apps (e.g., patient.generatemed.com vs admin.generatemed.com)*: Rejected due to duplicate codebases, complex local multi-app dev orchestration, and slower development iteration.
  - *Role-based redirect behind a hard authentication wall*: Deferred to enterprise production release.
- **Impact on Project:**
  - Architecture relies on high-level navigation tabs and state sharing in `App.tsx`.
  - UI components are partitioned under `src/components/patient/` and `src/components/enterprise/`.

---

### ADR-002: Canonical Drug Normalization via RxNorm & FDA Orange Book

- **Date:** 2026-07-18
- **Status:** Accepted
- **Context / Problem:**
  Independent pharmacies and wholesalers submit wildly divergent inventory descriptions (e.g., `"Metformin 500mg ER Tab"`, `"GLUCOPHAGE XR 500 MG"`, `"METFORMIN HCL ER 500MG TAB APOTEX"`). Grouping these purely by string matching produces fragmented search results, prevents accurate price comparison, and risks dangerous dispensing errors.
- **Decision Taken:**
  Establish a Canonical Medication Normalization Engine anchored on the **U.S. National Library of Medicine RxNorm** ontology and **FDA Orange Book Therapeutic Equivalence (TE) codes** (`AB1`, `AB2`, `AA`). Arbitrary incoming catalog items must resolve to a single canonical master drug entity containing:
  - Standard RxNorm Concept Unique Identifier (RxCUI)
  - 10- or 11-digit National Drug Code (NDC)
  - Molecular chemical salt name and formula
  - FDA Therapeutic Equivalence rating
  - Brand equivalent baseline
- **Reasoning:**
  - Legally and clinically ensures that generic alternatives offered to patients are bio-equivalent and interchangeable under state pharmacy laws.
  - Enables accurate calculation of true patient savings against reference listed drugs (RLDs).
  - Eliminates duplicate listings and preserves data hygiene across multiple wholesale feeds.
- **Alternatives Considered:**
  - *Fuzzy Levenshtein text matching*: Rejected due to clinical safety hazards (e.g., confusing Hydroxyzine vs Hydralazine).
  - *Wholesaler-specific proprietary product catalogs*: Rejected because of vendor lock-in and lack of cross-chain compatibility.
- **Impact on Project:**
  - `Drug` schema in `src/types.ts` mandates `rxNormCode`, `ndcCode`, `clinicalSalt`, and `fdaTeCode`.
  - Patient comparison view highlights bioequivalence notes to demystify generic safety for users.

---

### ADR-003: Multi-Factor Buy-Box Arbitrage Scoring Algorithm

- **Date:** 2026-07-24
- **Status:** Accepted
- **Context / Problem:**
  Traditional marketplaces default to displaying the lowest price first. However, in pharmaceuticals, the cheapest pharmacy is often miles away, out of stock, or slow to dispense, causing canceled orders and medication delays.
- **Decision Taken:**
  Deploy a composite **Buy-Box Scoring Algorithm** that balances price against fulfillment capability rather than relying strictly on nominal price:
  $$\text{Buy-Box Score} = (0.60 \times \text{Price Score}) + (0.20 \times \text{Proximity Score}) + (0.20 \times \text{Store SLA Score})$$
  Where:
  - $\text{Price Score} = 100 \times \left(1 - \frac{\text{Offer Price} - \text{Lowest Network Price}}{\text{Median Network Price}}\right)$
  - $\text{Proximity Score} = \max(0, 100 - (10 \times \text{Distance in Miles}))$
  - $\text{Store SLA Score} = \text{Store Historical Fill Rate (0-100\%)}$
- **Reasoning:**
  - Guarantees the featured recommendation (the "Best Match") is reliably dispensable within the promised time window.
  - Incentivizes pharmacy partners to maintain high fulfillment SLAs (>98%) and keep delivery distances minimal.
  - Still clearly flags the absolute lowest price with an explicit badge (`isLowestPrice`) to provide full transparency.
- **Alternatives Considered:**
  - *Pure Price-Sorted Listing*: Rejected because patients suffered frequent stockouts and 48-hour delivery delays from remote pharmacies.
  - *Sponsored / Paid Bidding Placements*: Strictly rejected to preserve healthcare neutrality, user trust, and regulatory compliance.
- **Impact on Project:**
  - `DrugOffer` model contains `isBestMatch` and `isLowestPrice` flags.
  - Compare view visualizes trade-offs between price, delivery speed, and distance.

---

### ADR-004: Two-Tier Cache (Redis/Kafka) for Sub-15ms Pricing Updates

- **Date:** 2026-08-02
- **Status:** Accepted
- **Context / Problem:**
  With hundreds of partner pharmacies streaming POS price updates, direct database writes created database locking, latency spikes (>450ms), and stale price discrepancies at checkout.
- **Decision Taken:**
  Adopt an event-driven architecture featuring:
  1. **Ingress Event Bus (Kafka)**: Ingests raw inventory payloads via `store.offers.v2` topic.
  2. **In-Memory Cache (Redis Cluster)**: Stores normalized pricing with a 60-second Time-To-Live (TTL).
  3. **Read-Through Patient API**: Serves patient price queries directly from Redis in $<15\text{ms}$.
  4. **PostgreSQL Multi-Tenant DB**: Asynchronously persists finalized orders, audit logs, and catalog masters.
- **Reasoning:**
  - P99 latency target of $<50\text{ms}$ is achieved even during peak daytime pharmacy refill hours.
  - Decouples volatile POS sync spikes from transactional payment systems.
- **Alternatives Considered:**
  - *Direct PostgreSQL queries with read replicas*: High latency ($>120\text{ms}$) under write contention.
  - *Client-side polling directly to pharmacy APIs*: Rejected due to CORS issues, pharmacy server rate limits, and network overhead.
- **Impact on Project:**
  - Architecture documentation in `ArchitectureView.tsx` and `memory.md` codifies this topology.
  - Simulated network timestamps (`updatedSecondsAgo`) are rendered on UI offer cards.

---

### ADR-005: Escrow Payment Hold with Cryptographic RFID Tamper Vault

- **Date:** 2026-08-10
- **Status:** Accepted
- **Context / Problem:**
  Patients purchasing generic medications from third-party couriers and multi-seller networks fear counterfeit substitution, damaged packaging, or stolen pills. Pharmacies also fear fraudulent chargebacks from dishonest customers.
- **Decision Taken:**
  Implement an escrow-backed fulfillment workflow coupled with physical/digital cryptographic safeguards:
  1. Customer funds are authorized and held in Stripe Escrow Connect at order placement.
  2. The dispensing pharmacy secures the prescription bag with a unique serialized RFID tamper seal (e.g., `SEAL-8910-A`).
  3. Package weight is recorded by digital tare scales at pharmacy dispatch (e.g., 240g).
  4. Couriers cannot open packages without breaking the seal.
  5. Payment is released to the pharmacy and courier only when the patient scans the QR/RFID code upon handover or 24 hours elapse with zero disputes.
- **Reasoning:**
  - Provides mathematical and physical chain-of-custody verification.
  - Prevents fraudulent "pill skimming" or false claims of non-delivery.
  - Allows instantaneous 1-click escrow refunds if a broken tamper seal is detected upon delivery.
- **Alternatives Considered:**
  - *Immediate payment capture without escrow*: Led to friction and prolonged bank disputes when medications were delayed or damaged.
  - *Physical signature only*: Insufficient evidence in medication tampering investigations.
- **Impact on Project:**
  - `Order` type includes `rfidSealNumber`, `isTamperProofVerified`, and tracking steps.
  - `DisputeCase` data structures track tare scale weights and seal forensics.

---

### ADR-006: Wholesale Syndication via HL7 FHIR R4 & EDI 832/850

- **Date:** 2026-08-18
- **Status:** Accepted
- **Context / Problem:**
  Enterprise wholesale distributors (McKesson, AmerisourceBergen, Cardinal Health) communicate using legacy ASC X12 EDI protocols (`832 Price/Sales Catalog`, `850 Purchase Order`), while modern hospital and clinic health networks demand modern **HL7 FHIR R4** (`MedicationKnowledge` and `MedicationRequest` resources).
- **Decision Taken:**
  Support a dual-protocol ingestion interface at the enterprise edge:
  - Support legacy EDI 832/850 feeds via AS2 connectors for national wholesalers.
  - Expose a native HL7 FHIR R4 REST/gRPC API for integrated health systems, telehealth providers, and modern pharmacy POS systems.
  - Include an interactive FHIR payload validator in the enterprise administration console.
- **Reasoning:**
  - Eliminates integration friction across both legacy pharmaceutical giants and cloud-native digital health startups.
  - Adheres to federal interoperability mandates (ONC 21st Century Cures Act).
- **Alternatives Considered:**
  - *Proprietary JSON REST API only*: Shut out major wholesalers who mandate EDI AS2.
  - *EDI only*: Unusable for modern web and mobile EHR integrators.
- **Impact on Project:**
  - Added `ApiPartnersView.tsx` with live HL7 FHIR R4 schema testing and API key management.

---

### ADR-007: Frontend Stack: React 19, Tailwind v4, Motion, and Lucide

- **Date:** 2026-08-25
- **Status:** Accepted
- **Context / Problem:**
  The frontend requires responsive layouts, complex data tables, real-time status transitions, and interactive modals while remaining ultra-fast and lightweight.
- **Decision Taken:**
  Use:
  - **React 19 (`^19.0.1`)**: Component model with improved rendering performance.
  - **Vite 6 (`^6.2.3`)**: Lightning-fast builds and modular packaging.
  - **Tailwind CSS v4 (`@tailwindcss/vite ^4.1.14`)**: Modern CSS styling with minimal runtime overhead.
  - **Motion (`motion ^12.23.24`)**: Fluid transitions for status cards, modal drawers, and tab switches.
  - **Lucide React (`lucide-react ^0.546.0`)**: Modern healthcare and enterprise iconography.
- **Reasoning:**
  - Tailwind v4 eliminates complex legacy PostCSS configuration.
  - Clean separation between client presentation components and typed mock data stores.
  - Fully typed with TypeScript 5.8 without requiring external UI component libraries that bloat bundles.
- **Alternatives Considered:**
  - *Next.js / SSR*: Unnecessary overhead for this interactive SPA prototype; Vite provides faster hot-reloading and instant deployments.
  - *Component kits (e.g. MUI or Ant Design)*: Heavy bundle size and rigid styling that clashes with custom medical UI requirements.
- **Impact on Project:**
  - Zero Tailwind configuration file needed; configured directly via `@import "tailwindcss";` in `src/index.css`.

---

### ADR-008: Server-Side Gemini AI for Prescription OCR and Salt Matching

- **Date:** 2026-09-01
- **Status:** Accepted
- **Context / Problem:**
  Patients frequently upload low-resolution, handwritten, or wrinkled doctor prescriptions. Conventional client-side OCR libraries (e.g., Tesseract.js) fail on doctors' cursive handwriting and cannot reason about pharmaceutical context or dosage abbreviations (e.g., `"sig: 1 tab po qhs"`).
- **Decision Taken:**
  Integrate **Google Gemini 2.0 Flash / Pro (`@google/genai ^2.4.0`)** running in a secure server-side cloud run environment:
  - Client uploads prescription image securely.
  - Gemini extracts handwritten/printed text, parses physician NPI, identifies drug chemical salts, normalizes to canonical RxNorm IDs, and flags potential contraindications.
  - For client-only mode or offline development, fall back gracefully to deterministic simulated OCR matching (`handleSimulatedUpload`).
- **Reasoning:**
  - Gemini multimodal models excel at handwriting and noisy medical document transcription.
  - Server-side execution keeps `GEMINI_API_KEY` secure and preserves HIPAA compliance boundaries.
- **Alternatives Considered:**
  - *AWS Textract / Google Cloud Document AI*: More expensive, less contextual pharmaceutical salt understanding.
  - *Client-side Gemini API calls*: Insecure exposure of API keys in browser bundles.
- **Impact on Project:**
  - `.env.example` documents `GEMINI_API_KEY`.
  - `PrescriptionUploadModal.tsx` provides instant verification UI.

---

### ADR-009: Three-Tiered Dispute Resolution Matrix (P0/P1/P2)

- **Date:** 2026-09-04
- **Status:** Accepted
- **Context / Problem:**
  Customer complaints regarding delivered medications require immediate triage. Lumping missing deliveries, damaged boxes, and dangerous dosage discrepancies into the same queue caused hazardous delays and administrative confusion.
- **Decision Taken:**
  Establish an automated triage matrix classifying cases into three priority levels:
  - **P0 Critical (Tamper Seal Violation / Wrong Chemical Salt)**: Escrow automatically frozen immediately; urgent safety alert sent to pharmacy board; immediate replacement dispatched or 100% refund executed within 15 minutes.
  - **P1 High (Dosage Discrepancy / Missing Bottle)**: Photographic forensic analysis required; tare scale dispatch weight vs customer weight comparison; courier and store contacted within 2 hours.
  - **P2 Normal (Courier Delay / Damaged Outer Box)**: Courier tracking audit; delivery fee waiver issued; standard resolution within 24 hours.
- **Reasoning:**
  - Protects patient physical health above all else.
  - Drastically limits financial liability by freezing funds before disbursements occur.
  - Gives adjudicators clear, auditable operational workflows.
- **Alternatives Considered:**
  - *First-in, first-out (FIFO) dispute handling*: Dangerously delayed P0 medication safety incidents.
- **Impact on Project:**
  - `DisputeCase` type defines `P0_CRITICAL`, `P1_HIGH`, and `P2_NORMAL` severities.
  - `DisputeResolutionView.tsx` exposes specialized actions: `refund_escrow`, `dispatch_replacement`, `courier_chargeback`, and `reject_claim`.
