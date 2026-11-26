export interface Product {
  id: string;
  title: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isLimitedOffer?: boolean;
  freeDelivery: boolean;
  deliveryEstimate: string;
  image: string;
  gallery: string[];
  description: string;
  highlights: string[];
  specs: Record<string, string>;
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  storage?: string[];
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  image: string;
  subcategories: string[];
  productCount: number;
  featuredBrands?: string[];
  status?: 'Active' | 'Hidden';
}

export interface Brand {
  id: string;
  name: string;
  category: string;
  origin: string;
  productCount: number;
  featured: boolean;
  status: 'Active' | 'Inactive';
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  selectedStorage?: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  type: 'Home' | 'Work';
  isDefault: boolean;
}

export interface TrackingStep {
  status: string;
  date: string;
  completed: boolean;
  description: string;
}

export type OrderStatus =
  | 'Order Placed'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned'
  | 'Refund Initiated'
  | 'Refunded';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponDiscount: number;
  shipping: number;
  tax: number;
  totalAmount: number;
  deliveryAddress: Address;
  deliverySpeed: 'Standard' | 'Express' | 'Scheduled';
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  status: OrderStatus;
  trackingSteps: TrackingStep[];
  estimatedDelivery: string;
}

export interface Coupon {
  code: string;
  title: string;
  discountPercent?: number;
  flatDiscount?: number;
  maxDiscount?: number;
  minSpend: number;
  expiryDate: string;
  description: string;
  terms: string;
  category?: string;
  active?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  productTitle?: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  status?: 'Approved' | 'Pending' | 'Hidden';
  adminReply?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'order' | 'shipping' | 'offer' | 'price_drop' | 'stock';
  read: boolean;
  link?: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  orderNumber?: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  date: string;
  messages: { sender: 'user' | 'support'; text: string; time: string }[];
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  memberSince: string;
  tier: 'Diamond VIP' | 'Gold' | 'Standard';
  role?: 'customer' | 'admin';
  savedCardPreview?: string;
}

export interface RegisteredUser extends UserProfile {
  id: string;
  password: string;
  role: 'customer' | 'admin';
  totalOrders: number;
  totalSpent: number;
  status: 'Active' | 'Blocked';
}

export interface ReturnRequest {
  id: string;
  orderNumber: string;
  customerName: string;
  productTitle: string;
  reason: string;
  amount: number;
  requestedDate: string;
  status: 'Requested' | 'Pickup Scheduled' | 'Refund Initiated' | 'Refunded' | 'Rejected';
}

export interface PaymentTransaction {
  id: string;
  txnId: string;
  orderNumber: string;
  customerName: string;
  method: 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'COD';
  amount: number;
  date: string;
  status: 'Captured' | 'Pending' | 'Refunded' | 'Failed';
}

export interface DeliveryCarrier {
  id: string;
  name: string;
  serviceType: string;
  avgDeliveryDays: string;
  activeShipments: number;
  onTimeRate: string;
  status: 'Active' | 'Paused';
}

export interface OfferCampaign {
  id: string;
  title: string;
  type: 'Flash Sale' | 'Festival Gala' | 'Bank Offer' | 'BOGO';
  discountLabel: string;
  validUntil: string;
  active: boolean;
}

export interface StoreSettings {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  gstRate: number;
  freeShippingThreshold: number;
  enableCod: boolean;
  enableGuestCheckout: boolean;
  maintenanceMode: boolean;
}
