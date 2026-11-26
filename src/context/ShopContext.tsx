import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  Brand,
  CartItem,
  Address,
  Order,
  OrderStatus,
  Coupon,
  NotificationItem,
  UserProfile,
  RegisteredUser,
  Review,
  ReturnRequest,
  PaymentTransaction,
  DeliveryCarrier,
  OfferCampaign,
  StoreSettings,
} from '../types';
import { products as initialProducts } from '../data/products';
import { categories as initialCategories } from '../data/categories';
import { fetchCategoriesMaster } from '../services/categoryService';
import { heroBanners as initialBanners, BannerSlide } from '../data/banners';
import { coupons as initialCoupons } from '../data/coupons';
import { mockOrders as initialOrders } from '../data/mockOrders';
import { mockNotifications as initialNotifications } from '../data/mockNotifications';
import {
  initialBrands,
  initialRegisteredUsers,
  initialAdminReviews,
  initialReturnRequests,
  initialTransactions,
  initialCarriers,
  initialOfferCampaigns,
  defaultStoreSettings,
} from '../data/adminMockData';

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface ShopContextType {
  // Navigation & Route State
  activeRoute: string;
  routeParams: Record<string, string>;
  navigate: (route: string, params?: Record<string, string>) => void;

  // Authentication & Session
  authUser: RegisteredUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  registeredUsers: RegisteredUser[];
  signIn: (emailOrPhone: string, password?: string) => { success: boolean; message: string; user?: RegisteredUser };
  signUp: (data: { name: string; email: string; phone: string; password: string }) => { success: boolean; message: string };
  quickDemoLogin: (role: 'customer' | 'admin') => void;
  signOut: () => void;

  // Products & Categories & Banners (Shared between Storefront & Admin)
  allProducts: Product[];
  categoriesList: Category[];
  refreshCategories: (companyCode?: string) => Promise<void>;
  brandsList: Brand[];
  bannersList: BannerSlide[];
  recentlyViewed: Product[];
  addRecentlyViewed: (product: Product) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Cart
  cart: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    color?: string,
    size?: string,
    storage?: string
  ) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  savedForLater: CartItem[];
  saveForLater: (productId: string) => void;
  moveToCartFromSaved: (item: CartItem) => void;
  cartTotalCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartCouponDiscount: number;
  cartTax: number;
  cartShipping: number;
  cartGrandTotal: number;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;

  // Compare
  comparedProducts: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;

  // Coupons
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  couponsList: Coupon[];

  // Addresses
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (address: Address) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  selectedAddressId: string;
  setSelectedAddressId: (id: string) => void;

  // Orders
  orders: Order[];
  placeOrder: (
    speed: 'Standard' | 'Express' | 'Scheduled',
    paymentMethod: string
  ) => Order | null;
  cancelOrder: (orderId: string) => void;
  returnOrder: (orderId: string) => void;
  adminUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // User & Profile
  userProfile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;

  // Search & Global Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  selectedCategorySlug: string | null;
  setSelectedCategorySlug: (slug: string | null) => void;

  // Toasts
  toasts: Toast[];
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;

  // Theme & Currency
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currency: 'INR' | 'USD';
  toggleCurrency: () => void;
  formatPrice: (amount: number) => string;

  // Admin Full-Fledged CRUD & Store Operations
  adminAddProduct: (product: Omit<Product, 'id'>) => void;
  adminUpdateProduct: (product: Product) => void;
  adminDeleteProduct: (productId: string) => void;
  adminAddCategory: (category: Omit<Category, 'id'>) => void;
  adminUpdateCategory: (category: Category) => void;
  adminDeleteCategory: (id: string) => void;
  adminAddBrand: (brand: Omit<Brand, 'id'>) => void;
  adminToggleBrandStatus: (id: string) => void;
  adminDeleteBrand: (id: string) => void;
  adminAddCoupon: (coupon: Coupon) => void;
  adminToggleCoupon: (code: string) => void;
  adminDeleteCoupon: (code: string) => void;
  adminAddBanner: (banner: Omit<BannerSlide, 'id'>) => void;
  adminDeleteBanner: (id: string) => void;
  adminUpdateUserStatus: (userId: string, status: 'Active' | 'Blocked') => void;
  adminUpdateUserTier: (userId: string, tier: 'Diamond VIP' | 'Gold' | 'Standard') => void;
  adminReviews: Review[];
  adminModerateReview: (id: string, status: 'Approved' | 'Pending' | 'Hidden', reply?: string) => void;
  adminDeleteReview: (id: string) => void;
  returnRequests: ReturnRequest[];
  adminUpdateReturnStatus: (id: string, status: ReturnRequest['status']) => void;
  transactions: PaymentTransaction[];
  deliveryCarriers: DeliveryCarrier[];
  adminToggleCarrierStatus: (id: string) => void;
  offerCampaigns: OfferCampaign[];
  adminAddOfferCampaign: (campaign: Omit<OfferCampaign, 'id'>) => void;
  adminToggleOfferCampaign: (id: string) => void;
  storeSettings: StoreSettings;
  adminUpdateStoreSettings: (settings: StoreSettings) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const DEFAULT_ADDRESSES: Address[] = [
  {
    id: 'addr-default',
    name: 'Vikramaditya Roy',
    phone: '+91 98201 54321',
    addressLine: 'Penthouse 1802, The Imperial Towers',
    locality: 'Altamount Road, Cumballa Hill',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400026',
    type: 'Home',
    isDefault: true,
  },
  {
    id: 'addr-work',
    name: 'Vikramaditya Roy',
    phone: '+91 98201 54321',
    addressLine: 'Floor 14, One World Center, Tower 2',
    locality: 'Senapati Bapat Marg, Lower Parel',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400013',
    type: 'Work',
    isDefault: false,
  },
];

const GUEST_USER_FALLBACK: UserProfile = {
  name: 'Guest Shopper',
  email: 'guest@aura.in',
  phone: '',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  memberSince: 'Visitor',
  tier: 'Standard',
  role: 'customer',
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activeRoute, setActiveRoute] = useState<string>('home');
  const [routeParams, setRouteParams] = useState<Record<string, string>>({});

  const navigate = (route: string, params: Record<string, string> = {}) => {
    setActiveRoute(route);
    setRouteParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.location.hash = route;
    } catch {
      // ignore in iframe
    }
  };

  // Registered Users & Authentication
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() => {
    try {
      const saved = localStorage.getItem('aura_users_db');
      return saved ? JSON.parse(saved) : initialRegisteredUsers;
    } catch {
      return initialRegisteredUsers;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('aura_users_db', JSON.stringify(registeredUsers));
    } catch {
      // ignore
    }
  }, [registeredUsers]);

  const [authUser, setAuthUser] = useState<RegisteredUser | null>(() => {
    try {
      const savedSession = localStorage.getItem('aura_auth_session');
      if (savedSession === 'null') return null;
      return savedSession ? JSON.parse(savedSession) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('aura_auth_session', JSON.stringify(authUser));
    } catch {
      // ignore
    }
  }, [authUser]);

  const isAuthenticated = Boolean(authUser);
  const isAdmin = authUser?.role === 'admin';

  // Store Settings
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('aura_store_settings');
      return saved ? JSON.parse(saved) : defaultStoreSettings;
    } catch {
      return defaultStoreSettings;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('aura_store_settings', JSON.stringify(storeSettings));
    } catch {
      // ignore
    }
  }, [storeSettings]);

  // Products, Categories, Brands, Banners
  const [allProducts, setAllProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('aura_products');
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('aura_products', JSON.stringify(allProducts));
    } catch {
      // ignore
    }
  }, [allProducts]);

  const [categoriesList, setCategoriesList] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('aura_categories');
      return saved ? JSON.parse(saved) : initialCategories.map((c) => ({ ...c, status: 'Active' }));
    } catch {
      return initialCategories.map((c) => ({ ...c, status: 'Active' }));
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('aura_categories', JSON.stringify(categoriesList));
    } catch {
      // ignore
    }
  }, [categoriesList]);

  const refreshCategories = async (companyCode?: string) => {
    const targetCompanyCode =
      companyCode ||
      (storeSettings as { companyCode?: string; company_code?: string }).companyCode ||
      (storeSettings as { companyCode?: string; company_code?: string }).company_code ||
      'YJKT'; 

    try {
      const apiCategories = await fetchCategoriesMaster(targetCompanyCode);
      if (apiCategories.length > 0) {
        setCategoriesList(apiCategories);
      }
    } catch (err) {
      console.error('Error fetching categories master:', err);
    }
  };

  useEffect(() => {
    refreshCategories();
  }, []);

  const [brandsList, setBrandsList] = useState<Brand[]>(() => {
    try {
      const saved = localStorage.getItem('aura_brands');
      return saved ? JSON.parse(saved) : initialBrands;
    } catch {
      return initialBrands;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('aura_brands', JSON.stringify(brandsList));
    } catch {
      // ignore
    }
  }, [brandsList]);

  const [bannersList, setBannersList] = useState<BannerSlide[]>(() => {
    try {
      const saved = localStorage.getItem('aura_banners');
      return saved ? JSON.parse(saved) : initialBanners;
    } catch {
      return initialBanners;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('aura_banners', JSON.stringify(bannersList));
    } catch {
      // ignore
    }
  }, [bannersList]);

  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const addRecentlyViewed = (product: Product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 10);
    });
  };

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aura_cart');
      return saved ? JSON.parse(saved) : [
        { product: initialProducts[0], quantity: 1, selectedColor: 'Natural Titanium', selectedStorage: '256GB' },
      ];
    } catch {
      return [];
    }
  });

  const [savedForLater, setSavedForLater] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem('aura_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  const addToCart = (
    product: Product,
    quantity = 1,
    color?: string,
    size?: string,
    storage?: string
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === (color || product.colors?.[0]?.name) &&
          item.selectedSize === (size || product.sizes?.[0]) &&
          item.selectedStorage === (storage || product.storage?.[0])
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [
        ...prev,
        {
          product,
          quantity,
          selectedColor: color || product.colors?.[0]?.name,
          selectedSize: size || product.sizes?.[0],
          selectedStorage: storage || product.storage?.[0],
        },
      ];
    });

    showToast('Added to Cart', `${product.title.slice(0, 32)}... added to your bag`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Removed from Cart', 'Item removed from your shopping bag', 'info');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const saveForLater = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    if (item) {
      setSavedForLater((prev) => [...prev, item]);
      setCart((prev) => prev.filter((i) => i.product.id !== productId));
      showToast('Saved for Later', 'Moved to saved items', 'info');
    }
  };

  const moveToCartFromSaved = (item: CartItem) => {
    setSavedForLater((prev) => prev.filter((i) => i.product.id !== item.product.id));
    setCart((prev) => [...prev, item]);
    showToast('Restored to Cart', 'Item returned to shopping cart', 'success');
  };

  // Coupons
  const [couponsList, setCouponsList] = useState<Coupon[]>(() =>
    initialCoupons.map((c) => ({ ...c, active: true }))
  );
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => initialCoupons[0]);

  const applyCoupon = (code: string) => {
    const found = couponsList.find(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.active !== false
    );
    if (!found) {
      showToast('Invalid Coupon', `Code "${code}" is not valid or currently paused`, 'error');
      return { success: false, message: 'Invalid or expired promotional coupon code.' };
    }
    setAppliedCoupon(found);
    showToast('Coupon Applied!', `${found.code} applied: ${found.title}`, 'success');
    return { success: true, message: `Applied ${found.code}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon Removed', 'Promotional discount removed', 'info');
  };

  // Cart Totals Calculation using dynamic store settings
  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.originalPrice * item.quantity, 0);
  const cartProductPriceSum = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartDiscount = cartSubtotal - cartProductPriceSum;

  let cartCouponDiscount = 0;
  if (appliedCoupon && cartProductPriceSum >= appliedCoupon.minSpend) {
    if (appliedCoupon.flatDiscount) {
      cartCouponDiscount = appliedCoupon.flatDiscount;
    } else if (appliedCoupon.discountPercent) {
      const calculated = (cartProductPriceSum * appliedCoupon.discountPercent) / 100;
      cartCouponDiscount = appliedCoupon.maxDiscount
        ? Math.min(calculated, appliedCoupon.maxDiscount)
        : calculated;
    }
  }

  const cartShipping =
    cartProductPriceSum > storeSettings.freeShippingThreshold || cart.length === 0 ? 0 : 199;
  const taxableAmount = Math.max(0, cartProductPriceSum - cartCouponDiscount);
  const cartTax = Math.round(taxableAmount * (storeSettings.gstRate / 100));
  const cartGrandTotal = taxableAmount + cartTax + cartShipping;

  // Wishlist
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('aura_wishlist');
      return saved ? JSON.parse(saved) : [initialProducts[1], initialProducts[7]];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('aura_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast('Removed from Wishlist', product.title.slice(0, 30) + '...', 'info');
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast('Saved to Wishlist', product.title.slice(0, 30) + '...', 'success');
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.some((p) => p.id === productId);

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  // Compare
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);

  const addToCompare = (product: Product) => {
    if (comparedProducts.length >= 4) {
      showToast('Compare Limit', 'You can compare a maximum of 4 products simultaneously', 'error');
      return;
    }
    if (comparedProducts.some((p) => p.id === product.id)) {
      removeFromCompare(product.id);
      return;
    }
    setComparedProducts((prev) => [...prev, product]);
    showToast('Added to Compare', `${product.title.slice(0, 24)} added to comparison`, 'info');
  };

  const removeFromCompare = (productId: string) => {
    setComparedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const isInCompare = (productId: string) =>
    comparedProducts.some((p) => p.id === productId);

  const clearCompare = () => setComparedProducts([]);

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>(() => {
    try {
      const saved = localStorage.getItem('aura_addresses');
      return saved ? JSON.parse(saved) : DEFAULT_ADDRESSES;
    } catch {
      return DEFAULT_ADDRESSES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('aura_addresses', JSON.stringify(addresses));
    } catch {
      // ignore
    }
  }, [addresses]);

  const [selectedAddressId, setSelectedAddressId] = useState<string>('addr-default');

  const addAddress = (newAddr: Omit<Address, 'id'>) => {
    const id = 'addr-' + Date.now();
    const created: Address = { ...newAddr, id };
    if (created.isDefault) {
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: false })).concat(created));
      setSelectedAddressId(id);
    } else {
      setAddresses((prev) => [...prev, created]);
      setSelectedAddressId(id);
    }
    showToast('Address Saved', 'New delivery destination registered', 'success');
  };

  const updateAddress = (updated: Address) => {
    setAddresses((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
    showToast('Address Updated', 'Delivery details updated successfully', 'success');
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    showToast('Address Removed', 'Saved address deleted', 'info');
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
    setSelectedAddressId(id);
  };

  // Orders & Transactions
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('aura_orders');
      return saved ? JSON.parse(saved) : initialOrders;
    } catch {
      return initialOrders;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('aura_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  const [transactions, setTransactions] = useState<PaymentTransaction[]>(initialTransactions);

  const placeOrder = (
    speed: 'Standard' | 'Express' | 'Scheduled',
    paymentMethod: string
  ): Order | null => {
    if (cart.length === 0) return null;

    const deliveryAddress =
      addresses.find((a) => a.id === selectedAddressId) || addresses[0] || DEFAULT_ADDRESSES[0];

    const orderNumber = `AURA-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const isCod = paymentMethod.toLowerCase().includes('cash');

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      items: [...cart],
      subtotal: cartSubtotal,
      discount: cartDiscount,
      couponDiscount: cartCouponDiscount,
      shipping: cartShipping,
      tax: cartTax,
      totalAmount: cartGrandTotal,
      deliveryAddress,
      deliverySpeed: speed,
      paymentMethod,
      paymentStatus: isCod ? 'Pending' : 'Paid',
      status: 'Order Placed',
      estimatedDelivery:
        speed === 'Express' ? 'Tomorrow by 1:00 PM' : 'In 2–3 Business Days',
      trackingSteps: [
        {
          status: 'Order Placed',
          date: 'Just Now',
          completed: true,
          description: `Order authorized via ${paymentMethod}. Confirmation sent to email.`,
        },
        {
          status: 'Confirmed & Payment Verified',
          date: 'Immediate',
          completed: true,
          description: 'Order verified by AURA security engine.',
        },
        {
          status: 'Packing at Hub',
          date: 'Scheduled in 2 hours',
          completed: false,
          description: 'Item reservation and tamper-evident packaging in progress.',
        },
        {
          status: 'Dispatched via Premium Logistics',
          date: 'Tomorrow morning',
          completed: false,
          description: 'Will be assigned to express transit carrier.',
        },
        {
          status: 'Delivered',
          date: speed === 'Express' ? 'Tomorrow' : 'In 2-3 Days',
          completed: false,
          description: 'Digital OTP verification at doorstep.',
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Record transaction in Admin Payment Ledger
    const methodShort: PaymentTransaction['method'] = paymentMethod.includes('UPI')
      ? 'UPI'
      : paymentMethod.includes('Net')
        ? 'Net Banking'
        : paymentMethod.includes('Cash')
          ? 'COD'
          : 'Credit Card';

    setTransactions((prev) => [
      {
        id: 'pay-' + Date.now(),
        txnId: `TXN_${Math.floor(1000000 + Math.random() * 9000000)}`,
        orderNumber,
        customerName: authUser?.name || deliveryAddress.name,
        method: methodShort,
        amount: cartGrandTotal,
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        status: isCod ? 'Pending' : 'Captured',
      },
      ...prev,
    ]);

    clearCart();

    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: 'Order Placed Successfully',
      message: `Your order ${orderNumber} for ₹${newOrder.totalAmount.toLocaleString()} has been placed.`,
      date: 'Just now',
      type: 'order',
      read: false,
      link: 'orders',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newOrder;
  };

  const cancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
            ...o,
            status: 'Cancelled',
            paymentStatus: 'Refunded',
            trackingSteps: [
              ...o.trackingSteps,
              {
                status: 'Order Cancelled',
                date: 'Just Now',
                completed: true,
                description: 'Order cancelled by customer. 100% refund initiated to source payment.',
              },
            ],
          }
          : o
      )
    );
    showToast('Order Cancelled', 'Refund initiated to your payment instrument', 'info');
  };

  const returnOrder = (orderId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
            ...o,
            status: 'Returned',
            trackingSteps: [
              ...o.trackingSteps,
              {
                status: 'Return Scheduled',
                date: 'Just Now',
                completed: true,
                description: 'Technician pickup scheduled for inspection and doorstep collection.',
              },
            ],
          }
          : o
      )
    );
    if (targetOrder) {
      setReturnRequests((prev) => [
        {
          id: 'ret-' + Date.now(),
          orderNumber: targetOrder.orderNumber,
          customerName: targetOrder.deliveryAddress.name,
          productTitle: targetOrder.items[0]?.product.title || 'Order Items',
          reason: 'Customer requested return via My Orders portal',
          amount: targetOrder.totalAmount,
          requestedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          status: 'Requested',
        },
        ...prev,
      ]);
    }
    showToast('Return Initiated', 'Doorstep pickup agent will inspect package', 'info');
  };

  const adminUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
            ...o,
            status,
            paymentStatus: status === 'Refunded' ? 'Refunded' : o.paymentStatus,
            trackingSteps: [
              ...o.trackingSteps,
              {
                status,
                date: 'Updated by Admin',
                completed: true,
                description: `Order status transitioned to "${status}" from Admin Operations Console.`,
              },
            ],
          }
          : o
      )
    );
    showToast('Order Status Updated', `Order marked as ${status}`, 'success');
  };

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('aura_notifications');
      return saved ? JSON.parse(saved) : initialNotifications;
    } catch {
      return initialNotifications;
    }
  });

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('Notifications Marked', 'All messages cleared as read', 'info');
  };

  // Authentication Handlers
  const signIn = (emailOrPhone: string, password?: string) => {
    const query = emailOrPhone.trim().toLowerCase();
    const user = registeredUsers.find(
      (u) => u.email.toLowerCase() === query || u.phone.replace(/\s+/g, '') === query.replace(/\s+/g, '')
    );

    if (!user) {
      showToast('Account Not Found', 'No registered account found with these credentials', 'error');
      return { success: false, message: 'No account found. Please check your email or Sign Up as a new user.' };
    }

    if (user.status === 'Blocked') {
      showToast('Account Suspended', 'Please contact AURA Concierge support', 'error');
      return { success: false, message: 'This account has been temporarily suspended by Admin.' };
    }

    if (password !== undefined && user.password !== password) {
      showToast('Incorrect Password', 'Please verify your password and try again', 'error');
      return { success: false, message: 'Incorrect password. Demo password is "password123" (or "admin123" for Admin).' };
    }

    setAuthUser(user);
    showToast('Welcome Back!', `Signed in as ${user.name} (${user.role === 'admin' ? 'Admin Executive' : user.tier})`, 'success');
    return { success: true, message: 'Signed in successfully', user };
  };

  const signUp = (data: { name: string; email: string; phone: string; password: string }) => {
    const exists = registeredUsers.some((u) => u.email.toLowerCase() === data.email.trim().toLowerCase());
    if (exists) {
      showToast('Email Already Registered', 'Please sign in to your existing account', 'error');
      return { success: false, message: 'An account with this email already exists. Please Sign In.' };
    }

    const newUser: RegisteredUser = {
      id: 'usr-' + Date.now(),
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      password: data.password,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      memberSince: 'November 2026 (New Member)',
      tier: 'Standard',
      role: 'customer',
      totalOrders: 0,
      totalSpent: 0,
      status: 'Active',
    };

    setRegisteredUsers((prev) => [newUser, ...prev]);
    setAuthUser(newUser);
    // Apply welcome coupon AURA10 for 1st-time user
    const welcomeCoupon = couponsList.find((c) => c.code === 'AURA10');
    if (welcomeCoupon) setAppliedCoupon(welcomeCoupon);

    showToast('Account Created!', `Welcome ${newUser.name}! Welcome coupon AURA10 unlocked.`, 'success');
    return { success: true, message: 'Account created successfully' };
  };

  const quickDemoLogin = (role: 'customer' | 'admin') => {
    const target =
      role === 'admin'
        ? registeredUsers.find((u) => u.role === 'admin') || initialRegisteredUsers[1]
        : registeredUsers.find((u) => u.role === 'customer') || initialRegisteredUsers[0];

    setAuthUser(target);
    showToast(
      role === 'admin' ? 'Admin Session Active' : 'Demo Customer Signed In',
      `Logged in as ${target.name}`,
      'success'
    );
    navigate(role === 'admin' ? 'admin' : 'home');
  };

  const signOut = () => {
    setAuthUser(null);
    showToast('Signed Out', 'You have safely logged out of your AURA session', 'info');
    if (activeRoute === 'admin' || activeRoute === 'account') {
      navigate('auth');
    }
  };

  // User Profile Derived from Authenticated User or Guest Fallback
  const userProfile: UserProfile = authUser || GUEST_USER_FALLBACK;

  const updateProfile = (partial: Partial<UserProfile>) => {
    if (!authUser) {
      showToast('Sign In Required', 'Please sign in to save profile details', 'error');
      navigate('auth');
      return;
    }
    const updatedUser: RegisteredUser = { ...authUser, ...partial };
    setAuthUser(updatedUser);
    setRegisteredUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    showToast('Profile Updated', 'Personal information saved', 'success');
  };

  // Search & Global Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'iPhone 16 Pro',
    'Herman Miller Aeron',
    'Sony WH-1000XM5',
    'Tissot PRX',
    'Breville Barista',
  ]);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);

  const addRecentSearch = (query: string) => {
    if (!query.trim()) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((q) => q.toLowerCase() !== query.toLowerCase());
      return [query, ...filtered].slice(0, 8);
    });
  };

  const clearRecentSearches = () => setRecentSearches([]);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (
    title: string,
    message: string,
    type: 'success' | 'info' | 'error' = 'info'
  ) => {
    const id = 'toast-' + Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Theme & Currency
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === 'INR' ? 'USD' : 'INR'));
  };

  const formatPrice = (amount: number) => {
    if (currency === 'USD') {
      const usdVal = Math.round(amount / 85);
      return `$${usdVal.toLocaleString()}`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Admin Modules CRUD State & Handlers
  const adminAddProduct = (prod: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...prod,
      id: 'prod-admin-' + Date.now(),
    };
    setAllProducts((prev) => [newProduct, ...prev]);
    showToast('Catalog Updated', `Added "${prod.title.slice(0, 24)}" to store inventory`, 'success');
  };

  const adminUpdateProduct = (prod: Product) => {
    setAllProducts((prev) => prev.map((p) => (p.id === prod.id ? prod : p)));
    showToast('Product Updated', `Saved changes to ${prod.title.slice(0, 24)}`, 'success');
  };

  const adminDeleteProduct = (productId: string) => {
    setAllProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product Removed', 'Removed item from store inventory', 'info');
  };

  const adminAddCategory = (cat: Omit<Category, 'id'>) => {
    const newCat: Category = { ...cat, id: 'cat-' + Date.now(), status: 'Active' };
    setCategoriesList((prev) => [newCat, ...prev]);
    showToast('Department Added', `${cat.name} added to storefront navigation`, 'success');
  };

  const adminUpdateCategory = (cat: Category) => {
    setCategoriesList((prev) => prev.map((c) => (c.id === cat.id ? cat : c)));
    showToast('Department Updated', `${cat.name} details saved`, 'success');
  };

  const adminDeleteCategory = (id: string) => {
    setCategoriesList((prev) => prev.filter((c) => c.id !== id));
    showToast('Department Deleted', 'Category removed from catalog', 'info');
  };

  const adminAddBrand = (brand: Omit<Brand, 'id'>) => {
    setBrandsList((prev) => [{ ...brand, id: 'br-' + Date.now() }, ...prev]);
    showToast('Brand Added', `${brand.name} registered as authorized partner`, 'success');
  };

  const adminToggleBrandStatus = (id: string) => {
    setBrandsList((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: b.status === 'Active' ? 'Inactive' : 'Active' } : b
      )
    );
    showToast('Brand Updated', 'Partner status toggled', 'info');
  };

  const adminDeleteBrand = (id: string) => {
    setBrandsList((prev) => prev.filter((b) => b.id !== id));
    showToast('Brand Removed', 'Removed from brand directory', 'info');
  };

  const adminAddCoupon = (coupon: Coupon) => {
    setCouponsList((prev) => [{ ...coupon, active: true }, ...prev]);
    showToast('Coupon Created', `Code ${coupon.code} is now live`, 'success');
  };

  const adminToggleCoupon = (code: string) => {
    setCouponsList((prev) =>
      prev.map((c) => (c.code === code ? { ...c, active: c.active === false } : c))
    );
    showToast('Coupon Updated', `Updated status for ${code}`, 'info');
  };

  const adminDeleteCoupon = (code: string) => {
    setCouponsList((prev) => prev.filter((c) => c.code !== code));
    showToast('Coupon Deleted', `Removed ${code}`, 'info');
  };

  const adminAddBanner = (banner: Omit<BannerSlide, 'id'>) => {
    setBannersList((prev) => [{ ...banner, id: 'banner-' + Date.now() }, ...prev]);
    showToast('Banner Published', 'Hero carousel updated live on homepage', 'success');
  };

  const adminDeleteBanner = (id: string) => {
    setBannersList((prev) => prev.filter((b) => b.id !== id));
    showToast('Banner Removed', 'Slide removed from homepage carousel', 'info');
  };

  const adminUpdateUserStatus = (userId: string, status: 'Active' | 'Blocked') => {
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status } : u))
    );
    showToast('Customer Status Updated', `Account marked as ${status}`, 'info');
  };

  const adminUpdateUserTier = (userId: string, tier: 'Diamond VIP' | 'Gold' | 'Standard') => {
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, tier } : u))
    );
    if (authUser?.id === userId) {
      setAuthUser({ ...authUser, tier });
    }
    showToast('Loyalty Tier Updated', `Membership updated to ${tier}`, 'success');
  };

  const [adminReviews, setAdminReviews] = useState<Review[]>(initialAdminReviews);

  const adminModerateReview = (
    id: string,
    status: 'Approved' | 'Pending' | 'Hidden',
    reply?: string
  ) => {
    setAdminReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status, adminReply: reply !== undefined ? reply : r.adminReply } : r
      )
    );
    showToast('Review Moderated', `Review status updated to ${status}`, 'success');
  };

  const adminDeleteReview = (id: string) => {
    setAdminReviews((prev) => prev.filter((r) => r.id !== id));
    showToast('Review Deleted', 'Removed review record', 'info');
  };

  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>(initialReturnRequests);

  const adminUpdateReturnStatus = (id: string, status: ReturnRequest['status']) => {
    setReturnRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    showToast('Return Updated', `Return request updated to "${status}"`, 'success');
  };

  const [deliveryCarriers, setDeliveryCarriers] = useState<DeliveryCarrier[]>(initialCarriers);

  const adminToggleCarrierStatus = (id: string) => {
    setDeliveryCarriers((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === 'Active' ? 'Paused' : 'Active' } : c
      )
    );
    showToast('Carrier Updated', 'Logistics partner availability toggled', 'info');
  };

  const [offerCampaigns, setOfferCampaigns] = useState<OfferCampaign[]>(initialOfferCampaigns);

  const adminAddOfferCampaign = (campaign: Omit<OfferCampaign, 'id'>) => {
    setOfferCampaigns((prev) => [{ ...campaign, id: 'camp-' + Date.now() }, ...prev]);
    showToast('Campaign Launched', `${campaign.title} published`, 'success');
  };

  const adminToggleOfferCampaign = (id: string) => {
    setOfferCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
    showToast('Campaign Updated', 'Promotional campaign state changed', 'info');
  };

  const adminUpdateStoreSettings = (settings: StoreSettings) => {
    setStoreSettings(settings);
    showToast('Settings Saved', 'Global commerce configuration updated', 'success');
  };

  return (
    <ShopContext.Provider
      value={{
        activeRoute,
        routeParams,
        navigate,
        authUser,
        isAuthenticated,
        isAdmin,
        registeredUsers,
        signIn,
        signUp,
        quickDemoLogin,
        signOut,
        allProducts,
        categoriesList,
        refreshCategories,
        brandsList,
        bannersList,
        recentlyViewed,
        addRecentlyViewed,
        quickViewProduct,
        setQuickViewProduct,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        savedForLater,
        saveForLater,
        moveToCartFromSaved,
        cartTotalCount,
        cartSubtotal,
        cartDiscount,
        cartCouponDiscount,
        cartTax,
        cartShipping,
        cartGrandTotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        comparedProducts,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        couponsList,
        addresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        selectedAddressId,
        setSelectedAddressId,
        orders,
        placeOrder,
        cancelOrder,
        returnOrder,
        adminUpdateOrderStatus,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        userProfile,
        updateProfile,
        searchQuery,
        setSearchQuery,
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
        selectedCategorySlug,
        setSelectedCategorySlug,
        toasts,
        showToast,
        removeToast,
        theme,
        toggleTheme,
        currency,
        toggleCurrency,
        formatPrice,
        adminAddProduct,
        adminUpdateProduct,
        adminDeleteProduct,
        adminAddCategory,
        adminUpdateCategory,
        adminDeleteCategory,
        adminAddBrand,
        adminToggleBrandStatus,
        adminDeleteBrand,
        adminAddCoupon,
        adminToggleCoupon,
        adminDeleteCoupon,
        adminAddBanner,
        adminDeleteBanner,
        adminUpdateUserStatus,
        adminUpdateUserTier,
        adminReviews,
        adminModerateReview,
        adminDeleteReview,
        returnRequests,
        adminUpdateReturnStatus,
        transactions,
        deliveryCarriers,
        adminToggleCarrierStatus,
        offerCampaigns,
        adminAddOfferCampaign,
        adminToggleOfferCampaign,
        storeSettings,
        adminUpdateStoreSettings,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
