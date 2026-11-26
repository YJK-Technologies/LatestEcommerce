import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { ProductImage } from '../../components/Common/ProductImage';
import {
  AdminProductsModule,
  AdminCategoriesModule,
  AdminBrandsModule,
  AdminInventoryModule,
} from './AdminCatalogModules';
import {
  AdminOrdersModule,
  AdminCustomersModule,
  AdminCouponsModule,
  AdminOffersModule,
  AdminBannersModule,
} from './AdminCommerceModules';
import {
  AdminReviewsModule,
  AdminReturnsModule,
  AdminPaymentsModule,
  AdminDeliveryModule,
  AdminReportsModule,
  AdminSettingsModule,
} from './AdminOperationsModules';
import {
  LayoutDashboard,
  Package,
  Layers,
  Award,
  Boxes,
  ShoppingBag,
  Users,
  Tag,
  Sparkles,
  Image as ImageIcon,
  Star,
  RotateCcw,
  CreditCard,
  Truck,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  TrendingUp,
  IndianRupee,
  Clock,
  CheckCircle2,
  XCircle,
  Lock,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

type AdminModuleId =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'brands'
  | 'inventory'
  | 'orders'
  | 'customers'
  | 'coupons'
  | 'offers'
  | 'banners'
  | 'reviews'
  | 'returns'
  | 'payments'
  | 'delivery'
  | 'reports'
  | 'settings';

interface SidebarGroup {
  label: string;
  items: { id: AdminModuleId; label: string; icon: React.ComponentType<{ className?: string }> }[];
}

const SIDEBAR_GROUPS: SidebarGroup[] = [
  {
    label: 'Overview',
    items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Catalog & Stock',
    items: [
      { id: 'products', label: 'Products', icon: Package },
      { id: 'categories', label: 'Categories', icon: Layers },
      { id: 'brands', label: 'Brands', icon: Award },
      { id: 'inventory', label: 'Inventory', icon: Boxes },
    ],
  },
  {
    label: 'Sales & Growth',
    items: [
      { id: 'orders', label: 'Orders', icon: ShoppingBag },
      { id: 'customers', label: 'Customers', icon: Users },
      { id: 'coupons', label: 'Coupons', icon: Tag },
      { id: 'offers', label: 'Offers & Promos', icon: Sparkles },
      { id: 'banners', label: 'Hero Banners', icon: ImageIcon },
    ],
  },
  {
    label: 'Operations & Config',
    items: [
      { id: 'reviews', label: 'Reviews', icon: Star },
      { id: 'returns', label: 'Returns & Refunds', icon: RotateCcw },
      { id: 'payments', label: 'Payments', icon: CreditCard },
      { id: 'delivery', label: 'Delivery Partners', icon: Truck },
      { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
      { id: 'settings', label: 'Store Settings', icon: Settings },
    ],
  },
];

const MODULE_META: Record<AdminModuleId, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Executive Operations Dashboard',
    subtitle: 'Real-time store KPIs, monthly revenue trends, and catalog performance.',
  },
  products: {
    title: 'Product Catalog Management',
    subtitle: 'Create, edit, inspect, filter, and export all marketplace SKUs.',
  },
  categories: {
    title: 'Department & Category Hierarchy',
    subtitle: 'Manage all 28+ storefront departments, subcategories, and visibility.',
  },
  brands: {
    title: 'Authorized Brand Partners',
    subtitle: 'Onboard international luxury houses and control featured brand status.',
  },
  inventory: {
    title: 'Warehouse Inventory Control',
    subtitle: 'Monitor low-stock alerts, adjust unit counts, and execute quick restocks.',
  },
  orders: {
    title: 'Order Fulfillment & Lifecycle',
    subtitle: 'Inspect manifests and transition orders across all 11 lifecycle statuses.',
  },
  customers: {
    title: 'Customer Directory & VIP Tiers',
    subtitle: 'Manage registered shoppers, loyalty tiers, and account access permissions.',
  },
  coupons: {
    title: 'Promo Codes & Coupon Engine',
    subtitle: 'Launch percentage or flat discount codes synced with Cart & Checkout.',
  },
  offers: {
    title: 'Offers & Flash Sale Campaigns',
    subtitle: 'Coordinate festival galas, flash drops, bank rebates, and BOGO offers.',
  },
  banners: {
    title: 'Homepage Hero Banner Studio',
    subtitle: 'Publish and manage promotional hero slides on the customer homepage.',
  },
  reviews: {
    title: 'Customer Review Moderation',
    subtitle: 'Approve, hide, delete, or respond officially to verified buyer reviews.',
  },
  returns: {
    title: 'Returns & Refund Resolution',
    subtitle: 'Schedule courier pickups, authorize refunds, and close return claims.',
  },
  payments: {
    title: 'Payment Transaction Ledger',
    subtitle: 'Audit captured UPI, Credit Card, Net Banking, and COD settlements.',
  },
  delivery: {
    title: 'Delivery Partners & Logistics',
    subtitle: 'Manage express aviation and white-glove fleets plus pincode coverage.',
  },
  reports: {
    title: 'Reports & Business Intelligence',
    subtitle: 'Generate downloadable CSV reports across sales, stock, and returns.',
  },
  settings: {
    title: 'Global Storefront Settings',
    subtitle: 'Configure GST rates, free shipping thresholds, COD, and guest checkout.',
  },
};

export const AdminDashboard: React.FC = () => {
  const {
    isAdmin,
    authUser,
    signIn,
    quickDemoLogin,
    signOut,
    navigate,
    allProducts,
    orders,
    registeredUsers,
    transactions,
    categoriesList,
    formatPrice,
  } = useShop();

  const [activeModule, setActiveModule] = useState<AdminModuleId>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Admin Portal Login Gate State
  const [adminEmail, setAdminEmail] = useState('admin@aura.in');
  const [adminPass, setAdminPass] = useState('admin123');
  const [authError, setAuthError] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const res = signIn(adminEmail, adminPass);
    if (!res.success) {
      setAuthError(res.message);
      return;
    }
    if (res.user?.role !== 'admin') {
      setAuthError(
        'This account has Customer privileges. Please sign in with admin@aura.in to access the Admin Console.'
      );
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
              AURA Enterprise Operations
            </span>
            <h1 className="text-xl font-bold font-display">Admin Console Access</h1>
            <p className="text-xs text-slate-400">
              Sign in with Executive credentials to manage products, orders, promotions, and analytics.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
              {authError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Admin Email</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Password</label>
              <input
                type="password"
                required
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Authenticate & Enter Console</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 space-y-2.5">
            <button
              type="button"
              onClick={() => quickDemoLogin('admin')}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-indigo-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>1-Click Demo Admin (Arjun Malhotra)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => navigate('home')}
              className="w-full py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              ← Return to Customer Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Computed KPI Metrics for Module 1: Dashboard
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const pendingOrders = orders.filter(
    (o) => !['Delivered', 'Cancelled', 'Refunded'].includes(o.status)
  ).length;
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;
  const cancelledOrders = orders.filter((o) => o.status === 'Cancelled').length;
  const customerCount = registeredUsers.filter((u) => u.role === 'customer').length;
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  const monthlyRevenue = [
    { month: 'Jun', val: 62 },
    { month: 'Jul', val: 74 },
    { month: 'Aug', val: 68 },
    { month: 'Sep', val: 85 },
    { month: 'Oct', val: 92 },
    { month: 'Nov', val: 100 },
  ];

  const paymentMethodCounts = {
    UPI: transactions.filter((t) => t.method === 'UPI').length,
    'Credit Card': transactions.filter((t) => t.method === 'Credit Card').length,
    'Net Banking': transactions.filter((t) => t.method === 'Net Banking').length,
    COD: transactions.filter((t) => t.method === 'COD').length,
  };

  const renderDashboardOverview = () => (
    <div className="space-y-6">
      {/* 8 Enterprise KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Gross Revenue',
            value: formatPrice(totalRevenue),
            delta: '+18.4% vs last month',
            icon: IndianRupee,
            tone: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50',
          },
          {
            label: 'Total Orders',
            value: orders.length.toString(),
            delta: `Avg Order: ${formatPrice(avgOrderValue)}`,
            icon: ShoppingBag,
            tone: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50',
          },
          {
            label: 'Registered Customers',
            value: customerCount.toString(),
            delta: `${registeredUsers.filter((u) => u.tier === 'Diamond VIP').length} Diamond VIPs`,
            icon: Users,
            tone: 'text-violet-600 bg-violet-50 dark:bg-violet-950/50',
          },
          {
            label: 'Active Catalog SKUs',
            value: allProducts.length.toString(),
            delta: `${categoriesList.length} Departments`,
            icon: Package,
            tone: 'text-sky-600 bg-sky-50 dark:bg-sky-950/50',
          },
          {
            label: 'Pending / In-Transit',
            value: pendingOrders.toString(),
            delta: 'Requires logistics tracking',
            icon: Clock,
            tone: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50',
          },
          {
            label: 'Delivered Orders',
            value: deliveredOrders.toString(),
            delta: '98.4% SLA adherence',
            icon: CheckCircle2,
            tone: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50',
          },
          {
            label: 'Cancelled Orders',
            value: cancelledOrders.toString(),
            delta: 'Auto-refunded to source',
            icon: XCircle,
            tone: 'text-rose-600 bg-rose-50 dark:bg-rose-950/50',
          },
          {
            label: 'Net Captured Sales',
            value: formatPrice(
              transactions
                .filter((t) => t.status === 'Captured')
                .reduce((acc, t) => acc + t.amount, 0)
            ),
            delta: `${transactions.length} settled txns`,
            icon: TrendingUp,
            tone: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50',
          },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex items-start justify-between gap-3"
            >
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block">
                  {kpi.label}
                </span>
                <div className="text-xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
                  {kpi.value}
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">{kpi.delta}</span>
              </div>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${kpi.tone}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row: Monthly Revenue & Payment Mix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Monthly Revenue Momentum (2026)
              </h3>
              <p className="text-[11px] text-slate-500">
                Indexed GMV trajectory across flagship & couture launches
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg">
              +24.8% YoY
            </span>
          </div>

          <div className="h-44 flex items-end gap-4 pt-4">
            {monthlyRevenue.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="w-full max-w-[44px] bg-slate-100 dark:bg-slate-800 rounded-t-xl h-full flex items-end overflow-hidden">
                  <div
                    className="w-full bg-indigo-600 rounded-t-xl transition-all"
                    style={{ height: `${m.val}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-500">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Payment Instrument Distribution
          </h3>
          <div className="space-y-3 text-xs">
            {Object.entries(paymentMethodCounts).map(([method, count]) => {
              const pct =
                transactions.length > 0 ? Math.round((count / transactions.length) * 100) : 0;
              return (
                <div key={method} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {method}
                    </span>
                    <span className="tabular-nums text-slate-500">
                      {count} txns ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${Math.max(pct, 6)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row: Top Selling Products & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Top Flagship Products
            </h3>
            <button
              onClick={() => setActiveModule('products')}
              className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
            >
              Manage Catalog →
            </button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {allProducts.slice(0, 5).map((p) => (
              <div key={p.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                    <ProductImage src={p.image} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 dark:text-white truncate">
                      {p.title}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {p.brand} · {p.stockCount} in stock
                    </div>
                  </div>
                </div>
                <span className="font-bold tabular-nums shrink-0">{formatPrice(p.price)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Recent Customer Orders
            </h3>
            <button
              onClick={() => setActiveModule('orders')}
              className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
            >
              Open Order Queue →
            </button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {orders.slice(0, 5).map((ord) => (
              <div key={ord.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-mono font-bold text-indigo-600">{ord.orderNumber}</div>
                  <div className="text-[11px] text-slate-500">
                    {ord.deliveryAddress.name} · {ord.date}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold tabular-nums">{formatPrice(ord.totalAmount)}</div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {ord.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return renderDashboardOverview();
      case 'products':
        return <AdminProductsModule />;
      case 'categories':
        return <AdminCategoriesModule />;
      case 'brands':
        return <AdminBrandsModule />;
      case 'inventory':
        return <AdminInventoryModule />;
      case 'orders':
        return <AdminOrdersModule />;
      case 'customers':
        return <AdminCustomersModule />;
      case 'coupons':
        return <AdminCouponsModule />;
      case 'offers':
        return <AdminOffersModule />;
      case 'banners':
        return <AdminBannersModule />;
      case 'reviews':
        return <AdminReviewsModule />;
      case 'returns':
        return <AdminReturnsModule />;
      case 'payments':
        return <AdminPaymentsModule />;
      case 'delivery':
        return <AdminDeliveryModule />;
      case 'reports':
        return <AdminReportsModule />;
      case 'settings':
        return <AdminSettingsModule />;
      default:
        return renderDashboardOverview();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-950 text-slate-300 border-r border-slate-800">
      <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black flex items-center justify-center text-sm">
            A
          </div>
          <div>
            <div className="text-sm font-black tracking-wide text-white leading-none">
              AURA ADMIN
            </div>
            <span className="text-[10px] text-indigo-400 font-semibold">Enterprise Console</span>
          </div>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="lg:hidden p-1 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {SIDEBAR_GROUPS.map((group) => (
          <div key={group.label} className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {group.label}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveModule(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-slate-800 space-y-1.5 shrink-0">
        <button
          onClick={() => navigate('home')}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-900 cursor-pointer"
        >
          <ExternalLink className="w-4 h-4 text-indigo-400" />
          <span>View Customer Storefront</span>
        </button>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="w-64 h-full">{sidebarContent}</div>
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="flex-1 bg-slate-950/70 backdrop-blur-xs"
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Breadcrumb Bar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                {MODULE_META[activeModule].title}
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block truncate">
                {MODULE_META[activeModule].subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('home')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
              <span>Storefront</span>
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                {authUser?.name?.charAt(0) || 'A'}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {authUser?.name || 'Admin Executive'}
                </div>
                <div className="text-[10px] text-indigo-600 font-semibold">Executive Admin</div>
              </div>
            </div>

            <button
              onClick={signOut}
              title="Sign Out"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Active Module Viewport */}
        <main className="flex-1 p-4 sm:p-6 max-w-[1440px] w-full mx-auto">
          {renderActiveModule()}
        </main>
      </div>
    </div>
  );
};
