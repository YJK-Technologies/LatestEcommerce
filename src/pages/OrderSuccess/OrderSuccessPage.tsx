import React from 'react';
import { useShop } from '../../context/ShopContext';
import { ProductImage } from '../../components/Common/ProductImage';
import {
  CheckCircle2,
  Package,
  Truck,
  Download,
  ArrowRight,
  ShieldCheck,
  Calendar,
  MapPin,
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { orders, routeParams, navigate, formatPrice, showToast } = useShop();

  const orderId = routeParams.orderId;
  const currentOrder = orders.find((o) => o.id === orderId) || orders[0];

  const handleDownloadInvoice = () => {
    showToast('Invoice Generated', `Tax invoice for ${currentOrder.orderNumber} downloaded to device`, 'success');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
      {/* Celebration Header */}
      <div className="text-center space-y-4 mb-10">
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xl ring-8 ring-emerald-50 dark:ring-emerald-950/30 animate-in zoom-in-75 duration-300">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block">
          Payment Authorized & Order Confirmed
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
          Thank you for your order!
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          We have dispatched a confirmation receipt with serial registration to your registered VIP email address.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
          <span>Order Reference:</span>
          <span className="text-indigo-600 dark:text-indigo-400">{currentOrder.orderNumber}</span>
        </div>
      </div>

      {/* Order Summary Receipt Box */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
        {/* Logistics & Estimated Arrival */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs">
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">
                Estimated Delivery Arrival
              </span>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                {currentOrder.estimatedDelivery}
              </p>
              <span className="text-[10px] text-indigo-600 font-semibold">
                Speed: {currentOrder.deliverySpeed} Air Priority
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">
                Destination Address
              </span>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">
                {currentOrder.deliveryAddress.name}, {currentOrder.deliveryAddress.addressLine}, {currentOrder.deliveryAddress.city} - {currentOrder.deliveryAddress.pincode}
              </p>
            </div>
          </div>
        </div>

        {/* Itemized List */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Purchased Items ({currentOrder.items.length})
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {currentOrder.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
                    <ProductImage src={item.product.image} alt={item.product.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block line-clamp-1">
                      {item.product.title}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Qty: {item.quantity} · {item.selectedColor || item.selectedStorage || 'Standard'}
                    </span>
                  </div>
                </div>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Recap */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Payment Method</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {currentOrder.paymentMethod}
            </span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Payment Status</span>
            <span className="font-bold text-emerald-600">PAID & SECURED</span>
          </div>
          <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Total Paid Amount</span>
            <span className="tabular-nums text-indigo-600 dark:text-indigo-400">
              {formatPrice(currentOrder.totalAmount)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('orders')}
            className="flex-1 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Package className="w-4 h-4" />
            <span>Track Order Timeline</span>
          </button>

          <button
            onClick={handleDownloadInvoice}
            className="flex-1 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Tax Invoice</span>
          </button>
        </div>

        <button
          onClick={() => navigate('home')}
          className="w-full text-center text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline block pt-2 cursor-pointer"
        >
          Return to AURA Home Store
        </button>
      </div>
    </div>
  );
};
