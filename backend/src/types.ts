export type ViewMode = 'patient' | 'enterprise';

export type PatientTab = 'explore' | 'compare' | 'cart' | 'orders';

export type EnterpriseTab = 'dashboard' | 'catalog' | 'store_ops' | 'disputes' | 'api_partners' | 'architecture';

export interface PharmacyStore {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  rating: number;
  reviewCount: number;
  distanceMiles: number;
  isVerifiedHub: boolean;
  hasDriveThru: boolean;
  hasCurbside: boolean;
  fulfillmentTime: string;
  slaScore: number;
  phone: string;
  isChain: boolean;
  chainName?: string;
}

export interface DrugOffer {
  id: string;
  drugId: string;
  storeId: string;
  store: PharmacyStore;
  price: number;
  retailPrice: number;
  stockCount: number;
  inStock: boolean;
  packaging: string;
  deliveryOption: 'same_day' | 'next_day' | 'pickup_only';
  deliveryFee: number;
  isLowestPrice?: boolean;
  isBestMatch?: boolean;
  updatedSecondsAgo: number;
}

export interface Drug {
  id: string;
  name: string;
  genericName: string;
  strength: string;
  form: string;
  dosageUnit: string;
  standardQuantity: number;
  brandEquivalent: string;
  molecularFormula: string;
  clinicalSalt: string;
  therapeuticClass: string;
  category: 'Diabetes' | 'Cardiac Care' | 'Antibiotics' | 'Pain Relief' | 'Thyroid' | 'Respiratory' | 'Mental Health';
  rxNormCode: string;
  ndcCode: string;
  fdaTeCode: string; // e.g. AB1, AB2, AA
  fdaApprovalDate: string;
  lowestPrice: number;
  medianPrice: number;
  maxRetailPrice: number;
  availableSellersCount: number;
  prescriptionRequired: boolean;
  description: string;
  clinicalEquivalencyNote: string;
  imageUrl?: string;
}

export interface CartItem {
  drug: Drug;
  offer: DrugOffer;
  quantity: number;
  prescriptionNumber: string;
  doctorName: string;
  doctorNpi: string;
}

export interface OrderItem {
  drugName: string;
  strength: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  prescriptionNumber: string;
  doctorName: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  time: string;
  status: 'placed' | 'store_accepted' | 'dispensed' | 'out_for_delivery' | 'delivered' | 'disputed';
  patientName: string;
  patientPhone: string;
  deliveryAddress: string;
  store: PharmacyStore;
  items: OrderItem[];
  subtotal: number;
  retailValue: number;
  savings: number;
  dispensingFee: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  rfidSealNumber: string;
  isTamperProofVerified: boolean;
  courierName: string;
  courierVehicle: string;
  courierRating: number;
  courierDeliveriesCount: number;
  estimatedArrival: string;
  trackingStep: number;
}

export interface DisputeCase {
  id: string;
  caseNumber: string;
  orderId: string;
  orderNumber: string;
  status: 'pending_review' | 'escrow_frozen' | 'resolved_refunded' | 'resolved_replaced' | 'claim_rejected';
  severity: 'P0_CRITICAL' | 'P1_HIGH' | 'P2_NORMAL';
  patientName: string;
  patientPhone: string;
  patientTrustScore: number;
  patientPastOrders: number;
  storeName: string;
  storeId: string;
  courierName: string;
  courierId: string;
  category: 'Tamper Seal Violation' | 'Dosage Discrepancy' | 'Missing Item' | 'Late Delivery' | 'Damaged Package';
  openedAt: string;
  disputedAmount: number;
  description: string;
  forensicPhotoUrl: string;
  rfidDispatchedTime: string;
  courierHandoverTime: string;
  customerReceivedTime: string;
  weightAtStoreGrams: number;
  weightAtCustomerGrams: number;
  resolutionNotes?: string;
  resolvedAt?: string;
}

export interface SystemMetric {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtext: string;
  icon: string;
}

export interface MicroserviceHealth {
  name: string;
  service: string;
  uptime: string;
  latencyMs: number;
  status: 'nominal' | 'warning' | 'degraded';
  metric: string;
}

export interface FlaggedFeedAlert {
  id: string;
  storeName: string;
  drugName: string;
  anomalyType: 'PRICE_SPIKE_80%' | 'STALE_FEED_>30M' | 'OUT_OF_STOCK_DRIFT' | 'UNMATCHED_NDC';
  severity: 'high' | 'medium' | 'critical';
  oldPrice: number;
  newPrice: number;
  timestamp: string;
  actionRequired: string;
}
