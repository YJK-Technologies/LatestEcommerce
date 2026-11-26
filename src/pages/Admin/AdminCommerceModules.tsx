import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Order, OrderStatus } from '../../types';
import { ProductImage } from '../../components/Common/ProductImage';
import {
  Search,
  Eye,
  X,
  Plus,
  Trash2,
  Tag,
  Sparkles,
  Image as ImageIcon,
  ShieldAlert,
  CheckCircle2,
  Users,
} from 'lucide-react';

const ALL_ORDER_STATUSES: OrderStatus[] = [
  'Order Placed',
  'Confirmed',
  'Processing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
  'Returned',
  'Refund Initiated',
  'Refunded',
];

export const AdminOrdersModule: React.FC = () => {
  const { orders, adminUpdateOrderStatus, formatPrice } = useShop();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = orders.filter((o) => {
    if (statusFilter !== 'All' && o.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.deliveryAddress.name.toLowerCase().includes(q) ||
        o.deliveryAddress.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-5">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, customer, city..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
        >
          <option value="All">All Order Statuses ({orders.length})</option>
          {ALL_ORDER_STATUSES.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date & Speed</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Live Status Transition</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filtered.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {ord.orderNumber}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {ord.deliveryAddress.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {ord.deliveryAddress.city} · {ord.items.length} items
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    <div>{ord.date}</div>
                    <div className="text-[11px] text-slate-400">{ord.deliverySpeed}</div>
                  </td>
                  <td className="py-3 px-4 tabular-nums font-bold text-slate-900 dark:text-white">
                    {formatPrice(ord.totalAmount)}
                    <div className="text-[10px] font-normal text-slate-500">
                      {ord.paymentStatus}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={ord.status}
                      onChange={(e) =>
                        adminUpdateOrderStatus(ord.id, e.target.value as OrderStatus)
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer"
                    >
                      {ALL_ORDER_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  Order Manifest
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Shipping Destination
                </span>
                <div className="font-bold text-slate-900 dark:text-white">
                  {selectedOrder.deliveryAddress.name}
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                  {selectedOrder.deliveryAddress.addressLine},{' '}
                  {selectedOrder.deliveryAddress.city} - {selectedOrder.deliveryAddress.pincode}
                </p>
                <p className="text-slate-500 mt-1">{selectedOrder.deliveryAddress.phone}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Payment & Total
                </span>
                <div className="font-bold text-slate-900 dark:text-white text-base tabular-nums">
                  {formatPrice(selectedOrder.totalAmount)}
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                  {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})
                </p>
                <p className="text-indigo-600 font-semibold mt-1">
                  Status: {selectedOrder.status}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Line Items
              </h4>
              {selectedOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                      <ProductImage
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {item.product.title}
                      </div>
                      <span className="text-[11px] text-slate-500">
                        Qty: {item.quantity} · {item.selectedColor || item.selectedStorage || 'Standard'}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold tabular-nums">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminCustomersModule: React.FC = () => {
  const { registeredUsers, adminUpdateUserStatus, adminUpdateUserTier, formatPrice } = useShop();
  const [search, setSearch] = useState('');

  const filtered = registeredUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.trim().toLowerCase()) ||
      u.email.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers by name or email..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Users className="w-4 h-4 text-indigo-600" />
          <span className="font-semibold">{registeredUsers.length} Registered Accounts</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Orders & Spend</th>
                <th className="py-3 px-4">Loyalty Tier</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Access Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filtered.map((usr) => (
                <tr key={usr.id}>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{usr.name}</div>
                    <div className="text-[11px] text-slate-500">
                      {usr.email} · {usr.phone}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        usr.role === 'admin'
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {usr.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 tabular-nums">
                    <div className="font-bold">{usr.totalOrders} Orders</div>
                    <div className="text-[11px] text-slate-500">{formatPrice(usr.totalSpent)}</div>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={usr.tier}
                      onChange={(e) =>
                        adminUpdateUserTier(
                          usr.id,
                          e.target.value as 'Diamond VIP' | 'Gold' | 'Standard'
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer"
                    >
                      <option value="Standard">Standard</option>
                      <option value="Gold">Gold</option>
                      <option value="Diamond VIP">Diamond VIP</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        usr.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
                      }`}
                    >
                      {usr.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {usr.role !== 'admin' ? (
                      <button
                        onClick={() =>
                          adminUpdateUserStatus(
                            usr.id,
                            usr.status === 'Active' ? 'Blocked' : 'Active'
                          )
                        }
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer inline-flex items-center gap-1 ${
                          usr.status === 'Active'
                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                      >
                        {usr.status === 'Active' ? (
                          <>
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span>Block</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Unblock</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400">Protected</span>
                    )}
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

export const AdminCouponsModule: React.FC = () => {
  const { couponsList, adminAddCoupon, adminToggleCoupon, adminDeleteCoupon, formatPrice } =
    useShop();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [discountType, setDiscountType] = useState<'percent' | 'flat'>('percent');
  const [value, setValue] = useState(15);
  const [maxDiscount, setMaxDiscount] = useState(5000);
  const [minSpend, setMinSpend] = useState(10000);
  const [expiryDate, setExpiryDate] = useState('2026-12-31');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !title.trim()) return;
    adminAddCoupon({
      code: code.trim().toUpperCase(),
      title: title.trim(),
      ...(discountType === 'percent'
        ? { discountPercent: Number(value), maxDiscount: Number(maxDiscount) }
        : { flatDiscount: Number(value) }),
      minSpend: Number(minSpend),
      expiryDate,
      description:
        discountType === 'percent'
          ? `${value}% instant discount up to ₹${maxDiscount.toLocaleString()} on orders above ₹${minSpend.toLocaleString()}.`
          : `Flat ₹${value.toLocaleString()} instant rebate on orders above ₹${minSpend.toLocaleString()}.`,
      terms: 'Created via Admin Promotions Engine. Applicable at Cart & Checkout.',
      active: true,
    });
    setIsAddOpen(false);
    setCode('');
    setTitle('');
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
        <div className="text-xs text-slate-500">
          Active promo codes sync immediately with Storefront Cart & Offers hub.
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {couponsList.map((c) => {
          const isActive = c.active !== false;
          return (
            <div
              key={c.code}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 font-mono text-xs font-black text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    {c.code}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                    }`}
                  >
                    {isActive ? 'Active' : 'Paused'}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-3">
                  {c.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1">{c.description}</p>
                <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-3 tabular-nums">
                  <span>Min Spend: {formatPrice(c.minSpend)}</span>
                  <span>Expires: {c.expiryDate}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <button
                  onClick={() => adminToggleCoupon(c.code)}
                  className="font-semibold text-indigo-600 hover:underline cursor-pointer"
                >
                  {isActive ? 'Pause Coupon' : 'Activate Coupon'}
                </button>
                <button
                  onClick={() => adminDeleteCoupon(c.code)}
                  className="font-semibold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Launch New Promo Coupon
            </h3>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Coupon Code</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. WINTER25"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Winter VIP Privilege"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Discount Mode</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'percent' | 'flat')}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">
                    {discountType === 'percent' ? 'Percent (%)' : 'Flat Value (₹)'}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Min Cart Spend (₹)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={minSpend}
                    onChange={(e) => setMinSpend(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                {discountType === 'percent' && (
                  <div>
                    <label className="font-semibold block mb-1">Max Cap (₹)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={maxDiscount}
                      onChange={(e) => setMaxDiscount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-bold cursor-pointer"
                >
                  Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminOffersModule: React.FC = () => {
  const { offerCampaigns, adminAddOfferCampaign, adminToggleOfferCampaign } = useShop();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'Flash Sale' | 'Festival Gala' | 'Bank Offer' | 'BOGO'>(
    'Flash Sale'
  );
  const [discountLabel, setDiscountLabel] = useState('Up to 30% Off Select Flagships');
  const [validUntil, setValidUntil] = useState('Dec 31, 2026');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    adminAddOfferCampaign({
      title: title.trim(),
      type,
      discountLabel,
      validUntil,
      active: true,
    });
    setIsAddOpen(false);
    setTitle('');
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
        <div className="text-xs text-slate-500">
          Manage Flash Sales, Festival Galas, Bank Rebates, and BOGO Merchandising Campaigns.
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offerCampaigns.map((camp) => (
          <div
            key={camp.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex items-start justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase">
                  {camp.type}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    camp.active
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                  }`}
                >
                  {camp.active ? 'Live' : 'Paused'}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                {camp.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">{camp.discountLabel}</p>
              <p className="text-[11px] text-slate-400">Valid until: {camp.validUntil}</p>
            </div>
            <button
              onClick={() => adminToggleOfferCampaign(camp.id)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0 cursor-pointer"
            >
              {camp.active ? 'Pause' : 'Activate'}
            </button>
          </div>
        ))}
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Create Promotion Campaign
            </h3>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Weekend Cyber Tech Drop"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Campaign Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as typeof type)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <option value="Flash Sale">Flash Sale</option>
                  <option value="Festival Gala">Festival Gala</option>
                  <option value="Bank Offer">Bank Offer</option>
                  <option value="BOGO">BOGO</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">Discount Offer Headline</label>
                <input
                  type="text"
                  required
                  value={discountLabel}
                  onChange={(e) => setDiscountLabel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Validity Window</label>
                <input
                  type="text"
                  required
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-bold cursor-pointer"
                >
                  Launch Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminBannersModule: React.FC = () => {
  const { bannersList, categoriesList, adminAddBanner, adminDeleteBanner } = useShop();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [badge, setBadge] = useState('LIMITED SEASONAL EDITION');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState(
    'Curated luxury arrivals with complimentary insured next-day courier delivery.'
  );
  const [ctaText, setCtaText] = useState('Shop Now');
  const [categoryLink, setCategoryLink] = useState(categoriesList[0]?.slug || 'mobiles-tablets');
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&auto=format&fit=crop&q=80'
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    adminAddBanner({
      badge,
      title: title.trim(),
      subtitle,
      ctaText,
      categoryLink,
      image,
      theme: 'dark',
      accentColor: '#4f46e5',
    });
    setIsAddOpen(false);
    setTitle('');
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
        <div className="text-xs text-slate-500">
          Hero banners added or removed here sync directly with the Homepage Carousel.
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Hero Banner</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {bannersList.map((b) => (
          <div
            key={b.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="h-44 relative overflow-hidden">
              <ProductImage src={b.image} alt={b.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                  {b.badge}
                </span>
                <h4 className="text-base font-bold leading-snug">{b.title}</h4>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between gap-3 text-xs">
              <div className="min-w-0">
                <p className="text-slate-600 dark:text-slate-400 line-clamp-1">{b.subtitle}</p>
                <span className="text-[11px] text-slate-400">
                  CTA: "{b.ctaText}" → /{b.categoryLink}
                </span>
              </div>
              <button
                onClick={() => adminDeleteBanner(b.id)}
                className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold shrink-0 cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-indigo-600" />
              Publish Homepage Hero Banner
            </h3>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Eyebrow Badge</label>
                <input
                  type="text"
                  required
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Hero Headline</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Signature Swiss Horology Collection"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Subtitle</label>
                <textarea
                  rows={2}
                  required
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Button Label</label>
                  <input
                    type="text"
                    required
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Target Category</label>
                  <select
                    value={categoryLink}
                    onChange={(e) => setCategoryLink(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    {categoriesList.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">High-Res Banner Image URL</label>
                <input
                  type="url"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-bold cursor-pointer"
                >
                  Publish Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
