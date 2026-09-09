import React, { useState } from 'react';
import { Drug } from '../../types';
import { 
  Search, 
  MapPin, 
  Bell, 
  Upload, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  TrendingDown,
  Camera,
  ChevronRight,
  Filter
} from 'lucide-react';

interface ExploreViewProps {
  drugs: Drug[];
  onSelectDrug: (drug: Drug) => void;
  onOpenUploadModal: () => void;
  onQuickRefill: (drug: Drug) => void;
}

const CATEGORIES = [
  'All',
  'Diabetes',
  'Cardiac Care',
  'Antibiotics',
  'Pain Relief',
  'Thyroid',
  'Mental Health',
];

export const ExploreView: React.FC<ExploreViewProps> = ({
  drugs,
  onSelectDrug,
  onOpenUploadModal,
  onQuickRefill,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDrugs = drugs.filter((drug) => {
    const matchesCategory = selectedCategory === 'All' || drug.category === selectedCategory;
    const matchesSearch =
      drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drug.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drug.brandEquivalent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drug.ndcCode.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const metformin = drugs.find((d) => d.id === 'metformin-500-er') || drugs[0];

  return (
    <div className="space-y-5 pb-12">
      {/* Top Header & Delivery Location */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1 font-bold text-slate-800">
              <span>742 Evergreen Terrace</span>
              <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded cursor-pointer hover:bg-blue-100">
                Change
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Springfield, IL • 18 verified network hubs nearby</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={onOpenUploadModal}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full"></span>
          </button>
        </div>
      </div>

      {/* Hero Live Savings Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 text-white p-5 sm:p-6 shadow-md">
        <div className="absolute -right-6 -bottom-8 w-44 h-44 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/15 text-blue-100 backdrop-blur-xs mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Multi-Pharmacy Live Arbitrage Engine</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white max-w-md leading-snug">
            Save up to 85% on Generic Equivalents in Springfield
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-1.5 max-w-lg leading-relaxed">
            Real-time API feeds compare 18 licensed local pharmacies. Every generic is guaranteed 100% FDA AB-rated therapeutic bioequivalent.
          </p>

          <div className="mt-4 flex flex-wrap gap-2.5">
            <button
              onClick={onOpenUploadModal}
              className="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-98"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Prescription to Match</span>
            </button>
            <button
              onClick={() => onSelectDrug(metformin)}
              className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-white/25 transition-all"
            >
              <span>See Live Comparison ($4.12)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar with Camera / Barcode Icon */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search generic salt (e.g. Metformin), brand (Lipitor), or NDC..."
          className="w-full pl-10 pr-24 py-3 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-2xs font-medium"
        />
        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center space-x-1.5">
          <button
            onClick={onOpenUploadModal}
            className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            title="Scan Prescription or Barcode"
          >
            <Camera className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Scan Rx</span>
          </button>
        </div>
      </div>

      {/* Chronic Fast Refill Card */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-300/60 flex items-center justify-center text-amber-800 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200/80 text-amber-900 px-1.5 py-0.5 rounded">
                Refill Reminder
              </span>
              <span className="text-xs text-slate-500 font-medium">Last filled 26 days ago</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mt-0.5">
              Metformin HCl 500mg ER (60 Tablets)
            </h4>
            <p className="text-xs text-slate-600">
              ~4 days remaining of current supply • Rx #RX-99201 Dr. Sarah Smith
            </p>
          </div>
        </div>

        <button
          onClick={() => onQuickRefill(metformin)}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 active:scale-98"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Quick Refill ($4.12)</span>
        </button>
      </div>

      {/* Featured Instant Comparison Highlight */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Live Network Spread Spotlight
            </span>
          </div>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            18 Live Pharmacy Offers
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-extrabold text-slate-900">{metformin.name}</h3>
              <span className="text-xs font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                AB1
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Therapeutically Bioequivalent to <strong className="text-slate-700">{metformin.brandEquivalent}</strong> • {metformin.therapeuticClass}
            </p>
          </div>

          <div className="flex items-baseline space-x-3">
            <div>
              <span className="text-xs text-slate-400 block line-through">Retail Avg: $18.90</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-xs font-bold text-slate-500">From</span>
                <span className="text-2xl font-black text-emerald-600">${metformin.lowestPrice.toFixed(2)}</span>
                <span className="text-xs text-slate-500">/ 60 tabs</span>
              </div>
            </div>
            <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-extrabold text-xs border border-emerald-200">
              Save 78%
            </span>
          </div>
        </div>

        {/* Visual Price Spread Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1.5">
            <span className="text-emerald-700">⚡ Best: $4.12 (ExpressRx)</span>
            <span className="text-slate-500">Local Avg: $9.50</span>
            <span className="text-rose-600">Max Retail: $18.90</span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
            <div className="w-[22%] bg-emerald-500 rounded-l-full"></div>
            <div className="w-[38%] bg-amber-400"></div>
            <div className="w-[40%] bg-rose-400 rounded-r-full"></div>
          </div>
          <div className="flex items-center justify-between mt-3 text-xs">
            <div className="flex items-center space-x-2 text-slate-500 text-[11px]">
              <span>Verified Sellers:</span>
              <span className="font-semibold text-slate-700">ExpressRx Central ($4.12)</span>
              <span>•</span>
              <span className="font-semibold text-slate-700">MedPlus ($5.80)</span>
              <span>•</span>
              <span className="font-semibold text-slate-700">CostLess ($6.45)</span>
            </div>
            <button
              onClick={() => onSelectDrug(metformin)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <span>Compare All 18 Offers</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Essential Therapeutic Classes
          </h3>
          <span className="text-xs text-slate-400">{filteredDrugs.length} canonical medications</span>
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Essential Medications Grid */}
      <div className="space-y-3">
        {filteredDrugs.map((drug) => {
          const savingsPct = Math.round(((drug.maxRetailPrice - drug.lowestPrice) / drug.maxRetailPrice) * 100);
          return (
            <div
              key={drug.id}
              onClick={() => onSelectDrug(drug)}
              className="bg-white rounded-xl border border-slate-200 hover:border-blue-400 p-4 shadow-2xs hover:shadow-sm transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="flex items-start space-x-3">
                <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-black text-blue-700 shrink-0 text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  Rx
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">
                      {drug.name}
                    </h4>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {drug.fdaTeCode}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500">
                      {drug.standardQuantity} {drug.dosageUnit}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Equivalent to <span className="font-semibold text-slate-700">{drug.brandEquivalent}</span> • {drug.therapeuticClass}
                  </p>

                  <div className="flex items-center space-x-3 mt-1.5 text-[11px] text-slate-500">
                    <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>{drug.availableSellersCount} sellers competing</span>
                    </span>
                    <span>•</span>
                    <span>NDC: {drug.ndcCode}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end space-x-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="text-left sm:text-right">
                  <div className="text-[11px] text-slate-400 line-through">
                    Retail: ${drug.maxRetailPrice.toFixed(2)}
                  </div>
                  <div className="text-base font-black text-emerald-600">
                    ${drug.lowestPrice.toFixed(2)}
                  </div>
                  <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded">
                    Save {savingsPct}%
                  </span>
                </div>

                <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 text-slate-400 flex items-center justify-center transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety & Regulatory Trust Badge */}
      <div className="bg-slate-100/80 rounded-2xl p-4 border border-slate-200/80 flex items-start space-x-3 text-xs text-slate-600">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h5 className="font-bold text-slate-900">100% FDA Approved AB-Rated Generic Quality Standard</h5>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
            All listed pharmacies are licensed by the State Board of Pharmacy. Dispensed generics undergo rigorous pharmaceutical bio-equivalence testing with tamper-evident serial numbers.
          </p>
        </div>
      </div>
    </div>
  );
};
