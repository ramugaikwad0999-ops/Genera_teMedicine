import React from 'react';
import { ViewMode, PatientTab, EnterpriseTab } from '../types';
import { 
  Pill, 
  Building2, 
  Smartphone, 
  Maximize2, 
  ShoppingCart, 
  Clock, 
  Search, 
  SlidersHorizontal,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface NavigationProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  patientTab: PatientTab;
  setPatientTab: (tab: PatientTab) => void;
  enterpriseTab: EnterpriseTab;
  setEnterpriseTab: (tab: EnterpriseTab) => void;
  cartCount: number;
  hasActiveOrder: boolean;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  viewMode,
  setViewMode,
  patientTab,
  setPatientTab,
  enterpriseTab,
  setEnterpriseTab,
  cartCount,
  hasActiveOrder,
  isMobileFrame,
  setIsMobileFrame,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Identity */}
          <div className="flex items-center space-x-3">
            <div 
              onClick={() => {
                if (viewMode === 'patient') setPatientTab('explore');
                else setEnterpriseTab('dashboard');
              }}
              className="flex items-center space-x-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 p-0.5 shadow-md group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <div className="flex items-center text-blue-600 font-black text-xl tracking-tighter">
                    <span className="text-blue-600">g</span>
                    <span className="text-emerald-500 font-extrabold text-sm">M</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900">
                    generatic<span className="text-blue-600 font-black">Med</span>
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    AB-RATED
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-none hidden sm:block">
                  Prescription Price Arbitrage & Real-Time Pharmacy Network
                </p>
              </div>
            </div>
          </div>

          {/* Primary View Mode Switcher (Patient vs Enterprise) */}
          <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('patient')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'patient'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Pill className="w-3.5 h-3.5" />
              <span>Patient App</span>
              {cartCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-blue-600 text-white rounded-full text-[10px] font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setViewMode('enterprise')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'enterprise'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Enterprise & Store Ops</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-3">
            {viewMode === 'patient' && (
              <>
                {/* Viewport Frame Toggle (Mobile Frame vs Fluid View) */}
                <button
                  onClick={() => setIsMobileFrame(!isMobileFrame)}
                  title={isMobileFrame ? 'Switch to Fluid Desktop View' : 'Switch to Mobile Phone Simulation'}
                  className="hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
                >
                  {isMobileFrame ? (
                    <>
                      <Maximize2 className="w-3.5 h-3.5 text-slate-700" />
                      <span>Expand Fluid View</span>
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                      <span>Phone Mockup Frame</span>
                    </>
                  )}
                </button>

                {/* Cart Shortcut */}
                <button
                  onClick={() => setPatientTab('cart')}
                  className={`relative p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors ${
                    patientTab === 'cart' ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                  title="View Prescription Cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Active Order Shortcut */}
                {hasActiveOrder && (
                  <button
                    onClick={() => setPatientTab('orders')}
                    className={`relative p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors ${
                      patientTab === 'orders' ? 'bg-amber-50 text-amber-700' : ''
                    }`}
                    title="Track Active Order #GM-89210"
                  >
                    <Clock className="w-5 h-5 text-amber-600" />
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white animate-ping"></span>
                  </button>
                )}
              </>
            )}

            {viewMode === 'enterprise' && (
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
                  428 Hubs Synced (12ms)
                </span>
              </div>
            )}

            {/* Profile Avatar */}
            <div className="flex items-center pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-100">
                MV
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
