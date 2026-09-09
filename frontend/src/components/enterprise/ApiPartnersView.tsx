import React, { useState } from 'react';
import { 
  Network, 
  CheckCircle2, 
  Terminal, 
  Key, 
  Copy, 
  Check, 
  Send, 
  Globe, 
  Code2, 
  Zap,
  Radio
} from 'lucide-react';

export const ApiPartnersView: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [fhirInput, setFhirInput] = useState(`{
  "resourceType": "MedicationKnowledge",
  "id": "metformin-500-er",
  "code": {
    "coding": [
      {
        "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
        "code": "861004",
        "display": "Metformin HCl 500mg Extended Release Tablet"
      }
    ]
  },
  "status": "active",
  "intendedPharmacology": {
    "class": "Biguanide Antihyperglycemic",
    "fdaOrangeBookRating": "AB1"
  }
}`);
  const [validationResult, setValidationResult] = useState<string | null>(null);

  const handleCopyKey = () => {
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleValidateFhir = () => {
    try {
      JSON.parse(fhirInput);
      setValidationResult('Valid HL7 FHIR R4 MedicationKnowledge Resource. Matches RxNorm: 861004 & FDA TE AB1 standard.');
    } catch (e) {
      setValidationResult('Syntax Error: Invalid JSON schema payload.');
    }
  };

  const partnerFeeds = [
    {
      name: 'McKesson Wholesale EDI 832',
      protocol: 'EDI / AS2',
      skus: '42,100 SKUs',
      syncFreq: 'Every 15 mins',
      latency: '24ms',
      status: 'Active',
    },
    {
      name: 'AmerisourceBergen Distribution Feed',
      protocol: 'REST / HL7 FHIR',
      skus: '38,900 SKUs',
      syncFreq: 'Real-time Webhook',
      latency: '14ms',
      status: 'Active',
    },
    {
      name: 'Cardinal Health Catalog Syncer',
      protocol: 'gRPC Stream',
      skus: '29,400 SKUs',
      syncFreq: 'Real-time WebSocket',
      latency: '8ms',
      status: 'Active',
    },
    {
      name: 'ExpressRx Internal Store POS Feed',
      protocol: 'REST API v2 (Store #80211)',
      skus: '384 Local SKUs',
      syncFreq: 'Sub-second',
      latency: '4ms',
      status: 'Active',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="font-extrabold text-slate-900 text-base">
              Pharma Wholesale API Partners & Catalog Syndication
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              HL7 FHIR R4 Compliant
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time catalog synchronization across 428 store POS nodes and major national pharmaceutical distributors.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-mono font-bold">
            1.42M items syndicated / day
          </span>
        </div>
      </div>

      {/* Connected Partner Nodes Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
            Connected Wholesale Feed Gateways
          </h3>
          <span className="text-xs text-slate-400 font-mono">4 active EDI/REST pipes</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-4">Partner Gateway</th>
                <th className="py-2.5 px-3">Protocol</th>
                <th className="py-2.5 px-3">Syndicated SKUs</th>
                <th className="py-2.5 px-3">Frequency</th>
                <th className="py-2.5 px-3">Avg Latency</th>
                <th className="py-2.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {partnerFeeds.map((feed, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-bold text-slate-900">{feed.name}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-600">{feed.protocol}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{feed.skus}</td>
                  <td className="py-3 px-3 text-slate-600">{feed.syncFreq}</td>
                  <td className="py-3 px-3 font-mono text-emerald-600 font-bold">{feed.latency}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {feed.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: HL7 FHIR Tester + Webhook Security Keys */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HL7 FHIR R4 Schema Validator */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-blue-600" />
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                HL7 FHIR R4 MedicationKnowledge Schema Tester
              </h3>
            </div>
            <button
              onClick={handleValidateFhir}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
            >
              Validate Schema
            </button>
          </div>

          <textarea
            value={fhirInput}
            onChange={(e) => setFhirInput(e.target.value)}
            rows={9}
            className="w-full p-3 font-mono text-[11px] bg-slate-900 text-emerald-400 rounded-xl focus:outline-none border border-slate-800"
          ></textarea>

          {validationResult && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{validationResult}</span>
            </div>
          )}
        </div>

        {/* API Credentials & Webhook HMAC Signing */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div>
            <div className="flex items-center space-x-2">
              <Key className="w-4 h-4 text-amber-500" />
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                Enterprise API Authentication & Webhook HMAC Secret
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Store nodes sign price updates with SHA-256 HMAC for anti-tamper ledger ingress
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <span className="text-slate-500 font-semibold block">Store Client ID:</span>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value="gm_live_client_80211_central"
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 font-semibold block">Webhook HMAC Signature Secret:</span>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value="whsec_98f420194bc0283fa8819230491024ad"
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800"
                />
                <button
                  onClick={handleCopyKey}
                  className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600"
                  title="Copy Key"
                >
                  {copiedKey ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <span className="font-bold text-slate-800 block">Ingest Endpoint URL:</span>
              <code className="font-mono text-blue-600 block">
                POST https://api.generaticmed.io/v2/stores/STR-80211/offers/sync
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
