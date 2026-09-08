import React, { useState } from 'react';
import { 
  GitFork, 
  Layers, 
  Database, 
  Server, 
  ShieldCheck, 
  Smartphone, 
  Store, 
  Cpu, 
  ArrowDown, 
  ArrowRight,
  Zap,
  Lock,
  Code2,
  CheckCircle2
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<string>('pricing_engine');

  const layers = [
    {
      id: 'patient_edge',
      title: '1. Client Presentation Layer',
      tech: 'React 19, Tailwind CSS, Motion, WebSockets',
      icon: Smartphone,
      summary: 'Patient mobile and responsive desktop apps for instant price discovery, prescription scanning, and live courier tracking.',
      details: [
        'Client-side OCR drug detection with instant RxNorm cross-referencing',
        'Sub-second pricing discovery across local 18-pharmacy cluster',
        'Live courier telemetry tracking with arrival estimation',
        'Cryptographic RFID seal inspection and 1-click dispute initiation',
      ],
    },
    {
      id: 'edge_gateway',
      title: '2. Edge Gateway & Kong Ingress',
      tech: 'Kong Enterprise Gateway, OAuth 2.0, HMAC SHA-256',
      icon: Server,
      summary: 'Edge traffic routing, store API authentication, rate limiting, and HIPAA compliance encryption.',
      details: [
        'Terminates TLS 1.3 with 256-bit AES cryptographic encryption',
        'Validates HMAC signatures for all POS store webhook ingest payloads',
        'Dynamic routing between canonical search queries and transaction escrow',
        'Multi-region failover with 99.99% operational SLA',
      ],
    },
    {
      id: 'canonical_engine',
      title: '3. Canonical Medication Normalization Engine',
      tech: 'ElasticSearch, RxNorm Graph, FDA Orange Book DB',
      icon: Database,
      summary: 'Normalizes arbitrary store brand names and NDC codes into master canonical chemical salt equivalents.',
      details: [
        'Translates brand drugs (e.g. Glucophage XR) to canonical generic (Metformin HCl 500mg ER)',
        'Enforces FDA Therapeutic Equivalence codes (AB1, AB2, AA) before offer inclusion',
        'Automated National Drug Code (NDC) packaging unit conversion',
        'Prevents dangerous chemical salt substitutions or counterfeit variants',
      ],
    },
    {
      id: 'pricing_engine',
      title: '4. Real-Time Price Arbitrage & Buy-Box Engine',
      tech: 'Redis Cluster In-Memory, Kafka Event Stream',
      icon: Zap,
      summary: 'Sub-15ms buy-box algorithm determining lowest network price, fulfillment distance, and seller SLA.',
      details: [
        'Calculates real-time price spreads and savings percentages (e.g. 78% lower than retail avg)',
        'Evaluates multi-factor Buy-Box scoring: Price (60%), Distance (20%), Store SLA (20%)',
        'Automated price-spike circuit breakers preventing erroneous fat-finger pricing',
        'Price-lock guarantee timer holding locked rates for 15 minutes during checkout',
      ],
    },
    {
      id: 'escrow_tamper',
      title: '5. Escrow Payment & Cryptographic Tamper Vault',
      tech: 'Stripe Escrow Connect, Serialized RFID Ledger, PostgreSQL Multi-Tenant',
      icon: Lock,
      summary: 'Holds patient funds in escrow until courier delivery and cryptographic tamper seal verification.',
      details: [
        'Locks payment in escrow upon order authorization; releases upon customer handshake',
        'Logs serialized RFID barcodes (e.g. SEAL-8910-A) to immutable audit stream',
        'Integrates digital tare scale weights to detect missing medication bottles',
        'Automated dispute triage: P0 tamper alerts initiate instant 100% escrow refunds',
      ],
    },
    {
      id: 'wholesale_pos',
      title: '6. Wholesale EDI & Pharmacy Store POS Feeds',
      tech: 'EDI 832/850, HL7 FHIR R4, gRPC Streams',
      icon: Store,
      summary: 'Bi-directional integration with 428 local pharmacy POS systems and national distributors (McKesson, AmerisourceBergen).',
      details: [
        'Near real-time inventory count synchronization preventing phantom orders',
        'Automated order acceptance and digital prescription routing to dispensing pharmacy',
        'Automated settlement generation and bi-weekly ACH payouts',
        'Merchant onboarding & NABP pharmacy license verification workflow',
      ],
    },
  ];

  const currentLayer = layers.find((l) => l.id === selectedLayer) || layers[3];

  return (
    <div className="space-y-6">
      {/* Top Architecture Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <GitFork className="w-5 h-5 text-blue-600" />
            <h2 className="font-extrabold text-slate-900 text-base">
              Multi-Tenant Architecture & System Data Flow
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              PRD Specification
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Distributed microservice architecture powering real-time generic price arbitrage, prescription verification, and escrow-backed fulfillment.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
          <span>Target P99 Latency: &lt;50ms</span>
        </div>
      </div>

      {/* Interactive System Flow Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Layer Selector Stack */}
        <div className="lg:col-span-1 space-y-2">
          {layers.map((layer) => {
            const Icon = layer.icon;
            const isSelected = selectedLayer === layer.id;
            return (
              <div
                key={layer.id}
                onClick={() => setSelectedLayer(layer.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs leading-snug">{layer.title}</h4>
                    <p
                      className={`text-[10px] truncate max-w-[210px] ${
                        isSelected ? 'text-blue-100' : 'text-slate-500'
                      }`}
                    >
                      {layer.tech}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Layer Detail Inspector */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Layer Specification Inspector
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900">{currentLayer.title}</h3>
            <div className="inline-block mt-1 font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {currentLayer.tech}
            </div>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">{currentLayer.summary}</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
              Core Technical Capabilities & Rules
            </h4>
            <div className="space-y-2 text-xs">
              {currentLayer.details.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Protocol Blueprint */}
          <div className="pt-2">
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-slate-500 mb-2">
              System Ingress / Egress Topology
            </h4>
            <div className="bg-slate-900 text-white rounded-xl p-4 font-mono text-xs space-y-1.5 overflow-x-auto">
              <div className="text-emerald-400"># Real-Time Price Ingest Pipeline</div>
              <div className="text-slate-400">Store POS Node (EDI/REST) → Kong Gateway (HMAC Auth)</div>
              <div className="text-slate-400">↳ Kafka Topic `store.offers.v2` → Canonical Engine (RxNorm AB1)</div>
              <div className="text-slate-400">↳ Redis Cache (TTL 60s) → WebSocket Ticker to Patient App</div>
              <div className="text-slate-300 pt-1 font-bold">Latency SLA: P50=8ms | P99=22ms | Zero-Drop Guarantee</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
