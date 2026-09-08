import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  Store, 
  Barcode, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  Download, 
  Plus, 
  RefreshCw, 
  Car, 
  Clock, 
  Printer, 
  Check,
  TrendingUp
} from 'lucide-react';

export const StoreOperationsView: React.FC = () => {
  const [isAcceptingOrders, setIsAcceptingOrders] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'price_desk' | 'dispense_queue' | 'tote_scanner'>('price_desk');
  
  // Store's active offers state
  const [storeOffers, setStoreOffers] = useState([
    {
      id: 'off-1',
      name: 'Metformin HCl 500mg ER',
      ndc: '68180-337-01',
      ourPrice: 4.12,
      networkLowest: 4.12,
      isBuyBoxWinner: true,
      stockCount: 540,
      dailySales: 38,
    },
    {
      id: 'off-2',
      name: 'Atorvastatin Calcium 20mg',
      ndc: '00093-7158-98',
      ourPrice: 8.40,
      networkLowest: 8.40,
      isBuyBoxWinner: true,
      stockCount: 310,
      dailySales: 24,
    },
    {
      id: 'off-3',
      name: 'Lisinopril 10mg',
      ndc: '68180-514-01',
      ourPrice: 3.90,
      networkLowest: 3.25,
      isBuyBoxWinner: false,
      stockCount: 180,
      dailySales: 7,
    },
    {
      id: 'off-4',
      name: 'Empagliflozin 10mg',
      ndc: '00597-0152-30',
      ourPrice: 24.50,
      networkLowest: 24.50,
      isBuyBoxWinner: true,
      stockCount: 65,
      dailySales: 12,
    },
    {
      id: 'off-5',
      name: 'Levothyroxine Sodium 50mcg',
      ndc: '00074-6592-11',
      ourPrice: 6.80,
      networkLowest: 6.10,
      isBuyBoxWinner: false,
      stockCount: 90,
      dailySales: 5,
    },
  ]);

  // Dispensing queue state
  const [dispenseQueue, setDispenseQueue] = useState([
    {
      id: 'q-1',
      orderNumber: 'GM-89210',
      patientName: 'Marcus Vance',
      items: 'Metformin HCl 500mg ER (60 tabs) + Atorvastatin 20mg (30 tabs)',
      total: '$13.72',
      status: 'Dispensed & Sealed',
      sealId: 'SEAL-8910-A',
      courier: 'Leo G. (Arriving in 6m)',
    },
    {
      id: 'q-2',
      orderNumber: 'GM-89215',
      patientName: 'Eleanor Vance-Rigby',
      items: 'Lisinopril 10mg (30 tabs)',
      total: '$3.90',
      status: 'Awaiting Pharmacist Check',
      sealId: 'Pending',
      courier: 'Not Dispatched',
    },
  ]);

  // Barcode scanner simulator state
  const [scanInput, setScanInput] = useState('SEAL-8910-A');
  const [scanResult, setScanResult] = useState<any>(null);

  // Buy box simulator state
  const [simPrice, setSimPrice] = useState<number>(3.50);

  const handlePriceChange = (id: string, newPrice: number) => {
    setStoreOffers((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const isWinner = newPrice <= item.networkLowest;
          return {
            ...item,
            ourPrice: newPrice,
            isBuyBoxWinner: isWinner,
          };
        }
        return item;
      })
    );
  };

  const handleMatchLowest = (id: string) => {
    setStoreOffers((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ourPrice: item.networkLowest,
            isBuyBoxWinner: true,
          };
        }
        return item;
      })
    );
  };

  const handleScanBarcode = () => {
    if (scanInput.trim().toUpperCase() === 'SEAL-8910-A') {
      setScanResult({
        valid: true,
        seal: 'SEAL-8910-A',
        orderNumber: 'GM-89210',
        timestamp: '1:35:12 PM',
        pharmacist: 'Dr. Helen Zhao, PharmD (Lic #IL-78920)',
        tamperIntegrity: '100% Intact • Cryptographic Hash: 0x9f4a...e12',
      });
    } else {
      setScanResult({
        valid: false,
        message: 'Barcode not matched in active fulfillment queue.',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Merchant Operations Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-extrabold text-slate-900 text-base">
                  ExpressRx Central Downtown Hub
                </h2>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                  #STR-80211
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  NABP Accredited
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                840 Market Street, Suite 100, Springfield, IL • Lead Pharmacist: Dr. Helen Zhao, PharmD
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Accepting Orders Toggle */}
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <span className="text-slate-600 font-semibold text-xs">Order Intake:</span>
            <button
              onClick={() => setIsAcceptingOrders(!isAcceptingOrders)}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors flex items-center space-x-1 ${
                isAcceptingOrders
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              <span>{isAcceptingOrders ? 'ONLINE / LIVE' : 'PAUSED'}</span>
            </button>
          </div>

          <button
            onClick={() => alert('Exporting Bi-Weekly Escrow Settlement Statement PDF...')}
            className="flex items-center space-x-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-bold shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Settlement PDF</span>
          </button>
        </div>
      </div>

      {/* 5 Store KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-slate-400 block text-[11px] font-semibold">Dispatched Today</span>
          <span className="text-xl font-black text-slate-900">142 Orders</span>
          <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">100% on-time</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-slate-400 block text-[11px] font-semibold">Active Offers</span>
          <span className="text-xl font-black text-slate-900">384 SKUs</span>
          <span className="text-[10px] text-blue-600 font-bold block mt-0.5">74% Buy-Box Win</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-slate-400 block text-[11px] font-semibold">Average Prep SLA</span>
          <span className="text-xl font-black text-emerald-600">14.2 mins</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Target: &lt;20 min</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-slate-400 block text-[11px] font-semibold">Escrow Balance</span>
          <span className="text-xl font-black text-slate-900">$4,820.40</span>
          <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Payout Tomorrow</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-slate-400 block text-[11px] font-semibold">Merchant Trust Score</span>
          <span className="text-xl font-black text-emerald-700">99.8%</span>
          <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">0 Defect Rate</span>
        </div>
      </div>

      {/* Subtabs for Store Operations */}
      <div className="flex border-b border-slate-200 space-x-6 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('price_desk')}
          className={`pb-3 transition-colors relative ${
            activeSubTab === 'price_desk'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Live Offer & Pricing Desk
        </button>

        <button
          onClick={() => setActiveSubTab('dispense_queue')}
          className={`pb-3 transition-colors relative ${
            activeSubTab === 'dispense_queue'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Live Dispensing & Verification Queue ({dispenseQueue.length})
        </button>

        <button
          onClick={() => setActiveSubTab('tote_scanner')}
          className={`pb-3 transition-colors relative ${
            activeSubTab === 'tote_scanner'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Tamper-Proof Tote & RFID Scanner
        </button>
      </div>

      {/* TAB 1: Live Offer & Pricing Desk */}
      {activeSubTab === 'price_desk' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inventory & Pricing Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                  Store Inventory & Dynamic Price Control
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Adjust prices in real-time or match network lowest to capture the Buy-Box
                </p>
              </div>
              <span className="text-[11px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                Live POS Synced
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-4">Generic Medication</th>
                    <th className="py-2.5 px-3">Our Price</th>
                    <th className="py-2.5 px-3">Network Lowest</th>
                    <th className="py-2.5 px-3">Buy-Box Status</th>
                    <th className="py-2.5 px-3 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {storeOffers.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">NDC: {item.ndc}</div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-1">
                          <span className="text-slate-400 font-bold">$</span>
                          <input
                            type="number"
                            step="0.05"
                            value={item.ourPrice}
                            onChange={(e) => handlePriceChange(item.id, parseFloat(e.target.value) || 0)}
                            className="w-16 px-1.5 py-1 border border-slate-200 rounded text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                          />
                        </div>
                      </td>

                      <td className="py-3 px-3 font-mono font-bold text-slate-700">
                        ${item.networkLowest.toFixed(2)}
                      </td>

                      <td className="py-3 px-3">
                        {item.isBuyBoxWinner ? (
                          <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-500 text-white shadow-2xs">
                            WINNING BUY-BOX
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-amber-50 text-amber-800 border border-amber-200">
                            Outbid (+${(item.ourPrice - item.networkLowest).toFixed(2)})
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        {!item.isBuyBoxWinner && (
                          <button
                            onClick={() => handleMatchLowest(item.id)}
                            className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] transition-colors"
                          >
                            Match Lowest (${item.networkLowest.toFixed(2)})
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Buy-Box Volume Simulator Widget */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Winning Buy-Box Simulator
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Simulate margin vs. order capture volume on Metformin HCl 500mg ER
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between font-bold text-slate-700">
                <span>Proposed Price:</span>
                <span className="text-blue-600 font-black">${simPrice.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="3.00"
                max="6.50"
                step="0.05"
                value={simPrice}
                onChange={(e) => setSimPrice(parseFloat(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Aggressive ($3.00)</span>
                <span>Current Lowest ($4.12)</span>
                <span>Margin Focus ($6.50)</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-500">Predicted Order Share:</span>
                <span className="font-extrabold text-emerald-600">
                  {simPrice <= 4.12 ? '84% (Estimated ~48 orders/day)' : '12% (Estimated ~6 orders/day)'}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-500">Gross Margin per Rx:</span>
                <span className="font-extrabold text-slate-800">
                  ${(simPrice - 1.80).toFixed(2)} (Wholesale Cost: $1.80)
                </span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-500">Estimated Daily Revenue:</span>
                <span className="font-extrabold text-blue-600">
                  ${(simPrice * (simPrice <= 4.12 ? 48 : 6)).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                handlePriceChange('off-1', simPrice);
                alert(`Updated Metformin price to $${simPrice.toFixed(2)} across live store feed!`);
              }}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              Apply Simulated Rate (${simPrice.toFixed(2)})
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: Live Dispensing & Verification Queue */}
      {activeSubTab === 'dispense_queue' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-5">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">
              Pharmacist Dispensing & Packaging Workstation
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review doctor prescription, bottle labeling, and affix cryptographic RFID tamper seals
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {dispenseQueue.map((item) => (
              <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-slate-900">{item.orderNumber}</span>
                    <span className="text-xs font-semibold text-slate-600">• {item.patientName}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{item.items}</p>
                  <div className="flex items-center space-x-3 text-[11px] text-slate-500 pt-1">
                    <span className="font-mono text-amber-700 font-bold">Seal: {item.sealId}</span>
                    <span>•</span>
                    <span className="text-slate-700 font-medium">Courier: {item.courier}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-center">
                  <button
                    onClick={() => alert(`Reprinting tamper seal label for ${item.orderNumber}`)}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                    title="Print Tamper Label"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => alert(`Marked ${item.orderNumber} as verified and handed to courier!`)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs transition-colors"
                  >
                    Handshake with Courier
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Tamper-Proof Tote Scanner */}
      {activeSubTab === 'tote_scanner' && (
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center mx-auto mb-2">
              <Barcode className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Tamper-Evident Tote & Seal Integrity Scanner
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Scan serialized RFID seal to log store dispatch timestamp and lock parcel before courier handoff.
            </p>
          </div>

          <div className="flex space-x-2 pt-2">
            <input
              type="text"
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              placeholder="Enter Seal Barcode (e.g. SEAL-8910-A)"
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <button
              onClick={handleScanBarcode}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              Verify Seal
            </button>
          </div>

          {scanResult && (
            <div
              className={`p-4 rounded-xl border text-xs space-y-2 ${
                scanResult.valid
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {scanResult.valid ? (
                <>
                  <div className="flex items-center space-x-1.5 font-bold uppercase tracking-wide">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Cryptographic Seal Verified & Sealed</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[11px] text-emerald-800 pt-1">
                    <div>Order: <strong>{scanResult.orderNumber}</strong></div>
                    <div>Timestamp: <strong>{scanResult.timestamp}</strong></div>
                    <div className="col-span-2">Affixed By: <strong>{scanResult.pharmacist}</strong></div>
                    <div className="col-span-2 font-mono text-[10px] text-emerald-700">{scanResult.tamperIntegrity}</div>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>{scanResult.message}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
