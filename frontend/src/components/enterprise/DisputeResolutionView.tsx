import React, { useState } from 'react';
import { DisputeCase } from '../../types';
import { mockDisputeDossier } from '../../data/mockData';
import { 
  AlertOctagon, 
  ShieldAlert, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  User, 
  Store, 
  Truck, 
  Camera, 
  Scale, 
  FileText,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export const DisputeResolutionView: React.FC = () => {
  const [dossier, setDossier] = useState<DisputeCase>(mockDisputeDossier);
  const [selectedDecision, setSelectedDecision] = useState<
    'refund_escrow' | 'dispatch_replacement' | 'courier_chargeback' | 'reject_claim'
  >('refund_escrow');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionMessage, setExecutionMessage] = useState<string | null>(null);

  const handleExecuteResolution = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      let status: DisputeCase['status'] = 'resolved_refunded';
      let message = '';
      if (selectedDecision === 'refund_escrow') {
        status = 'resolved_refunded';
        message = 'Executed instant $13.72 refund to Marcus Vance via Stripe Escrow. Store escrow debited.';
      } else if (selectedDecision === 'dispatch_replacement') {
        status = 'resolved_replaced';
        message = 'Dispatched emergency sealed replacement from ExpressRx Central Hub with VIP courier.';
      } else if (selectedDecision === 'courier_chargeback') {
        status = 'resolved_refunded';
        message = 'Claim filed against courier insurance policy (Leo Gonzalez). Customer refunded.';
      } else {
        status = 'claim_rejected';
        message = 'Dispute claim denied based on sensor review.';
      }

      setDossier((prev) => ({
        ...prev,
        status,
        resolvedAt: 'Just now by Senior Adjudicator',
        resolutionNotes: message,
      }));
      setExecutionMessage(message);
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Top Dispute Governance Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <h2 className="font-extrabold text-slate-900 text-base">
              Dispute Resolution & Tamper Claims Desk
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
              P0 Critical Incident
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographic chain-of-custody verification, RFID tamper seal logs, and automated escrow arbitration.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-bold text-slate-700">
            Escrow Dispute Hold: <span className="text-rose-600">$6,240.50</span>
          </div>
        </div>
      </div>

      {/* Dispute Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-slate-400 block text-[11px] font-semibold">Active Pending Disputes</span>
          <span className="text-xl font-black text-slate-900">24 Cases</span>
          <span className="text-[10px] text-rose-600 font-bold block mt-0.5">4 P0 Critical Breaches</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-slate-400 block text-[11px] font-semibold">Resolution Velocity</span>
          <span className="text-xl font-black text-emerald-600">18.4 mins</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Target: &lt;30 mins</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-slate-400 block text-[11px] font-semibold">Tamper Seal Breach Rate</span>
          <span className="text-xl font-black text-slate-900">0.02%</span>
          <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">99.98% Seal Integrity</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-slate-400 block text-[11px] font-semibold">Escrow Recovery Rate</span>
          <span className="text-xl font-black text-blue-600">100%</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Zero patient capital loss</span>
        </div>
      </div>

      {/* Case #DSP-8910 Detailed Dossier */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-5 p-5">
        {/* Dossier Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm font-black text-slate-900">
                Case #{dossier.caseNumber}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                {dossier.category}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Linked to Order #{dossier.orderNumber}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Opened {dossier.openedAt} • Disputed Amount: <strong className="text-slate-900">${dossier.disputedAmount.toFixed(2)}</strong>
            </p>
          </div>

          <div>
            <span
              className={`px-3 py-1 rounded-xl text-xs font-bold ${
                dossier.status === 'resolved_refunded'
                  ? 'bg-emerald-100 text-emerald-800'
                  : dossier.status === 'resolved_replaced'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              Status: {dossier.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>

        {/* Stakeholder Triad (Patient vs Store vs Courier) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Patient Card */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-500 font-bold uppercase text-[10px]">
              <User className="w-3.5 h-3.5" />
              <span>Claimant Patient</span>
            </div>
            <div className="font-extrabold text-slate-900 text-sm">{dossier.patientName}</div>
            <div className="text-[11px] text-slate-600">{dossier.patientPhone}</div>
            <div className="pt-1 flex items-center space-x-2 text-[10px]">
              <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                Trust Score: {dossier.patientTrustScore} / 5.0
              </span>
              <span className="text-slate-500">{dossier.patientPastOrders} past orders (0 disputes)</span>
            </div>
          </div>

          {/* Store Card */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-500 font-bold uppercase text-[10px]">
              <Store className="w-3.5 h-3.5" />
              <span>Fulfilling Pharmacy Hub</span>
            </div>
            <div className="font-extrabold text-slate-900 text-sm">{dossier.storeName}</div>
            <div className="text-[11px] text-slate-600">Lead: Dr. Helen Zhao, PharmD</div>
            <div className="pt-1 text-[10px] text-emerald-700 font-bold">
              NABP Accredited • 99.8% Historic Fill SLA
            </div>
          </div>

          {/* Courier Card */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-500 font-bold uppercase text-[10px]">
              <Truck className="w-3.5 h-3.5" />
              <span>Logistics Courier</span>
            </div>
            <div className="font-extrabold text-slate-900 text-sm">{dossier.courierName}</div>
            <div className="text-[11px] text-slate-600">Silver Prius (Plate: 7XYZ89)</div>
            <div className="pt-1 text-[10px] text-amber-700 font-bold">
              1,420 Completed Runs (Rating: 4.96 ★)
            </div>
          </div>
        </div>

        {/* Forensic Evidence Breakdown */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
            Forensic Evidence & Sensor Audit Trail
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Customer Photo preview */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center space-x-1.5 text-slate-700 font-bold text-xs">
                <Camera className="w-3.5 h-3.5 text-blue-600" />
                <span>Customer Uploaded Photo</span>
              </div>
              <div className="h-32 rounded-lg bg-slate-200 overflow-hidden relative border border-slate-300">
                <img
                  src={dossier.forensicPhotoUrl}
                  alt="Damaged seal"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-rose-600 text-white font-mono text-[9px] font-bold">
                  VOID EXPOSED
                </span>
              </div>
              <p className="text-[10px] text-slate-500">
                Perforated safety seal tape broken along horizontal edge revealing VOID watermark.
              </p>
            </div>

            {/* RFID Timestamp Log */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center space-x-1.5 text-slate-700 font-bold">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>RFID Custody Handshakes</span>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between pb-1 border-b border-slate-200">
                  <span className="text-slate-500">Store RFID Seal Affixed:</span>
                  <span className="font-mono font-bold text-slate-800">{dossier.rfidDispatchedTime}</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-200">
                  <span className="text-slate-500">Courier Pickup Handshake:</span>
                  <span className="font-mono font-bold text-slate-800">{dossier.courierHandoverTime}</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-200">
                  <span className="text-slate-500">Patient Delivery Stamp:</span>
                  <span className="font-mono font-bold text-rose-600">{dossier.customerReceivedTime}</span>
                </div>
                <div className="pt-1 text-[10px] text-slate-500">
                  Seal breach likely occurred in transit between courier vehicle and customer porch.
                </div>
              </div>
            </div>

            {/* Weight Discrepancy Scale */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center space-x-1.5 text-slate-700 font-bold">
                <Scale className="w-3.5 h-3.5 text-blue-600" />
                <span>Digital Tare Scale Audit</span>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between pb-1 border-b border-slate-200">
                  <span className="text-slate-500">Store Dispatch Weight:</span>
                  <span className="font-mono font-bold text-slate-800">{dossier.weightAtStoreGrams}g</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-200">
                  <span className="text-slate-500">Customer Scale Check:</span>
                  <span className="font-mono font-bold text-rose-600">{dossier.weightAtCustomerGrams}g</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-200">
                  <span className="text-slate-500">Tare Delta:</span>
                  <span className="font-mono font-bold text-rose-600">-30g discrepancy</span>
                </div>
                <div className="pt-1 text-[10px] text-rose-600 font-medium">
                  Missing bottle or contents unverified. Security breach confirmed.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Adjudication Decision Matrix */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
            Adjudication Determination & Escrow Release
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
            <div
              onClick={() => setSelectedDecision('refund_escrow')}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                selectedDecision === 'refund_escrow'
                  ? 'bg-blue-50/70 border-blue-500 ring-1 ring-blue-500 font-bold text-blue-900'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center space-x-1.5 mb-1">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Instant 100% Refund</span>
              </div>
              <p className="text-[11px] text-slate-500 font-normal">
                Refund $13.72 to Marcus Vance from store escrow. Recommended.
              </p>
            </div>

            <div
              onClick={() => setSelectedDecision('dispatch_replacement')}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                selectedDecision === 'dispatch_replacement'
                  ? 'bg-blue-50/70 border-blue-500 ring-1 ring-blue-500 font-bold text-blue-900'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center space-x-1.5 mb-1">
                <RefreshCw className="w-4 h-4 text-emerald-600" />
                <span>Priority Replacement</span>
              </div>
              <p className="text-[11px] text-slate-500 font-normal">
                Reroute fresh sealed batch via rush courier within 30 min.
              </p>
            </div>

            <div
              onClick={() => setSelectedDecision('courier_chargeback')}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                selectedDecision === 'courier_chargeback'
                  ? 'bg-blue-50/70 border-blue-500 ring-1 ring-blue-500 font-bold text-blue-900'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center space-x-1.5 mb-1">
                <Truck className="w-4 h-4 text-amber-600" />
                <span>Courier Chargeback</span>
              </div>
              <p className="text-[11px] text-slate-500 font-normal">
                Invoice courier third-party transit bond for package loss.
              </p>
            </div>

            <div
              onClick={() => setSelectedDecision('reject_claim')}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                selectedDecision === 'reject_claim'
                  ? 'bg-rose-50/70 border-rose-500 ring-1 ring-rose-500 font-bold text-rose-900'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center space-x-1.5 mb-1">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Deny Claim</span>
              </div>
              <p className="text-[11px] text-slate-500 font-normal">
                Reject dispute if fraud detected. Releases escrow to store.
              </p>
            </div>
          </div>

          {executionMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{executionMessage}</span>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleExecuteResolution}
              disabled={isExecuting}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-2"
            >
              <span>{isExecuting ? 'Processing Escrow Settlement...' : 'Execute Arbitration Decision'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
