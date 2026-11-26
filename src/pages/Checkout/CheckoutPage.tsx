import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Address } from '../../types';
import { ProductImage } from '../../components/Common/ProductImage';
import {
  MapPin,
  Truck,
  CheckCircle2,
  CreditCard,
  QrCode,
  ShieldCheck,
  ArrowRight,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Loader2,
  ChevronRight,
  Smartphone,
  Banknote,
  Building,
  LogIn,
  UserPlus,
  UserCheck,
  AlertTriangle,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartTotalCount,
    cartSubtotal,
    cartDiscount,
    cartCouponDiscount,
    cartTax,
    cartShipping,
    cartGrandTotal,
    appliedCoupon,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    addAddress,
    placeOrder,
    formatPrice,
    navigate,
    showToast,
    isAuthenticated,
    authUser,
    storeSettings,
  } = useShop();

  // Multi-step: 1 = Address, 2 = Delivery Speed, 3 = Payment & Review
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Delivery Speed
  const [deliverySpeed, setDeliverySpeed] = useState<'Standard' | 'Express' | 'Scheduled'>('Express');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<string>('upi');
  const [upiId, setUpiId] = useState('vroy@okhdfcbank');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);

  // New Address Form Modal
  const [isNewAddressOpen, setIsNewAddressOpen] = useState(false);
  const [newAddrName, setNewAddrName] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState('');
  const [newAddrLine, setNewAddrLine] = useState('');
  const [newAddrLocality, setNewAddrLocality] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('Mumbai');
  const [newAddrState, setNewAddrState] = useState('Maharashtra');
  const [newAddrPincode, setNewAddrPincode] = useState('400026');
  const [newAddrType, setNewAddrType] = useState<'Home' | 'Work'>('Home');

  const selectedAddress =
    addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrName || !newAddrPhone || !newAddrLine) {
      showToast('Incomplete Address', 'Please provide contact and address details', 'error');
      return;
    }

    addAddress({
      name: newAddrName,
      phone: newAddrPhone,
      addressLine: newAddrLine,
      locality: newAddrLocality || 'Downtown',
      city: newAddrCity,
      state: newAddrState,
      pincode: newAddrPincode,
      type: newAddrType,
      isDefault: false,
    });

    setIsNewAddressOpen(false);
    setNewAddrName('');
    setNewAddrPhone('');
    setNewAddrLine('');
  };

  const handleFinalOrderPlacement = () => {
    setIsProcessing(true);

    let paymentMethodLabel = 'Instant UPI';
    if (paymentMethod === 'card') paymentMethodLabel = 'HDFC Regalia Visa (•••• 9042)';
    else if (paymentMethod === 'netbanking') paymentMethodLabel = `Net Banking (${selectedBank})`;
    else if (paymentMethod === 'cod') paymentMethodLabel = 'Cash on Delivery (COD)';

    setTimeout(() => {
      const order = placeOrder(deliverySpeed, paymentMethodLabel);
      setIsProcessing(false);
      if (order) {
        navigate('order-success', { orderId: order.id });
      }
    }, 1500);
  };

  if (cart.length === 0 && !isProcessing) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          No items currently ready for checkout
        </h2>
        <button
          onClick={() => navigate('products')}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs"
        >
          Return to Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Checkout Progress Stepper */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-800 -z-0" />

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center">
            <button
              onClick={() => setCurrentStep(1)}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                currentStep >= 1
                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-950/60'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              1
            </button>
            <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 mt-1.5">
              Destination
            </span>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center">
            <button
              onClick={() => setCurrentStep(2)}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                currentStep >= 2
                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-950/60'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              2
            </button>
            <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 mt-1.5">
              Delivery Speed
            </span>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center">
            <button
              onClick={() => setCurrentStep(3)}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                currentStep === 3
                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-950/60'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              3
            </button>
            <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 mt-1.5">
              Payment & Review
            </span>
          </div>
        </div>
      </div>

      {/* Authentication Status Banner for Guest / Signed-In Users */}
      <div className="mb-6">
        {!isAuthenticated ? (
          <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <LogIn className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {storeSettings.enableGuestCheckout
                    ? 'Checking out as Guest Shopper'
                    : 'Sign In Required to Complete Order'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {storeSettings.enableGuestCheckout
                    ? 'Sign in for 1-click saved addresses, or register as a 1st-time user to unlock AURA10 (10% Off).'
                    : 'Guest checkout is currently disabled by Store Admin. Please sign in or register to continue.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => navigate('auth', { mode: 'signin' })}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => navigate('auth', { mode: 'signup' })}
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>1st-Time Sign Up</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="px-4 py-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold">
              <UserCheck className="w-4 h-4" />
              <span>
                Signed in as <strong>{authUser?.name}</strong> ({authUser?.tier})
              </span>
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-500">
              Verified Priority Checkout
            </span>
          </div>
        )}
      </div>

      {!isAuthenticated && !storeSettings.enableGuestCheckout ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-10 text-center space-y-4">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Authentication Required for Checkout
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Store policy requires verified member sign-in before placing an order. Your cart items are safely preserved.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('auth', { mode: 'signin' })}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer"
            >
              Sign In to Continue
            </button>
            <button
              onClick={() => navigate('auth', { mode: 'signup' })}
              className="px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Interactive Step Content (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: Address Selection */}
          {currentStep === 1 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                    1. Select Delivery Destination
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Orders will be dispatched with tamper-proof security holograms.
                  </p>
                </div>
                <button
                  onClick={() => setIsNewAddressOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-600 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 text-xs font-semibold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Address</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all relative ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 ring-2 ring-indigo-600'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {addr.name}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 uppercase">
                          {addr.type}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {addr.addressLine}, {addr.locality}
                      </p>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">Phone: {addr.phone}</p>

                      {isSelected && (
                        <div className="mt-3 pt-2 border-t border-indigo-200 dark:border-indigo-900/60 flex items-center gap-1 text-[11px] font-bold text-indigo-600">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Selected for Delivery
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Continue to Delivery Speed</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Delivery Speed */}
          {currentStep === 2 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
                  <Truck className="w-5 h-5 text-indigo-600" />
                  2. Choose Delivery Experience
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select your preferred logistics timeline for {selectedAddress?.city}.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    id: 'Express',
                    title: 'Express Insured Air Priority',
                    desc: 'Delivered Tomorrow by 1:00 PM via Blue Dart Aviation with secure OTP release.',
                    badge: 'RECOMMENDED',
                    price: 'Complimentary (VIP Privilege)',
                  },
                  {
                    id: 'Standard',
                    title: 'Standard Ground Transit',
                    desc: 'Estimated arrival in 2–3 business days with standard courier tracking.',
                    price: 'Free',
                  },
                  {
                    id: 'Scheduled',
                    title: 'White-Glove Technician Appointment',
                    desc: 'Scheduled delivery window with certified technician unpacking, assembly, and setup.',
                    price: 'Complimentary for Electronics & Furniture',
                  },
                ].map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setDeliverySpeed(opt.id as any)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-4 ${
                      deliverySpeed === opt.id
                        ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 ring-2 ring-indigo-600'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {opt.title}
                        </span>
                        {opt.badge && (
                          <span className="text-[9px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded">
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{opt.desc}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 shrink-0">
                      {opt.price}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  ← Back to Destination
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Continue to Payment & Review</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Method & Item Review */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Payment Method Simulator */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
                <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                    3. Select Payment Instrument (Simulated)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Demonstration environment only. No actual financial transaction will be charged.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'upi', label: 'Instant UPI', icon: Smartphone },
                    { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
                    { id: 'netbanking', label: 'Net Banking', icon: Building },
                    ...(storeSettings.enableCod
                      ? [{ id: 'cod', label: 'Cash on Delivery', icon: Banknote }]
                      : []),
                  ].map((pm) => {
                    const Icon = pm.icon;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMethod(pm.id)}
                        className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                          paymentMethod === pm.id
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 font-bold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs">{pm.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Sub-form based on selected payment method */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs">
                  {paymentMethod === 'upi' && (
                    <div className="space-y-3">
                      <span className="font-bold text-slate-900 dark:text-white block">
                        Pay via UPI Virtual Payment Address (VPA)
                      </span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. mobile@okhdfcbank"
                          className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white"
                        />
                        <button
                          type="button"
                          className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-lg"
                        >
                          Verify VPA
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <QrCode className="w-4 h-4 text-indigo-600" />
                        <span>Dynamic merchant QR code will be generated upon authorization.</span>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="space-y-3">
                      <span className="font-bold text-slate-900 dark:text-white block">
                        Saved / New Card (Encrypted Tokenization)
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Card Number: •••• •••• •••• 9042"
                          defaultValue="•••• •••• •••• 9042"
                          className="col-span-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2"
                        />
                        <input
                          type="text"
                          placeholder="MM / YY"
                          defaultValue="08/29"
                          className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2"
                        />
                        <input
                          type="password"
                          placeholder="CVV: •••"
                          defaultValue="782"
                          className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'netbanking' && (
                    <div className="space-y-3">
                      <span className="font-bold text-slate-900 dark:text-white block">
                        Select Corporate / Retail Banking Portal
                      </span>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs"
                      >
                        <option>HDFC Bank Corporate</option>
                        <option>ICICI Bank Retail</option>
                        <option>State Bank of India</option>
                        <option>Axis Bank</option>
                        <option>Kotak Mahindra Bank</option>
                      </select>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="space-y-2">
                      <span className="font-bold text-slate-900 dark:text-white block">
                        Cash on Delivery Terms
                      </span>
                      <p className="text-slate-600 dark:text-slate-400">
                        Please keep exact cash or UPI QR scan ready at the time of delivery. A verification OTP will be sent to your mobile phone before handover.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items Preview in Checkout */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                  Reviewing {cartTotalCount} Items in Package
                </h3>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {cart.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                          <ProductImage src={item.product.image} alt={item.product.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                            {item.product.title}
                          </div>
                          <span className="text-[11px] text-slate-500">
                            Qty: {item.quantity} · {item.selectedColor || item.selectedStorage || 'Standard'}
                          </span>
                        </div>
                      </div>
                      <span className="font-extrabold text-slate-900 dark:text-white tabular-nums">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Sticky Order Summary & Authorize Button (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 sticky top-28">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Payment Summary
            </h3>

            <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
              <div className="flex justify-between text-slate-600 dark:text-slate-400 pt-1">
                <span>Items Subtotal</span>
                <span className="tabular-nums font-semibold text-slate-900 dark:text-white">
                  {formatPrice(cartSubtotal)}
                </span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 pt-2">
                  <span>Product Savings</span>
                  <span className="tabular-nums font-bold">-{formatPrice(cartDiscount)}</span>
                </div>
              )}

              {cartCouponDiscount > 0 && (
                <div className="flex justify-between text-indigo-600 pt-2">
                  <span>Coupon Rebate ({appliedCoupon?.code})</span>
                  <span className="tabular-nums font-bold">-{formatPrice(cartCouponDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600 dark:text-slate-400 pt-2">
                <span>Taxes & GST ({storeSettings.gstRate}%)</span>
                <span className="tabular-nums font-semibold text-slate-900 dark:text-white">
                  {formatPrice(cartTax)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400 pt-2">
                <span>Delivery Experience</span>
                <span className={`font-bold ${cartShipping === 0 ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                  {cartShipping === 0 ? 'FREE' : formatPrice(cartShipping)}
                </span>
              </div>

              <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-3">
                <span>Amount Payable</span>
                <span className="tabular-nums text-xl text-indigo-600 dark:text-indigo-400">
                  {formatPrice(cartGrandTotal)}
                </span>
              </div>
            </div>

            {/* Delivery address recap in summary */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
                Delivering to:
              </span>
              <p className="text-slate-600 dark:text-slate-400 line-clamp-1">
                {selectedAddress?.name} · {selectedAddress?.city} ({selectedAddress?.pincode})
              </p>
              <span className="text-[10px] text-indigo-600 font-semibold block mt-1">
                Speed: {deliverySpeed} Transit
              </span>
            </div>

            <button
              onClick={handleFinalOrderPlacement}
              disabled={isProcessing}
              className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authorizing Digital Payment...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authorize & Place Order ({formatPrice(cartGrandTotal)})</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Simulated Payment Gateway · Instant Demo Confirmation</span>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Add New Address Modal */}
      {isNewAddressOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-1">
              Add New Delivery Destination
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter your complete address for accurate logistics dispatch.
            </p>

            <form onSubmit={handleAddNewAddress} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newAddrName}
                    onChange={(e) => setNewAddrName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={newAddrPhone}
                    onChange={(e) => setNewAddrPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Flat / Building / Street</label>
                <input
                  type="text"
                  required
                  value={newAddrLine}
                  onChange={(e) => setNewAddrLine(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Locality</label>
                  <input
                    type="text"
                    value={newAddrLocality}
                    onChange={(e) => setNewAddrLocality(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newAddrCity}
                    onChange={(e) => setNewAddrCity(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    value={newAddrPincode}
                    onChange={(e) => setNewAddrPincode(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="addrtype"
                    checked={newAddrType === 'Home'}
                    onChange={() => setNewAddrType('Home')}
                  />
                  <span>Home</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="addrtype"
                    checked={newAddrType === 'Work'}
                    onChange={() => setNewAddrType('Work')}
                  />
                  <span>Office / Work</span>
                </label>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewAddressOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-bold cursor-pointer"
                >
                  Save & Use Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
