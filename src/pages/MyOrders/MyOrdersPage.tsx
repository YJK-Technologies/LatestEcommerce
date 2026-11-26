import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Order } from '../../types';
import { ProductImage } from '../../components/Common/ProductImage';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  Search,
  Download,
  X,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';

export const MyOrdersPage: React.FC = () => {
  const {
    orders,
    cancelOrder,
    returnOrder,
    addToCart,
    formatPrice,
    navigate,
    showToast,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'delivered' | 'cancelled'>('all');
  const [searchOrderQuery, setSearchOrderQuery] = useState('');
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<Order | null>(null);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    // Tab filter
    if (activeTab === 'active') {
      if (['Delivered', 'Cancelled', 'Returned'].includes(order.status)) return false;
    } else if (activeTab === 'delivered') {
      if (order.status !== 'Delivered') return false;
    } else if (activeTab === 'cancelled') {
      if (!['Cancelled', 'Returned'].includes(order.status)) return false;
    }

    // Search query filter
    if (searchOrderQuery.trim()) {
      const q = searchOrderQuery.toLowerCase();
      const matchNum = order.orderNumber.toLowerCase().includes(q);
      const matchItem = order.items.some((i) =>
        i.product.title.toLowerCase().includes(q)
      );
      if (!matchNum && !matchItem) return false;
    }

    return true;
  });

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case 'Out for Delivery':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-bold text-xs animate-pulse">
            <Truck className="w-3.5 h-3.5" /> Out for Delivery
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 font-bold text-xs">
            <Package className="w-3.5 h-3.5" /> Shipped
          </span>
        );
      case 'Cancelled':
      case 'Returned':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 font-bold text-xs">
            <XCircle className="w-3.5 h-3.5" /> {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-bold text-xs">
            <Clock className="w-3.5 h-3.5" /> {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Title & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            My Orders & Shipments
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track active shipments, download GST invoices, or manage returns.
          </p>
        </div>

        {/* Search orders */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order # or product..."
            value={searchOrderQuery}
            onChange={(e) => setSearchOrderQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6 overflow-x-auto text-xs">
        {[
          { id: 'all', label: `All Orders (${orders.length})` },
          { id: 'active', label: 'In Transit / Active' },
          { id: 'delivered', label: 'Delivered' },
          { id: 'cancelled', label: 'Cancelled & Returns' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Order Cards List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Package className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No matching orders found
          </h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Try switching tabs or clearing your search filter.
          </p>
          <button
            onClick={() => {
              setActiveTab('all');
              setSearchOrderQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs"
            >
              {/* Order Header Ribbon */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Order Placed
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {order.date}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Total Amount
                    </span>
                    <span className="font-extrabold text-slate-900 dark:text-white tabular-nums">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Ship To
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[150px] block">
                      {order.deliveryAddress.name} ({order.deliveryAddress.city})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-500 text-xs">{order.orderNumber}</span>
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Items in order */}
              <div className="p-4 sm:p-6 divide-y divide-slate-100 dark:divide-slate-800">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        onClick={() => navigate('product-detail', { id: item.product.id })}
                        className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 cursor-pointer"
                      >
                        <ProductImage
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          {item.product.brand}
                        </span>
                        <h4
                          onClick={() => navigate('product-detail', { id: item.product.id })}
                          className="text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 cursor-pointer transition-colors line-clamp-1"
                        >
                          {item.product.title}
                        </h4>
                        <div className="text-[11px] text-slate-500">
                          Qty: {item.quantity} · {item.selectedColor || item.selectedStorage || 'Standard'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <span className="font-extrabold text-slate-900 dark:text-white tabular-nums text-sm">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => {
                          addToCart(item.product);
                          showToast('Added to Cart', 'Item repurchased and added to bag', 'success');
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                      >
                        Buy Again
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Card Footer Controls */}
              <div className="bg-slate-50/50 dark:bg-slate-800/30 p-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="text-slate-500">
                  <span className="font-medium">Estimated: </span>
                  <strong className="text-slate-800 dark:text-slate-200">
                    {order.estimatedDelivery}
                  </strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedTrackingOrder(order)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Track Shipment</span>
                  </button>

                  <button
                    onClick={() =>
                      showToast('Invoice Downloaded', `Invoice for ${order.orderNumber} saved to downloads`, 'success')
                    }
                    className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer font-medium flex items-center gap-1.5"
                    title="Download Tax Invoice"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Invoice</span>
                  </button>

                  {/* Cancel or Return buttons */}
                  {['Order Placed', 'Confirmed', 'Processing'].includes(order.status) && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="px-3 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-950/40 text-xs font-semibold cursor-pointer"
                    >
                      Cancel Order
                    </button>
                  )}

                  {order.status === 'Delivered' && (
                    <button
                      onClick={() => returnOrder(order.id)}
                      className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Return / Replace</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Live Order Tracking Timeline Modal */}
      {selectedTrackingOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                  Airway Tracking
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {selectedTrackingOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTrackingOrder(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status summary banner */}
            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 mb-6 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">
                  Current Status
                </span>
                <strong className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedTrackingOrder.status}
                </strong>
              </div>
              <div className="text-right">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">
                  Expected Handover
                </span>
                <strong className="text-emerald-600 font-bold">
                  {selectedTrackingOrder.estimatedDelivery}
                </strong>
              </div>
            </div>

            {/* Step Timeline */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
              {selectedTrackingOrder.trackingSteps.map((step, idx) => (
                <div key={idx} className="relative">
                  <div
                    className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      step.completed
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-950'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {step.completed ? '✓' : idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {step.status}
                      </span>
                      <span className="text-[10px] text-slate-400 tabular-nums">
                        {step.date}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedTrackingOrder(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs cursor-pointer"
              >
                Close Tracking View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
