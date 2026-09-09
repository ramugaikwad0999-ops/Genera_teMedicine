import React, { useState, useEffect } from 'react';
import { Drug, DrugOffer } from '../../types';
import { 
  ArrowLeft, 
  Share2, 
  Bookmark, 
  ShieldCheck, 
  Clock, 
  Zap, 
  MapPin, 
  Star, 
  Car, 
  CheckCircle2, 
  Info, 
  ShoppingCart, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface CompareViewProps {
  drug: Drug;
  offers: DrugOffer[];
  onBack: () => void;
  onAddToCart: (offer: DrugOffer) => void;
  isOfferInCart: (offerId: string) => boolean;
}

export const CompareView: React.FC<CompareViewProps> = ({
  drug,
  offers,
  onBack,
  onAddToCart,
  isOfferInCart,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'in_stock' | 'same_day' | 'drive_thru' | 'high_rating'>('all');
  const [sortBy, setSortBy] = useState<'price_asc' | 'delivery' | 'distance' | 'rating'>('price_asc');
  const [isEquivalenceExpanded, setIsEquivalenceExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<DrugOffer>(offers[0] || null);

  useEffect(() => {
    if (offers.length > 0) {
      setSelectedOffer(offers[0]);
    }
  }, [drug.id, offers]);

  // Filter offers
  const filteredOffers = offers.filter((offer) => {
    if (selectedFilter === 'in_stock') return offer.inStock;
    if (selectedFilter === 'same_day') return offer.deliveryOption === 'same_day';
    if (selectedFilter === 'drive_thru') return offer.store.hasDriveThru;
    if (selectedFilter === 'high_rating') return offer.store.rating >= 4.8;
    return true;
  });

  // Sort offers
  const sortedOffers = [...filteredOffers].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'distance') return a.store.distanceMiles - b.store.distanceMiles;
    if (sortBy === 'rating') return b.store.rating - a.store.rating;
    if (sortBy === 'delivery') {
      const aRank = a.deliveryOption === 'same_day' ? 1 : 2;
      const bRank = b.deliveryOption === 'same_day' ? 1 : 2;
      return aRank - bRank;
    }
    return 0;
  });

  const bestOffer = offers[0] || null;

  const handleShare = () => {
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  return (
    <div className="space-y-4 pb-28">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2 rounded-xl border text-xs transition-colors ${
              isBookmarked
                ? 'bg-amber-50 border-amber-300 text-amber-600'
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
            }`}
            title="Save for Refills"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            title="Share Drug Comparison"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{shareCopied ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Canonical Drug Identity Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60 uppercase tracking-wide">
              Canonical Drug Identity
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              FDA AB-Rated Equivalency ({drug.fdaTeCode})
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              RxNorm: {drug.rxNormCode}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {drug.name}
          </h1>

          <p className="text-xs text-slate-500 mt-1">
            Bio-equivalent to <strong className="text-slate-800">{drug.brandEquivalent}</strong> • {drug.form} ({drug.standardQuantity} {drug.dosageUnit})
          </p>
        </div>

        {/* Clinical Specs Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-[11px]">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 block font-medium">Active Clinical Salt</span>
            <span className="font-bold text-slate-800 truncate block" title={drug.clinicalSalt}>
              {drug.clinicalSalt}
            </span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 block font-medium">Therapeutic Class</span>
            <span className="font-bold text-slate-800 truncate block" title={drug.therapeuticClass}>
              {drug.therapeuticClass}
            </span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 block font-medium">FDA Orange Book TE</span>
            <span className="font-bold text-emerald-700 flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3" />
              <span>{drug.fdaTeCode} Therapeutic Match</span>
            </span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 block font-medium">NDC Identifier</span>
            <span className="font-bold text-slate-800 font-mono">
              {drug.ndcCode}
            </span>
          </div>
        </div>
      </div>

      {/* Network Lowest Rate Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-200">
                Network Lowest Live Rate
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                ${drug.lowestPrice.toFixed(2)}
              </span>
              <span className="text-xs text-emerald-100 font-medium">
                / {drug.standardQuantity} {drug.dosageUnit}
              </span>
            </div>
            <p className="text-xs text-emerald-100 mt-1">
              78% lower than brand retail average ($18.90) • ExpressRx Central Hub
            </p>
          </div>

          <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-emerald-500/40">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-xs">
              18 Local Pharmacies Competing
            </span>
            <p className="text-[11px] text-emerald-200 mt-1">
              Real-time feed updated 4 seconds ago
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Sort Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              selectedFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            All Offers ({offers.length})
          </button>
          <button
            onClick={() => setSelectedFilter('in_stock')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              selectedFilter === 'in_stock' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            In-Stock Only
          </button>
          <button
            onClick={() => setSelectedFilter('same_day')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              selectedFilter === 'same_day' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            ⚡ Same-Day Delivery
          </button>
          <button
            onClick={() => setSelectedFilter('drive_thru')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              selectedFilter === 'drive_thru' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            🚗 Drive-Thru Ready
          </button>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400 font-medium">Sort:</span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="price_asc">Lowest Price ($)</option>
            <option value="delivery">Fastest Delivery</option>
            <option value="distance">Nearest Distance</option>
            <option value="rating">Highest Pharmacy Rating</option>
          </select>
        </div>
      </div>

      {/* Multi-Seller Live Offers List */}
      <div className="space-y-3">
        {sortedOffers.map((offer) => {
          const inCart = isOfferInCart(offer.id);
          const isSelected = selectedOffer?.id === offer.id;

          return (
            <div
              key={offer.id}
              onClick={() => setSelectedOffer(offer)}
              className={`rounded-2xl border p-4 sm:p-5 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-50/40 border-blue-500 shadow-sm ring-1 ring-blue-500'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Store Header & Badges */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      {offer.store.name}
                    </h3>
                    {offer.isLowestPrice && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white tracking-wide shadow-2xs">
                        BEST PRICE
                      </span>
                    )}
                    {offer.store.isVerifiedHub && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60 flex items-center space-x-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified Hub</span>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center space-x-1 text-slate-700 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{offer.store.distanceMiles} miles away</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1 text-amber-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{offer.store.rating} ({offer.store.reviewCount})</span>
                    </span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">
                      {offer.store.slaScore}% Fill SLA
                    </span>
                  </div>

                  {/* Fulfillment details */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{offer.store.fulfillmentTime}</span>
                    </span>
                    {offer.store.hasDriveThru && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium">
                        <Car className="w-3 h-3 text-slate-500" />
                        <span>Drive-Thru Ready</span>
                      </span>
                    )}
                    <span className="text-slate-500 font-medium">
                      {offer.stockCount} units in stock
                    </span>
                  </div>
                </div>

                {/* Price & Action Button */}
                <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <div className="text-xl sm:text-2xl font-black text-slate-900">
                      ${offer.price.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-slate-400 line-through">
                      Retail: ${offer.retailPrice.toFixed(2)}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                      Save ${(offer.retailPrice - offer.price).toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(offer);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                      inCart
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs active:scale-98'
                    }`}
                  >
                    {inCart ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>In Cart ({offer.packaging.split(' ')[0]} tabs)</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Clinical Equivalency Note & FDA Orange Book Explainer */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <button
          onClick={() => setIsEquivalenceExpanded(!isEquivalenceExpanded)}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
              AB1
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                FDA Clinical Equivalency Verification (Bioequivalence Report)
              </h4>
              <p className="text-[11px] text-slate-500">
                Why generic Metformin HCl 500mg ER has 100% molecular equivalence to Glucophage® XR
              </p>
            </div>
          </div>
          {isEquivalenceExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {isEquivalenceExpanded && (
          <div className="p-4 pt-0 border-t border-slate-100 text-xs text-slate-600 space-y-3 bg-slate-50/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Active Ingredient Match</span>
                <p className="text-[11px] text-slate-500">
                  Exact identical active clinical salt molecule: <strong>Metformin Hydrochloride (C4H11N5 • HCl)</strong> synthesized in cGMP FDA-inspected facilities.
                </p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Pharmacokinetics (AUC & Cmax)</span>
                <p className="text-[11px] text-slate-500">
                  Matches 90% confidence intervals within 80% to 125% of brand Glucophage XR plasma absorption curve.
                </p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">FDA Orange Book TE Code</span>
                <p className="text-[11px] text-slate-500">
                  Designation <strong>AB1</strong> confirms products in this group are therapeutically equivalent with no bioequivalence problems.
                </p>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              {drug.clinicalEquivalencyNote} Under federal regulations (21 CFR Part 320), generic medications must possess the same active ingredient, dosage form, strength, and route of administration as the brand-name reference listed drug (RLD).
            </p>
          </div>
        )}
      </div>

      {/* Sticky Bottom Quick Add Bar */}
      {selectedOffer && (
        <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-3 px-4 z-40 shadow-lg">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 font-semibold block uppercase">
                Selected: {selectedOffer.store.name}
              </span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-xl font-black text-slate-900">${selectedOffer.price.toFixed(2)}</span>
                <span className="text-xs text-slate-400 line-through">${selectedOffer.retailPrice.toFixed(2)}</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded">
                  Save {selectedOffer.retailPrice > 0 ? Math.round(((selectedOffer.retailPrice - selectedOffer.price) / selectedOffer.retailPrice) * 100) : 0}%
                </span>
              </div>
            </div>

            <button
              onClick={() => onAddToCart(selectedOffer)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md active:scale-98 transition-all flex items-center space-x-1.5"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{isOfferInCart(selectedOffer.id) ? 'Added! View Cart' : 'Add to Cart ($' + selectedOffer.price.toFixed(2) + ')'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
