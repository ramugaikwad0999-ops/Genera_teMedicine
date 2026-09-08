import React, { useState } from 'react';
import { Drug, DrugOffer } from '../../types';
import { mockMetforminOffers } from '../../data/mockData';
import { 
  Search, 
  Filter, 
  X, 
  ShieldCheck, 
  ChevronRight, 
  SlidersHorizontal, 
  Download, 
  BarChart3, 
  Store, 
  Sparkles,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface CanonicalCatalogViewProps {
  drugs: Drug[];
}

export const CanonicalCatalogView: React.FC<CanonicalCatalogViewProps> = ({ drugs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDrugForMatrix, setSelectedDrugForMatrix] = useState<Drug | null>(null);

  const filteredDrugs = drugs.filter((drug) => {
    const matchesCategory = selectedCategory === 'All' || drug.category === selectedCategory;
    const matchesSearch =
      drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drug.clinicalSalt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drug.brandEquivalent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drug.rxNormCode.includes(searchQuery) ||
      drug.ndcCode.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Top Banner & Governance KPIs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="font-extrabold text-slate-900 text-base">
              Canonical Drug Catalog & Price Governance
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              12,480 Canonical Records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Normalized across RxNorm, FDA Orange Book, and National Drug Code (NDC) registries with 84,200 active pharmacy offers.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => alert('Exporting Canonical Catalog CSV with current active price spreads...')}
            className="flex items-center space-x-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-bold shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by salt, brand, RxNorm, or NDC..."
            className="w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-2xs"
          />
        </div>

        <div className="flex space-x-2 overflow-x-auto w-full sm:w-auto pb-1 text-xs">
          {['All', 'Diabetes', 'Cardiac Care', 'Antibiotics', 'Pain Relief', 'Thyroid', 'Mental Health'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Normalized Pharmaceutical Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3 px-4">Canonical Drug & Clinical Salt</th>
                <th className="py-3 px-3">Brand Reference</th>
                <th className="py-3 px-3">RxNorm / NDC</th>
                <th className="py-3 px-3">FDA TE Code</th>
                <th className="py-3 px-3 text-center">Sellers</th>
                <th className="py-3 px-3">Lowest Price</th>
                <th className="py-3 px-3">Market Spread</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDrugs.map((drug) => {
                const spreadPct = Math.round(((drug.maxRetailPrice - drug.lowestPrice) / drug.maxRetailPrice) * 100);
                return (
                  <tr
                    key={drug.id}
                    onClick={() => setSelectedDrugForMatrix(drug)}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {drug.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {drug.clinicalSalt}
                      </div>
                    </td>

                    <td className="py-3 px-3 font-semibold text-slate-700">
                      {drug.brandEquivalent}
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                      <div>RxNorm: {drug.rxNormCode}</div>
                      <div className="text-slate-400">NDC: {drug.ndcCode}</div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {drug.fdaTeCode}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center font-bold text-slate-800">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {drug.availableSellersCount} sellers
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-black text-emerald-600 text-sm">
                        ${drug.lowestPrice.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Med: ${drug.medianPrice.toFixed(2)}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-1.5">
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${spreadPct}%` }}
                            className="h-full bg-emerald-500 rounded-full"
                          ></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-700">
                          {spreadPct}%
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Max: ${drug.maxRetailPrice.toFixed(2)}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDrugForMatrix(drug);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 font-bold text-[11px] shadow-2xs transition-colors flex items-center space-x-1 ml-auto"
                      >
                        <span>Competition Matrix</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-In Multi-Seller Competition Matrix Drawer */}
      {selectedDrugForMatrix && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto flex flex-col border-l border-slate-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 sticky top-0 z-10">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    Competition Matrix
                  </span>
                  <span className="font-mono text-xs text-slate-500">
                    RxNorm: {selectedDrugForMatrix.rxNormCode}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  {selectedDrugForMatrix.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Bioequivalent to {selectedDrugForMatrix.brandEquivalent} • {selectedDrugForMatrix.availableSellersCount} Stores Live
                </p>
              </div>

              <button
                onClick={() => setSelectedDrugForMatrix(null)}
                className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-5 space-y-5 flex-1">
              {/* Spread Curve Visualization */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Price Distribution Curve</span>
                  <span className="text-emerald-700">Spread: ${selectedDrugForMatrix.lowestPrice.toFixed(2)} to ${selectedDrugForMatrix.maxRetailPrice.toFixed(2)}</span>
                </div>

                <div className="h-16 flex items-end gap-1.5 pt-2">
                  <div className="flex-1 bg-emerald-500 h-[85%] rounded-t-sm" title="Cluster 1: $4.12 - $5.50 (3 stores)"></div>
                  <div className="flex-1 bg-emerald-400 h-[60%] rounded-t-sm" title="Cluster 2: $5.80 - $7.00 (5 stores)"></div>
                  <div className="flex-1 bg-amber-400 h-[40%] rounded-t-sm" title="Cluster 3: $7.50 - $10.00 (6 stores)"></div>
                  <div className="flex-1 bg-rose-400 h-[25%] rounded-t-sm" title="Cluster 4: $11.00 - $14.50 (3 stores)"></div>
                  <div className="flex-1 bg-rose-500 h-[15%] rounded-t-sm" title="Cluster 5: $15.00+ (1 store)"></div>
                </div>

                <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1">
                  <span>Lowest: ${selectedDrugForMatrix.lowestPrice.toFixed(2)}</span>
                  <span>Median: ${selectedDrugForMatrix.medianPrice.toFixed(2)}</span>
                  <span>Retail Max: ${selectedDrugForMatrix.maxRetailPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Sellers Table in Matrix */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                  Live Pharmacy Offers Breakdown
                </h4>

                <div className="space-y-2 text-xs">
                  {mockMetforminOffers.map((offer) => (
                    <div
                      key={offer.id}
                      className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 bg-white flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900">{offer.store.name}</span>
                          {offer.isLowestPrice && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-500 text-white">
                              WINNING BUY-BOX
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {offer.store.distanceMiles} mi • {offer.store.fulfillmentTime} • {offer.stockCount} units in stock
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-black text-slate-900 text-sm">
                          ${offer.price.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          SLA: {offer.store.slaScore}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs">
              <span className="text-slate-500">Updated via EDI 832 feed 4s ago</span>
              <button
                onClick={() => {
                  alert(`Synced live pricing feeds for ${selectedDrugForMatrix.name}`);
                  setSelectedDrugForMatrix(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-2xs"
              >
                Trigger Catalog Sync
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
