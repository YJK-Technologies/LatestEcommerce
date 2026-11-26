import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { ReturnRequest } from '../../types';
import {
  Star,
  CheckCircle2,
  EyeOff,
  Trash2,
  MessageSquare,
  RotateCcw,
  Search,
  CreditCard,
  Truck,
  MapPin,
  Download,
  BarChart3,
  Save,
  Sliders,
} from 'lucide-react';

export const AdminReviewsModule: React.FC = () => {
  const { adminReviews, adminModerateReview, adminDeleteReview } = useShop();
  const [statusFilter, setStatusFilter] = useState<'All' | 'Approved' | 'Pending' | 'Hidden'>('All');
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  const visible = adminReviews.filter((r) =>
    statusFilter === 'All' ? true : (r.status || 'Approved') === statusFilter
  );

  return (
    <div className="space-y-5">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {(['All', 'Approved', 'Pending', 'Hidden'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                statusFilter === tab
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-500">
          {adminReviews.length} total customer reviews in moderation queue
        </span>
      </div>

      <div className="space-y-3">
        {visible.map((rev) => {
          const st = rev.status || 'Approved';
          return (
            <div
              key={rev.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {rev.userName}
                    </span>
                    <span className="text-[11px] text-amber-500 font-bold flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {rev.rating}.0
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        st === 'Approved'
                          ? 'bg-emerald-100 text-emerald-700'
                          : st === 'Pending'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {st}
                    </span>
                  </div>
                  <p className="text-[11px] text-indigo-600 font-semibold mt-0.5">
                    {rev.productTitle || rev.productId} · {rev.date}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => adminModerateReview(rev.id, 'Approved', rev.adminReply)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approve
                  </button>
                  <button
                    onClick={() => adminModerateReview(rev.id, 'Hidden', rev.adminReply)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    Hide
                  </button>
                  <button
                    onClick={() => adminDeleteReview(rev.id)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{rev.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{rev.comment}</p>
              </div>

              {rev.adminReply && (
                <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-xs">
                  <span className="font-bold text-indigo-700 dark:text-indigo-300">
                    Official AURA Reply:
                  </span>{' '}
                  <span className="text-slate-700 dark:text-slate-300">{rev.adminReply}</span>
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={replyDrafts[rev.id] ?? ''}
                  onChange={(e) =>
                    setReplyDrafts((prev) => ({ ...prev, [rev.id]: e.target.value }))
                  }
                  placeholder="Write an official AURA Concierge response..."
                  className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none"
                />
                <button
                  onClick={() => {
                    const text = replyDrafts[rev.id]?.trim();
                    if (!text) return;
                    adminModerateReview(rev.id, 'Approved', text);
                    setReplyDrafts((prev) => ({ ...prev, [rev.id]: '' }));
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Post Reply</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const AdminReturnsModule: React.FC = () => {
  const { returnRequests, adminUpdateReturnStatus, formatPrice } = useShop();

  const statuses: ReturnRequest['status'][] = [
    'Requested',
    'Pickup Scheduled',
    'Refund Initiated',
    'Refunded',
    'Rejected',
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
          <RotateCcw className="w-4 h-4 text-indigo-600" />
          <span>Return & Refund Resolution Queue ({returnRequests.length})</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-4">Order #</th>
              <th className="py-3 px-4">Customer & Item</th>
              <th className="py-3 px-4">Reason</th>
              <th className="py-3 px-4">Refund Value</th>
              <th className="py-3 px-4">Resolution Stage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {returnRequests.map((req) => (
              <tr key={req.id}>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">{req.orderNumber}</td>
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900 dark:text-white">{req.customerName}</div>
                  <div className="text-[11px] text-slate-500 line-clamp-1 max-w-xs">
                    {req.productTitle}
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400 max-w-xs">
                  {req.reason}
                </td>
                <td className="py-3 px-4 tabular-nums font-bold">{formatPrice(req.amount)}</td>
                <td className="py-3 px-4">
                  <select
                    value={req.status}
                    onChange={(e) =>
                      adminUpdateReturnStatus(req.id, e.target.value as ReturnRequest['status'])
                    }
                    className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer"
                  >
                    {statuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AdminPaymentsModule: React.FC = () => {
  const { transactions, formatPrice } = useShop();
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('All');

  const filtered = transactions.filter((t) => {
    if (methodFilter !== 'All' && t.method !== methodFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        t.txnId.toLowerCase().includes(q) ||
        t.orderNumber.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const capturedSum = transactions
    .filter((t) => t.status === 'Captured')
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-5">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Txn ID, Order #, Customer..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none"
            />
          </div>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
          >
            <option value="All">All Methods</option>
            <option value="UPI">UPI</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Net Banking">Net Banking</option>
            <option value="COD">COD</option>
          </select>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 tabular-nums">
          <CreditCard className="w-4 h-4" />
          <span>Captured Volume: {formatPrice(capturedSum)}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Instrument</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filtered.map((tx) => (
                <tr key={tx.id}>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {tx.txnId}
                  </td>
                  <td className="py-3 px-4 font-mono text-indigo-600 font-bold">
                    {tx.orderNumber}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {tx.customerName}
                    </div>
                    <div className="text-[11px] text-slate-400">{tx.date}</div>
                  </td>
                  <td className="py-3 px-4">{tx.method}</td>
                  <td className="py-3 px-4 tabular-nums font-bold">{formatPrice(tx.amount)}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.status === 'Captured'
                          ? 'bg-emerald-100 text-emerald-700'
                          : tx.status === 'Pending'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const AdminDeliveryModule: React.FC = () => {
  const { deliveryCarriers, adminToggleCarrierStatus } = useShop();
  const [pincode, setPincode] = useState('400026');
  const [pinStatus, setPinStatus] = useState<string | null>(
    'Serviceable: Express Air Next-Day & White-Glove Installation available for 400026.'
  );

  const checkPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (/^\d{6}$/.test(pincode.trim())) {
      setPinStatus(
        `Serviceable: Express Air Next-Day & White-Glove Installation active for PIN ${pincode}.`
      );
    } else {
      setPinStatus('Enter a valid 6-digit Indian postal pincode to verify coverage.');
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deliveryCarriers.map((car) => (
          <div
            key={car.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex items-start justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-600" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{car.name}</h4>
              </div>
              <p className="text-xs text-slate-500">{car.serviceType}</p>
              <div className="flex items-center gap-4 text-[11px] text-slate-600 dark:text-slate-300 pt-2 tabular-nums">
                <span>Avg Transit: {car.avgDeliveryDays}</span>
                <span>Active: {car.activeShipments}</span>
                <span className="text-emerald-600 font-bold">SLA: {car.onTimeRate}</span>
              </div>
            </div>
            <button
              onClick={() => adminToggleCarrierStatus(car.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                car.status === 'Active'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {car.status}
            </button>
          </div>
        ))}
      </div>

      {/* Pincode Serviceability Checker */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-indigo-600" />
          Pincode Logistics Serviceability Lookup
        </h4>
        <form onSubmit={checkPincode} className="flex gap-2 max-w-md">
          <input
            type="text"
            maxLength={6}
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="Enter 6-digit PIN"
            className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer"
          >
            Check Hub
          </button>
        </form>
        {pinStatus && <p className="text-xs text-emerald-600 font-medium">{pinStatus}</p>}
      </div>
    </div>
  );
};

export const AdminReportsModule: React.FC = () => {
  const {
    allProducts,
    orders,
    categoriesList,
    registeredUsers,
    returnRequests,
    formatPrice,
    showToast,
  } = useShop();

  const [reportType, setReportType] = useState<
    'sales' | 'orders' | 'products' | 'categories' | 'customers' | 'inventory' | 'returns'
  >('sales');
  const [dateRange, setDateRange] = useState('30d');

  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);

  const exportReport = () => {
    const csv =
      `Report Type,Date Range,Metric,Value\n` +
      `${reportType},${dateRange},Total Orders,${orders.length}\n` +
      `${reportType},${dateRange},Gross Revenue,${totalRevenue}\n` +
      `${reportType},${dateRange},Catalog SKUs,${allProducts.length}\n` +
      `${reportType},${dateRange},Customers,${registeredUsers.length}\n`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aura_${reportType}_report_${dateRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Report Downloaded', `${reportType.toUpperCase()} CSV exported`, 'success');
  };

  return (
    <div className="space-y-5">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'sales', label: 'Sales' },
            { id: 'orders', label: 'Orders' },
            { id: 'products', label: 'Product Perf.' },
            { id: 'categories', label: 'Categories' },
            { id: 'customers', label: 'Customers' },
            { id: 'inventory', label: 'Inventory' },
            { id: 'returns', label: 'Returns' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setReportType(t.id as typeof reportType)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                reportType === t.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="q4">Q4 2026</option>
            <option value="ytd">Year to Date</option>
          </select>
          <button
            onClick={exportReport}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Dynamic Report Body */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wider">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            {reportType} Executive Summary ({dateRange.toUpperCase()})
          </h3>
          <span className="text-xs text-slate-400">Live Aggregated Store Metrics</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">Gross Merchandise Value</span>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-1 tabular-nums">
              {formatPrice(totalRevenue)}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">Orders Processed</span>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-1 tabular-nums">
              {orders.length}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">Active Departments</span>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-1 tabular-nums">
              {categoriesList.length}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">Open Returns</span>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-1 tabular-nums">
              {returnRequests.length}
            </div>
          </div>
        </div>

        <div className="space-y-2.5 pt-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            Top Performing Catalog Categories by SKU Depth
          </span>
          {categoriesList.slice(0, 6).map((c) => {
            const pct = Math.min(100, Math.max(15, c.productCount * 2));
            return (
              <div key={c.id} className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{c.name}</span>
                  <span className="tabular-nums text-slate-500">{c.productCount} items</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const AdminSettingsModule: React.FC = () => {
  const { storeSettings, adminUpdateStoreSettings } = useShop();
  const [form, setForm] = useState(storeSettings);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    adminUpdateStoreSettings(form);
  };

  return (
    <form
      onSubmit={handleSave}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-3xl space-y-5 text-xs"
    >
      <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
        <Sliders className="w-4 h-4 text-indigo-600" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Global Store Configuration & Checkout Rules
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="font-semibold block mb-1">Storefront Brand Name</label>
          <input
            type="text"
            required
            value={form.storeName}
            onChange={(e) => setForm({ ...form, storeName: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Concierge Support Email</label>
          <input
            type="email"
            required
            value={form.supportEmail}
            onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Toll-Free Support Phone</label>
          <input
            type="text"
            required
            value={form.supportPhone}
            onChange={(e) => setForm({ ...form, supportPhone: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold block mb-1">GST Tax Rate (%)</label>
            <input
              type="number"
              min={0}
              max={28}
              value={form.gstRate}
              onChange={(e) => setForm({ ...form, gstRate: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 tabular-nums"
            />
          </div>
          <div>
            <label className="font-semibold block mb-1">Free Shipping Above (₹)</label>
            <input
              type="number"
              min={0}
              value={form.freeShippingThreshold}
              onChange={(e) =>
                setForm({ ...form, freeShippingThreshold: Number(e.target.value) })
              }
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 tabular-nums"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 cursor-pointer">
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">
              Enable Cash on Delivery (COD)
            </span>
            <span className="text-[11px] text-slate-500">
              Show COD as a payment instrument during Step 3 of Checkout.
            </span>
          </div>
          <input
            type="checkbox"
            checked={form.enableCod}
            onChange={(e) => setForm({ ...form, enableCod: e.target.checked })}
            className="w-4 h-4 accent-indigo-600"
          />
        </label>

        <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 cursor-pointer">
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">
              Allow Guest Checkout
            </span>
            <span className="text-[11px] text-slate-500">
              Allow visitors to place orders without signing in first.
            </span>
          </div>
          <input
            type="checkbox"
            checked={form.enableGuestCheckout}
            onChange={(e) => setForm({ ...form, enableGuestCheckout: e.target.checked })}
            className="w-4 h-4 accent-indigo-600"
          />
        </label>

        <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 cursor-pointer">
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">
              Maintenance Mode Notice
            </span>
            <span className="text-[11px] text-slate-500">
              Display scheduled maintenance banner across storefront.
            </span>
          </div>
          <input
            type="checkbox"
            checked={form.maintenanceMode}
            onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })}
            className="w-4 h-4 accent-indigo-600"
          />
        </label>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Store Configuration</span>
        </button>
      </div>
    </form>
  );
};
