import React, { useState } from 'react';
import { 
  mockSystemMetrics, 
  mockMicroservices, 
  mockFlaggedAlerts, 
  mockHourlyVelocity,
  mockDrugs
} from '../../data/mockData';
import { 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Server, 
  ArrowUpRight, 
  RefreshCw, 
  Lock, 
  Zap, 
  ExternalLink,
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';
import { FlaggedFeedAlert } from '../../types';

interface DashboardViewProps {
  onNavigateToCatalog: () => void;
  onNavigateToDisputes: () => void;
  onNavigateToStoreOps: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateToCatalog,
  onNavigateToDisputes,
  onNavigateToStoreOps,
}) => {
  const [alerts, setAlerts] = useState<FlaggedFeedAlert[]>(mockFlaggedAlerts);
  const [quarantiningId, setQuarantiningId] = useState<string | null>(null);

  const handleQuarantine = (alertId: string) => {
    setQuarantiningId(alertId);
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
      setQuarantiningId(null);
    }, 800);
  };

  const maxHourly = Math.max(...mockHourlyVelocity.map((h) => h.orders));

  return (
    <div className="space-y-6">
      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {mockSystemMetrics.map((metric, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
              <span className="truncate">{metric.title}</span>
              <span className="material-symbols-outlined text-slate-400 text-lg">
                {metric.icon}
              </span>
            </div>

            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {metric.value}
            </div>

            <div className="flex items-center space-x-1.5 mt-1.5 text-xs">
              <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100 flex items-center space-x-0.5">
                <ArrowUpRight className="w-3 h-3" />
                <span>{metric.change}</span>
              </span>
              <span className="text-[11px] text-slate-400 truncate">{metric.subtext}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Hourly Velocity & Order Funnel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Order Velocity Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-extrabold text-slate-900 text-sm">
                Marketplace Order Velocity & Real-Time Throughput
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Hourly transaction volume across 428 pharmacy hubs compared to projected baseline
              </p>
            </div>
            <div className="flex items-center space-x-3 text-xs font-semibold">
              <span className="flex items-center space-x-1 text-blue-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span>Today's Actual (18,420)</span>
              </span>
              <span className="flex items-center space-x-1 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                <span>Baseline Forecast</span>
              </span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-44 flex items-end justify-between gap-2 pt-6 border-b border-slate-100">
            {mockHourlyVelocity.map((item, idx) => {
              const heightPct = Math.round((item.orders / maxHourly) * 100);
              const projPct = Math.round((item.projected / maxHourly) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.orders}
                  </div>
                  <div className="w-full flex items-end justify-center gap-1 h-32">
                    {/* Projected bar */}
                    <div
                      style={{ height: `${projPct}%` }}
                      className="w-2 bg-slate-200 rounded-t-sm"
                      title={`Projected: ${item.projected}`}
                    ></div>
                    {/* Actual bar */}
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-3.5 bg-blue-600 rounded-t-sm group-hover:bg-blue-700 transition-colors shadow-2xs"
                      title={`Actual: ${item.orders}`}
                    ></div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{item.hour}</span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-4 gap-2 pt-4 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Peak Velocity</span>
              <span className="font-extrabold text-slate-900">2,450 orders/hr</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Avg Ingest Latency</span>
              <span className="font-extrabold text-emerald-600 font-mono">14ms</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Match Rate</span>
              <span className="font-extrabold text-slate-900">99.8% AB1</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Escrow In-Flight</span>
              <span className="font-extrabold text-blue-600">$184,210</span>
            </div>
          </div>
        </div>

        {/* Real-time Funnel Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-slate-900 text-sm">
                Fulfillment Funnel SLAs
              </h3>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                99.2% Nominal
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Real-time pipeline drop-off and latency tracking
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between font-bold text-slate-800 mb-1">
                  <span>1. Prescription OCR & Validation</span>
                  <span className="text-emerald-700">100% (0.8s)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="w-[100%] h-full bg-emerald-500 rounded-full"></div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between font-bold text-slate-800 mb-1">
                  <span>2. Multi-Store Buy-Box Match</span>
                  <span className="text-emerald-700">99.8% (12ms)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="w-[99.8%] h-full bg-emerald-500 rounded-full"></div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between font-bold text-slate-800 mb-1">
                  <span>3. Pharmacy Accept & Dispense</span>
                  <span className="text-blue-600">99.4% (14m avg)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="w-[99.4%] h-full bg-blue-600 rounded-full"></div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between font-bold text-slate-800 mb-1">
                  <span>4. Tamper Seal Verification</span>
                  <span className="text-emerald-700">99.9% (RFID)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="w-[99.9%] h-full bg-emerald-500 rounded-full"></div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between font-bold text-slate-800 mb-1">
                  <span>5. Courier Handshake & Handoff</span>
                  <span className="text-blue-600">98.9% (28m avg)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="w-[98.9%] h-full bg-blue-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onNavigateToStoreOps}
            className="mt-4 w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
          >
            <span>Open Store Operations Desk</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Critical Discrepancies & Flagged Feeds Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Critical Feed Discrepancies & Price Governance Alerts
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated circuit breakers preventing anomalous patient pricing or phantom inventory
            </p>
          </div>

          <button
            onClick={onNavigateToDisputes}
            className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center space-x-1 self-start sm:self-center"
          >
            <span>Inspect All Disputes (Case #DSP-8910)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {alerts.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
            <span>All pharmacy inventory feeds and prices are currently nominal.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Pharmacy Hub</th>
                  <th className="py-2.5 px-3">Medication</th>
                  <th className="py-2.5 px-3">Anomaly Type</th>
                  <th className="py-2.5 px-3">Price Deviation</th>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3 text-right">Circuit Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {alerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                      {alert.storeName}
                    </td>
                    <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                      {alert.drugName}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full font-mono font-bold text-[10px] bg-rose-50 text-rose-700 border border-rose-200">
                        {alert.anomalyType}
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="text-slate-400 line-through mr-1">${alert.oldPrice.toFixed(2)}</span>
                      <span className="font-bold text-rose-600">→ ${alert.newPrice.toFixed(2)}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                      {alert.timestamp}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleQuarantine(alert.id)}
                        disabled={quarantiningId === alert.id}
                        className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] transition-colors shadow-2xs"
                      >
                        {quarantiningId === alert.id ? 'Engaging...' : 'Quarantine Feed'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Microservice & Multi-Tenant Edge Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">
              Microservices & Multi-Tenant Edge Infrastructure
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live status of routing gateway, canonical search index, and escrow payment vaults
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Region: us-central1 (IL)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {mockMicroservices.map((svc, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-1 rounded">
                  {svc.latencyMs}ms
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs truncate" title={svc.name}>
                {svc.name}
              </h4>
              <p className="text-[10px] text-slate-500 truncate" title={svc.service}>
                {svc.service}
              </p>
              <div className="pt-1 border-t border-slate-200 text-[10px] text-slate-700 font-mono font-semibold truncate">
                {svc.metric}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
