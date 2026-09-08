import React, { useState, useEffect } from 'react';
import { CartItem } from '../../types';
import { 
  ShieldCheck, 
  Trash2, 
  Plus, 
  Minus, 
  MapPin, 
  Zap, 
  Car, 
  PackageCheck, 
  CreditCard, 
  Lock, 
  Sparkles, 
  Clock, 
  AlertCircle, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface CartViewProps {
  items: CartItem[];
  onUpdateQuantity: (drugId: string, quantity: number) => void;
  onRemoveItem: (drugId: string) => void;
  onCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onContinueShopping,
}) => {
  const [deliveryMode, setDeliveryMode] = useState<'courier' | 'pickup' | 'mail'>('courier');
  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'card' | 'hsa'>('apple_pay');
  const [secondsRemaining, setSecondsRemaining] = useState(872); // ~14 mins

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 900));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const subtotal = items.reduce((acc, item) => acc + item.offer.price * item.quantity, 0);
  const retailTotal = items.reduce((acc, item) => acc + item.offer.retailPrice * item.quantity, 0);
  const savings = retailTotal - subtotal;
  const dispensingFee = items.length > 0 ? 1.20 : 0;
  const deliveryFee = 0.00;
  const grandTotal = subtotal + dispensingFee + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-md mx-auto shadow-xs my-8">
        <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
          <PackageCheck className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Your Prescription Cart is Empty</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
          Explore generic medications or upload your doctor's prescription to instantly discover local network rates.
        </p>
        <button
          onClick={onContinueShopping}
          className="mt-5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all"
        >
          Explore Generic Equivalents
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      {/* Price Lock Countdown Ping */}
      <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-3 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 text-blue-900 font-semibold">
          <Clock className="w-4 h-4 text-blue-600 animate-pulse shrink-0" />
          <span>Live Prices Locked: <strong className="font-mono text-blue-700">{formatTimer(secondsRemaining)} mins</strong></span>
        </div>
        <span className="text-[11px] text-blue-600 bg-white px-2 py-0.5 rounded-full border border-blue-200 font-medium">
          ExpressRx Central Feed Active
        </span>
      </div>

      {/* Rx Verified Master Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <div className="flex items-center space-x-2">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
              Rx Verified for Marcus Vance
            </h4>
            <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
              Ready to Dispense
            </span>
          </div>
          <p className="text-xs text-emerald-700 mt-0.5">
            Active prescriptions on file with Dr. Sarah Smith, MD & Dr. Robert Taylor, MD. All items matched to certified AB-rated generic formulations.
          </p>
        </div>
      </div>

      {/* Store Fulfillment Group */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
              Fulfillment Hub: {items[0]?.offer.store.name}
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            {items.length} item{items.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Item List */}
        <div className="divide-y divide-slate-100">
          {items.map((item) => (
            <div key={item.drug.id} className="py-3 flex items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                    {item.drug.name}
                  </h4>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                    {item.drug.fdaTeCode}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Equivalent to {item.drug.brandEquivalent} • {item.offer.packaging}
                </p>
                <div className="flex items-center space-x-2 text-[10px] text-slate-600">
                  <span className="bg-slate-100 px-1.5 py-0.5 rounded font-mono font-semibold">
                    {item.prescriptionNumber}
                  </span>
                  <span>{item.doctorName}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                  <button
                    onClick={() => onUpdateQuantity(item.drug.id, item.quantity - 1)}
                    className="p-1 hover:bg-slate-200 rounded-l-lg transition-colors text-slate-600"
                    title="Decrease Quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-2 text-xs font-bold text-slate-800 font-mono">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.drug.id, item.quantity + 1)}
                    className="p-1 hover:bg-slate-200 rounded-r-lg transition-colors text-slate-600"
                    title="Increase Quantity"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Price */}
                <div className="text-right min-w-[60px]">
                  <div className="font-black text-slate-900 text-sm">
                    ${(item.offer.price * item.quantity).toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-400 line-through">
                    ${(item.offer.retailPrice * item.quantity).toFixed(2)}
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => onRemoveItem(item.drug.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery & Courier Destination Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Delivery Destination</h3>
          <span className="text-[11px] text-blue-600 font-semibold cursor-pointer hover:underline">
            Edit Address
          </span>
        </div>

        <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
          <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-slate-800">Marcus Vance's Residence</div>
            <div className="text-slate-600 mt-0.5">742 Evergreen Terrace, Springfield, IL 62704</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Special note: Leave at front door inside secure lockbox</div>
          </div>
        </div>

        {/* Fulfillment Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
          <div
            onClick={() => setDeliveryMode('courier')}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              deliveryMode === 'courier'
                ? 'bg-blue-50/50 border-blue-500 ring-1 ring-blue-500'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center space-x-1.5 text-blue-700 font-bold mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Express Courier</span>
            </div>
            <p className="text-[11px] text-slate-500">Arrival in 45-60 min with RFID tamper seal</p>
            <span className="mt-1.5 inline-block text-[11px] font-extrabold text-emerald-600">
              FREE ($0.00)
            </span>
          </div>

          <div
            onClick={() => setDeliveryMode('pickup')}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              deliveryMode === 'pickup'
                ? 'bg-blue-50/50 border-blue-500 ring-1 ring-blue-500'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center space-x-1.5 text-slate-700 font-bold mb-1">
              <Car className="w-3.5 h-3.5" />
              <span>Drive-Thru Hub</span>
            </div>
            <p className="text-[11px] text-slate-500">Ready in 20 min at ExpressRx Downtown</p>
            <span className="mt-1.5 inline-block text-[11px] font-extrabold text-slate-700">
              FREE
            </span>
          </div>

          <div
            onClick={() => setDeliveryMode('mail')}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              deliveryMode === 'mail'
                ? 'bg-blue-50/50 border-blue-500 ring-1 ring-blue-500'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center space-x-1.5 text-slate-700 font-bold mb-1">
              <PackageCheck className="w-3.5 h-3.5" />
              <span>Standard Mail</span>
            </div>
            <p className="text-[11px] text-slate-500">Dispatched via USPS Priority (1-2 days)</p>
            <span className="mt-1.5 inline-block text-[11px] font-extrabold text-slate-700">
              FREE
            </span>
          </div>
        </div>
      </div>

      {/* Financial Breakdown Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2 text-xs">
        <h3 className="font-bold text-slate-900 mb-2">Order Price Summary</h3>
        
        <div className="flex justify-between text-slate-500">
          <span>Big-Chain Retail Value:</span>
          <span className="line-through text-slate-400 font-medium">${retailTotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-slate-700">
          <span>generaticMed Network Price:</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 p-2 rounded-lg border border-emerald-100">
          <span className="flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Generic Arbitrage Match Savings:</span>
          </span>
          <span>-${savings.toFixed(2)} (-{Math.round((savings / retailTotal) * 100)}%)</span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>Pharmacy Dispensing & Tamper Verification Fee:</span>
          <span>${dispensingFee.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>Courier Delivery Fee:</span>
          <span className="text-emerald-700 font-semibold">FREE ($0.00)</span>
        </div>

        <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
          <div>
            <span className="text-sm font-extrabold text-slate-900 block">Total Due</span>
            <span className="text-[10px] text-slate-400">Escrow held until physical tamper seal verified</span>
          </div>
          <span className="text-2xl font-black text-slate-900">
            ${grandTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Payment Selection */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Payment Method</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <button
            onClick={() => setPaymentMethod('apple_pay')}
            className={`p-2.5 rounded-xl border flex items-center justify-center space-x-2 font-bold transition-all ${
              paymentMethod === 'apple_pay'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span> Pay</span>
          </button>

          <button
            onClick={() => setPaymentMethod('card')}
            className={`p-2.5 rounded-xl border flex items-center justify-center space-x-2 font-bold transition-all ${
              paymentMethod === 'card'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Visa •••• 4242</span>
          </button>

          <button
            onClick={() => setPaymentMethod('hsa')}
            className={`p-2.5 rounded-xl border flex items-center justify-center space-x-2 font-bold transition-all ${
              paymentMethod === 'hsa'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>HSA / FSA Card</span>
          </button>
        </div>
      </div>

      {/* Complete Order Button */}
      <div className="space-y-2 pt-2">
        <button
          onClick={onCheckout}
          className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
        >
          <Lock className="w-4 h-4" />
          <span>Authorize & Place Order (${grandTotal.toFixed(2)})</span>
        </button>

        <div className="flex items-center justify-center space-x-1 text-[11px] text-slate-400 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-bit HIPAA compliant checkout • 100% Tamper-Proof Escrow Pledge</span>
        </div>
      </div>
    </div>
  );
};
