import React from 'react';
import { EnterpriseTab } from '../../types';
import { 
  LayoutDashboard, 
  Database, 
  Store, 
  AlertOctagon, 
  Network, 
  GitFork, 
  Search, 
  Bell, 
  ShieldCheck, 
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

interface EnterpriseLayoutProps {
  activeTab: EnterpriseTab;
  setActiveTab: (tab: EnterpriseTab) => void;
  children: React.ReactNode;
}

export const EnterpriseLayout: React.FC<EnterpriseLayoutProps> = ({
  activeTab,
  setActiveTab,
  children,
}) => {
  const menuItems: { id: EnterpriseTab; label: string; icon: any; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard & System', icon: LayoutDashboard },
    { id: 'catalog', label: 'Canonical Drug Catalog', icon: Database, badge: '12.4k' },
    { id: 'store_ops', label: 'Store Operations Desk', icon: Store, badge: 'ExpressRx' },
    { id: 'disputes', label: 'Dispute & Claims Desk', icon: AlertOctagon, badge: 'P0 Alert' },
    { id: 'api_partners', label: 'Pharma API & HL7 Feeds', icon: Network },
    { id: 'architecture', label: 'Multi-Tenant Architecture', icon: GitFork },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Enterprise Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col border-r border-slate-800">
        {/* Hub Selector */}
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-semibold uppercase tracking-wider">
            <span>Enterprise Context</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <div className="bg-slate-800/90 rounded-xl p-2.5 border border-slate-700/80 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-colors">
            <div className="truncate">
              <span className="font-bold text-xs text-white block truncate">
                ExpressRx Central Hub
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Store #STR-80211 • IL-HQ
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
          </div>
        </div>

        {/* Navigation Menu Items */}
        <nav className="p-3 space-y-1 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                      isActive
                        ? 'bg-blue-700 text-white'
                        : item.badge.includes('Alert')
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* System Health Status Footer */}
        <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-2">
          <div className="flex justify-between items-center">
            <span>Kafka Feed Engine</span>
            <span className="text-emerald-400 font-mono font-semibold">12ms nominal</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Active Store Nodes</span>
            <span className="text-white font-bold">428 Hubs</span>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
            <span>v2.4.0-Enterprise</span>
            <span className="flex items-center space-x-1 text-emerald-400">
              <ShieldCheck className="w-3 h-3" />
              <span>HIPAA Vault</span>
            </span>
          </div>
        </div>
      </aside>

      {/* Main Enterprise Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Enterprise Topbar */}
        <div className="bg-white border-b border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center space-x-3">
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight capitalize">
              {activeTab.replace('_', ' ')}
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Multi-Tenant Cluster
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="relative hidden sm:block">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Global search Rx, NDC, stores..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 w-56 font-medium"
              />
            </div>

            <div className="flex items-center space-x-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Price Discovery: Nominal</span>
            </div>
          </div>
        </div>

        {/* Tab Body View */}
        <div className="p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
};
