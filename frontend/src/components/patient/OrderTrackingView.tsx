import React, { useState, useEffect } from 'react';
import { Order } from '../../types';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  AlertTriangle, 
  Download, 
  Car, 
  Building2, 
  Barcode,
  Lock,
  Radio,
  Gauge
} from 'lucide-react';
import { fetchCourierTelemetry, clawbackEscrowHold } from '../../services/api';

interface OrderTrackingViewProps {
  order: Order;
  onOpenDispute: () => void;
  onSwitchToEnterpriseDisputes?: () => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  order,
  onOpenDispute,
  onSwitchToEnterpriseDisputes,
}) => {
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [isEscrowFrozen, setIsEscrowFrozen] = useState(false);
  const [telemetry, setTelemetry] = useState({
    speedMph: 24.5,
    distanceRemainingMiles: 0.8,
    etaMinutes: 6,
    batteryPercent: 94,
    coordinates: { latitude: 39.7817, longitude: -89.6501 }
  });

  useEffect(() => {
    let isMounted = true;
    const interval = setInterval(async () => {
      const data = await fetchCourierTelemetry(order.id);
      if (isMounted && data) {
        setTelemetry({
          speedMph: data.speedMph,
          distanceRemainingMiles: data.distanceRemainingMiles,
          etaMinutes: data.etaMinutes,
          batteryPercent: data.batteryPercent,
          coordinates: data.coordinates,
        });
      }
    }, 4000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [order.id]);

  const handleReportTamper = async () => {
    setIsEscrowFrozen(true);
    await clawbackEscrowHold(`esc_${order.id}`, 'Customer Reported Tampered RFID Seal');
    onOpenDispute();
  };

  const handleDownloadInvoice = () => {
    setDownloadingPdf(true);
    setTimeout(() => {
      setDownloadingPdf(false);
      alert(`Receipt & Prescription Record for ${order.orderNumber} downloaded.`);
    }, 1000);
  };

  const steps = [
    {
      title: 'Order Placed & Escrowed',
      time: '1:15 PM',
      desc: 'Generic price locked at $13.72, escrow account funded',
      done: order.trackingStep >= 1,
    },
    {
      title: 'Prescription Verified & Accepted',
      time: '1:22 PM',
      desc: 'ExpressRx pharmacist cross-checked Dr. Smith & Dr. Taylor Rx',
      done: order.trackingStep >= 2,
    },
    {
      title: 'Dispensed & RFID Sealed',
      time: '1:35 PM',
      desc: `Tamper seal affixed: ${order.rfidSealNumber} (Barcode verified)`,
      done: order.trackingStep >= 3,
    },
    {
      title: 'Out for Courier Delivery',
      time: '2:10 PM',
      desc: `${order.courierName} dispatched in ${order.courierVehicle}`,
      done: order.trackingStep >= 4,
      current: order.trackingStep === 4,
    },
    {
      title: 'Delivered & Signature Verification',
      time: 'Est. 2:45 PM',
      desc: 'Physical seal integrity check upon delivery handoff',
      done: order.trackingStep >= 5,
    },
  ];

  return (
    <div className="space-y-4 pb-20">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h2 className="font-extrabold text-slate-900 text-base">
                Order {order.orderNumber}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Out for Courier Delivery
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Placed {order.date} at {order.time} via {order.store.name}
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            <div>
              <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">Estimated Delivery</span>
              <span className="text-xs font-black text-emerald-900">{order.estimatedArrival}</span>
            </div>
          </div>
        </div>

        {/* Live Courier Tracking Simulated Map */}
        <div className="mt-3 relative rounded-xl overflow-hidden bg-slate-900 text-white h-48 border border-slate-800 shadow-inner">
          {/* Simulated Map Visual */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
          
          {/* Route path */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <path
              d="M 60 140 Q 150 40 240 100 T 420 50"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="4"
              strokeDasharray="6 6"
              className="animate-pulse"
            />
          </svg>

          {/* Live Telemetry Floating HUD */}
          <div className="absolute top-2 left-2 flex items-center space-x-2 z-10">
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-900/90 border border-slate-700 text-[10px] font-mono text-emerald-400">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>LIVE GPS • {telemetry.speedMph} MPH</span>
            </span>
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-900/90 border border-slate-700 text-[10px] font-mono text-blue-300">
              <Gauge className="w-3 h-3 text-blue-400" />
              <span>{telemetry.distanceRemainingMiles} MI REMAINING</span>
            </span>
          </div>

          {/* Hub Pin */}
          <div className="absolute left-8 bottom-6 flex items-center space-x-1.5 bg-slate-900/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-slate-700 text-[11px]">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-bold">ExpressRx Hub</span>
          </div>

          {/* Customer Pin */}
          <div className="absolute right-8 top-6 flex items-center space-x-1.5 bg-slate-900/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-emerald-500/50 text-[11px]">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold text-emerald-300">Marcus' Residence</span>
          </div>

          {/* Courier Marker moving on route */}
          <div className="absolute left-[54%] top-[42%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="relative flex items-center justify-center">
              <span className="absolute w-8 h-8 rounded-full bg-blue-500/40 animate-ping"></span>
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                <Car className="w-4 h-4" />
              </div>
            </div>
            <span className="mt-1 px-1.5 py-0.5 rounded bg-slate-900/95 border border-slate-700 text-[10px] font-bold text-blue-300 shadow">
              {order.courierName} ({telemetry.distanceRemainingMiles} mi)
            </span>
          </div>
        </div>

        {/* Stripe Connect Escrow Vault Card (Phase 3) */}
        <div className={`mt-3 p-3 rounded-xl border text-xs transition-colors ${
          isEscrowFrozen
            ? 'bg-rose-50 border-rose-200 text-rose-900'
            : 'bg-indigo-50/60 border-indigo-200/80 text-indigo-950'
        }`}>
          <div className="flex items-center justify-between border-b border-indigo-200/50 pb-2">
            <div className="flex items-center space-x-1.5 font-bold">
              <Lock className={`w-3.5 h-3.5 ${isEscrowFrozen ? 'text-rose-600' : 'text-indigo-600'}`} />
              <span>Stripe Connect Escrow Vault</span>
            </div>
            <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isEscrowFrozen 
                ? 'bg-rose-600 text-white' 
                : 'bg-indigo-100 text-indigo-800'
            }`}>
              {isEscrowFrozen ? 'ESCROW_FROZEN_CLAWBACK' : 'FUNDS_HELD_IN_VAULT'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 text-[11px]">
            <div>
              <span className="text-slate-500 block text-[10px]">Pharmacy (82%)</span>
              <span className="font-bold text-slate-800">${(order.total * 0.82).toFixed(2)}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Courier (12%)</span>
              <span className="font-bold text-slate-800">${(order.total * 0.12).toFixed(2)}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Platform Fee (6%)</span>
              <span className="font-bold text-slate-800">${(order.total * 0.06).toFixed(2)}</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">
            {isEscrowFrozen
              ? 'Funds frozen due to reported tamper flag. Clawback to customer initiated.'
              : 'Auto-settles into pharmacy & courier accounts 24 hours post-handover.'}
          </p>
        </div>

        {/* Courier Contact Card */}
        <div className="mt-3 flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
              LG
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-slate-900">{order.courierName}</span>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1 rounded">
                  ★ {order.courierRating} ({order.courierDeliveriesCount})
                </span>
              </div>
              <p className="text-[11px] text-slate-500">{order.courierVehicle}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => alert(`Calling courier ${order.courierName}...`)}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
              title="Call Courier"
            >
              <Phone className="w-4 h-4 text-blue-600" />
            </button>
            <button
              onClick={() => alert(`Opening secure in-app chat with ${order.courierName}...`)}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
              title="Message Courier"
            >
              <MessageSquare className="w-4 h-4 text-blue-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Fulfillment Stepper */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wider text-slate-500">
          Fulfillment Lifecycle & Chain-of-Custody
        </h3>

        <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              <div
                className={`absolute -left-6 top-0 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                  step.done
                    ? 'border-emerald-500 text-emerald-500'
                    : step.current
                    ? 'border-blue-600 ring-4 ring-blue-100 animate-pulse'
                    : 'border-slate-300'
                }`}
              >
                {step.done && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
                {step.current && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
              </div>

              <div className="text-xs">
                <div className="flex items-center justify-between">
                  <span
                    className={`font-bold ${
                      step.current
                        ? 'text-blue-600'
                        : step.done
                        ? 'text-slate-900'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{step.time}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cryptographic Tamper-Proof Seal Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-2.5">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
              Cryptographic Tamper-Proof Seal
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
            RFID ACTIVE
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-sm font-black text-amber-300 tracking-wider">
              {order.rfidSealNumber}
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Unique serialized tamper tape affixed by ExpressRx Head Pharmacist.
            </p>
          </div>
          <div className="bg-white p-1.5 rounded-lg text-slate-900">
            <Barcode className="w-10 h-6" />
          </div>
        </div>

        <div className="bg-slate-800/80 p-2.5 rounded-xl text-[11px] text-slate-300 border border-slate-700 flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong>Customer Protection Pledge:</strong> If seal shows the word "VOID", appears unsealed, or is punctured, refuse delivery or report dispute below for an instant 100% refund.
          </p>
        </div>

        {/* Dispute Button */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={handleReportTamper}
            className="flex-1 py-2 px-3 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold transition-all text-center flex items-center justify-center space-x-1.5 shadow-xs active:scale-[0.98]"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Report Broken Seal / Instant Escrow Freeze</span>
          </button>

          {onSwitchToEnterpriseDisputes && (
            <button
              onClick={onSwitchToEnterpriseDisputes}
              className="py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium transition-all"
              title="Open Enterprise Dispute Dossier"
            >
              View Admin Dossier
            </button>
          )}
        </div>
      </div>

      {/* Prescription Items Accordion */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="font-bold text-slate-900">Prescription Contents</h3>
          <span className="font-semibold text-slate-500">
            {order.items.length} {order.items.length === 1 ? 'Medication' : 'Medications'}
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-2 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 block">{item.drugName}</span>
                <span className="text-[11px] text-slate-500">
                  {item.prescriptionNumber} • {item.doctorName}
                </span>
              </div>
              <div className="font-bold text-slate-800">${item.totalPrice.toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
          <button
            onClick={handleDownloadInvoice}
            disabled={downloadingPdf}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-bold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadingPdf ? 'Generating PDF...' : 'Download Pharmacy Invoice & Tax PDF'}</span>
          </button>
          <div className="text-right">
            <span className="text-slate-400 block text-[10px]">Total Charged</span>
            <span className="text-base font-black text-slate-900">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
