import React, { useState } from 'react';
import { 
  ViewMode, 
  PatientTab, 
  EnterpriseTab, 
  Drug, 
  DrugOffer, 
  CartItem, 
  Order 
} from './types';
import { 
  mockDrugs, 
  mockStores, 
  mockMetforminOffers, 
  mockInitialOrder,
  getOffersForDrug
} from './data/mockData';
import { Navigation } from './components/Navigation';
import { submitOrderCheckout } from './services/api';
import { ExploreView } from './components/patient/ExploreView';
import { CompareView } from './components/patient/CompareView';
import { CartView } from './components/patient/CartView';
import { OrderTrackingView } from './components/patient/OrderTrackingView';
import { PrescriptionUploadModal } from './components/patient/PrescriptionUploadModal';
import { EnterpriseLayout } from './components/enterprise/EnterpriseLayout';
import { DashboardView } from './components/enterprise/DashboardView';
import { CanonicalCatalogView } from './components/enterprise/CanonicalCatalogView';
import { StoreOperationsView } from './components/enterprise/StoreOperationsView';
import { DisputeResolutionView } from './components/enterprise/DisputeResolutionView';
import { ApiPartnersView } from './components/enterprise/ApiPartnersView';
import { ArchitectureView } from './components/enterprise/ArchitectureView';
import { 
  Search, 
  GitCompare, 
  ShoppingCart, 
  Clock, 
  Wifi, 
  Battery, 
  Signal,
  Pill,
  Sparkles,
  Smartphone,
  Maximize2
} from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('patient');
  const [patientTab, setPatientTab] = useState<PatientTab>('explore');
  const [enterpriseTab, setEnterpriseTab] = useState<EnterpriseTab>('dashboard');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);

  // Active drug in Compare view
  const [selectedDrug, setSelectedDrug] = useState<Drug>(mockDrugs[0]);

  // Modal for prescription upload
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Cart state - initialized with Metformin & Atorvastatin
  const [cart, setCart] = useState<CartItem[]>([
    {
      drug: mockDrugs[0],
      offer: mockMetforminOffers[0],
      quantity: 1,
      prescriptionNumber: 'RX-99201',
      doctorName: 'Dr. Sarah Smith, MD',
      doctorNpi: '1982739102',
    },
    {
      drug: mockDrugs[1],
      offer: {
        id: 'off-ator-1',
        drugId: 'atorvastatin-20',
        storeId: 'store-1',
        store: mockStores[0],
        price: 8.40,
        retailPrice: 32.50,
        stockCount: 310,
        inStock: true,
        packaging: '30 Tablets (1 Month Supply)',
        deliveryOption: 'same_day',
        deliveryFee: 0,
        isLowestPrice: true,
        isBestMatch: true,
        updatedSecondsAgo: 2,
      },
      quantity: 1,
      prescriptionNumber: 'RX-99204',
      doctorName: 'Dr. Robert Taylor, MD',
      doctorNpi: '1849102941',
    },
  ]);

  // Order state initialized with mock order
  const [order, setOrder] = useState<Order>(mockInitialOrder);

  // Computed active offers for the selected drug
  const activeOffers = React.useMemo(() => getOffersForDrug(selectedDrug), [selectedDrug]);

  // Cart Handlers
  const handleAddToCart = (offer: DrugOffer, drugToUse?: Drug) => {
    const drug = drugToUse || mockDrugs.find((d) => d.id === offer.drugId) || selectedDrug;
    const existingIndex = cart.findIndex((item) => item.offer.id === offer.id);
    if (existingIndex > -1) {
      setCart((prev) =>
        prev.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart((prev) => [
        ...prev,
        {
          drug,
          offer,
          quantity: 1,
          prescriptionNumber: 'RX-' + Math.floor(10000 + Math.random() * 90000),
          doctorName: 'Dr. Sarah Smith, MD',
          doctorNpi: '1982739102',
        },
      ]);
    }
  };

  const handleUpdateQuantity = (drugId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(drugId);
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.drug.id === drugId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleRemoveFromCart = (drugId: string) => {
    setCart((prev) => prev.filter((item) => item.drug.id !== drugId));
  };

  const isOfferInCart = (offerId: string) => {
    return cart.some((item) => item.offer.id === offerId);
  };

  // Quick Refill Handler
  const handleQuickRefill = (drug: Drug) => {
    setSelectedDrug(drug);
    const offers = getOffersForDrug(drug);
    const bestOffer = offers[0] || mockMetforminOffers[0];
    handleAddToCart(bestOffer, drug);
    setPatientTab('cart');
  };

  // Drug selection from explore
  const handleSelectDrug = (drug: Drug) => {
    setSelectedDrug(drug);
    setPatientTab('compare');
  };

  // Checkout Handler
  const handleCheckout = () => {
    const subtotal = cart.reduce((acc, item) => acc + item.offer.price * item.quantity, 0);
    const retailValue = cart.reduce((acc, item) => acc + item.offer.retailPrice * item.quantity, 0);
    const newOrder: Order = {
      id: 'ord-' + Math.floor(10000 + Math.random() * 90000),
      orderNumber: 'GM-' + Math.floor(80000 + Math.random() * 10000),
      date: 'Today',
      time: 'Just now',
      status: 'out_for_delivery',
      patientName: 'Marcus Vance',
      patientPhone: '(555) 892-3401',
      deliveryAddress: '742 Evergreen Terrace, Springfield, IL 62704',
      store: cart[0]?.offer.store || mockStores[0],
      items: cart.map((item) => ({
        drugName: item.drug.name,
        strength: item.drug.strength,
        quantity: item.drug.standardQuantity * item.quantity,
        unitPrice: item.offer.price,
        totalPrice: item.offer.price * item.quantity,
        prescriptionNumber: item.prescriptionNumber,
        doctorName: item.doctorName,
      })),
      subtotal,
      retailValue,
      savings: retailValue - subtotal,
      dispensingFee: 1.20,
      deliveryFee: 0.00,
      total: subtotal + 1.20,
      paymentMethod: 'Apple Pay (•••• 4242)',
      rfidSealNumber: 'SEAL-' + Math.floor(1000 + Math.random() * 9000) + '-A',
      isTamperProofVerified: true,
      courierName: 'Leo Gonzalez',
      courierVehicle: 'Silver Toyota Prius (Plate: 7XYZ89)',
      courierRating: 4.96,
      courierDeliveriesCount: 1420,
      estimatedArrival: 'Today in ~25 mins',
      trackingStep: 4,
    };

    setOrder(newOrder);
    setCart([]);
    setPatientTab('orders');

    // Asynchronous synchronization with Phase 2 Express API
    submitOrderCheckout({
      cart,
      fulfillmentMethod: 'delivery',
      deliveryAddress: '742 Evergreen Terrace, Springfield, IL 62704',
      selectedStoreId: cart[0]?.offer.storeId,
    }).catch((e) => console.warn('Background sync order checkout:', e));
  };

  // Navigate to dispute desk from tracking
  const handleOpenDispute = () => {
    setViewMode('enterprise');
    setEnterpriseTab('disputes');
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Application Navbar */}
      <Navigation
        viewMode={viewMode}
        setViewMode={setViewMode}
        patientTab={patientTab}
        setPatientTab={setPatientTab}
        enterpriseTab={enterpriseTab}
        setEnterpriseTab={setEnterpriseTab}
        cartCount={totalCartCount}
        hasActiveOrder={order !== null}
        isMobileFrame={isMobileFrame}
        setIsMobileFrame={setIsMobileFrame}
      />

      {/* Mode 1: Patient App */}
      {viewMode === 'patient' && (
        <div className="flex-1 py-4 sm:py-6 px-2 sm:px-4 flex justify-center items-start">
          {/* Container: either Phone Mockup Frame or Fluid Full-Width Container */}
          <div
            className={`w-full transition-all duration-300 ${
              isMobileFrame
                ? 'max-w-[440px] bg-slate-900 rounded-[44px] p-3 shadow-2xl ring-1 ring-slate-800/80 border-[8px] border-slate-950'
                : 'max-w-4xl bg-transparent'
            }`}
          >
            {/* Screen Inner Wrapper */}
            <div
              className={`w-full bg-slate-50 relative flex flex-col ${
                isMobileFrame
                  ? 'rounded-[36px] overflow-hidden min-h-[820px] max-h-[880px]'
                  : 'rounded-2xl border border-slate-200 shadow-xs'
              }`}
            >
              {/* Phone Status Bar (Simulated on Mobile Frame) */}
              {isMobileFrame && (
                <div className="bg-slate-50 pt-2 px-6 pb-1 flex items-center justify-between text-xs font-semibold text-slate-800 select-none z-30 shrink-0">
                  <span className="font-bold text-[11px]">9:41</span>
                  {/* Dynamic Island pill */}
                  <div className="w-24 h-4 bg-slate-950 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-slate-800 mr-2"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/80"></div>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-700">
                    <Signal className="w-3 h-3" />
                    <Wifi className="w-3 h-3" />
                    <Battery className="w-3.5 h-3.5" />
                  </div>
                </div>
              )}

              {/* Scrollable Screen Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 scrollbar-thin">
                {patientTab === 'explore' && (
                  <ExploreView
                    drugs={mockDrugs}
                    onSelectDrug={handleSelectDrug}
                    onOpenUploadModal={() => setIsUploadModalOpen(true)}
                    onQuickRefill={handleQuickRefill}
                  />
                )}

                {patientTab === 'compare' && (
                  <CompareView
                    drug={selectedDrug}
                    offers={activeOffers}
                    onBack={() => setPatientTab('explore')}
                    onAddToCart={handleAddToCart}
                    isOfferInCart={isOfferInCart}
                  />
                )}

                {patientTab === 'cart' && (
                  <CartView
                    items={cart}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveFromCart}
                    onCheckout={handleCheckout}
                    onContinueShopping={() => setPatientTab('explore')}
                  />
                )}

                {patientTab === 'orders' && (
                  <OrderTrackingView
                    order={order}
                    onOpenDispute={handleOpenDispute}
                    onSwitchToEnterpriseDisputes={handleOpenDispute}
                  />
                )}
              </div>

              {/* Fixed Bottom Mobile Navigation Bar */}
              <div className="sticky bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2 px-3 z-30 flex items-center justify-around text-xs select-none">
                <button
                  onClick={() => setPatientTab('explore')}
                  className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
                    patientTab === 'explore'
                      ? 'text-blue-600 font-bold scale-105'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Search className="w-4 h-4 mb-0.5" />
                  <span className="text-[10px]">Explore</span>
                </button>

                <button
                  onClick={() => setPatientTab('compare')}
                  className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
                    patientTab === 'compare'
                      ? 'text-blue-600 font-bold scale-105'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <GitCompare className="w-4 h-4 mb-0.5" />
                  <span className="text-[10px]">Compare</span>
                </button>

                <button
                  onClick={() => setPatientTab('cart')}
                  className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all relative ${
                    patientTab === 'cart'
                      ? 'text-blue-600 font-bold scale-105'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <div className="relative">
                    <ShoppingCart className="w-4 h-4 mb-0.5" />
                    {totalCartCount > 0 && (
                      <span className="absolute -top-1.5 -right-2 bg-emerald-600 text-white font-bold text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                        {totalCartCount}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px]">Cart</span>
                </button>

                <button
                  onClick={() => setPatientTab('orders')}
                  className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all relative ${
                    patientTab === 'orders'
                      ? 'text-blue-600 font-bold scale-105'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <div className="relative">
                    <Clock className="w-4 h-4 mb-0.5" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
                  </div>
                  <span className="text-[10px]">Tracking</span>
                </button>
              </div>

              {/* Simulated Home Indicator bar on mobile frame */}
              {isMobileFrame && (
                <div className="bg-white py-1 flex justify-center z-30 shrink-0">
                  <div className="w-32 h-1 bg-slate-300 rounded-full"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Enterprise & Pharmacy Operations Portal */}
      {viewMode === 'enterprise' && (
        <EnterpriseLayout
          activeTab={enterpriseTab}
          setActiveTab={setEnterpriseTab}
        >
          {enterpriseTab === 'dashboard' && (
            <DashboardView
              onNavigateToCatalog={() => setEnterpriseTab('catalog')}
              onNavigateToDisputes={() => setEnterpriseTab('disputes')}
              onNavigateToStoreOps={() => setEnterpriseTab('store_ops')}
            />
          )}

          {enterpriseTab === 'catalog' && (
            <CanonicalCatalogView drugs={mockDrugs} />
          )}

          {enterpriseTab === 'store_ops' && (
            <StoreOperationsView activeOrder={order} />
          )}

          {enterpriseTab === 'disputes' && <DisputeResolutionView />}

          {enterpriseTab === 'api_partners' && <ApiPartnersView />}

          {enterpriseTab === 'architecture' && <ArchitectureView />}
        </EnterpriseLayout>
      )}

      {/* Prescription Upload / OCR Modal */}
      <PrescriptionUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSelectDrug={handleSelectDrug}
        availableDrugs={mockDrugs}
      />
    </div>
  );
}
