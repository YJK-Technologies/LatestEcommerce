import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { ToastContainer } from './components/Common/ToastContainer';
import { QuickViewModal } from './components/Product/QuickViewModal';
import { MobileBottomNav } from './components/Navigation/MobileBottomNav';

// Pages
import { HomePage } from './pages/Home/HomePage';
import { ProductListingPage } from './pages/Products/ProductListingPage';
import { ProductDetailsPage } from './pages/ProductDetails/ProductDetailsPage';
import { CartPage } from './pages/Cart/CartPage';
import { CheckoutPage } from './pages/Checkout/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccess/OrderSuccessPage';
import { MyOrdersPage } from './pages/MyOrders/MyOrdersPage';
import { WishlistPage } from './pages/Wishlist/WishlistPage';
import { ComparePage } from './pages/Compare/ComparePage';
import { OffersPage } from './pages/Offers/OffersPage';
import { AccountPage } from './pages/Account/AccountPage';
import { SupportPage } from './pages/Support/SupportPage';
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { AuthPage } from './pages/Auth/AuthPage';

const AppContent: React.FC = () => {
  const { activeRoute } = useShop();

  const renderActiveRoute = () => {
    switch (activeRoute) {
      case 'home':
        return <HomePage />;
      case 'products':
        return <ProductListingPage />;
      case 'product-detail':
        return <ProductDetailsPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order-success':
        return <OrderSuccessPage />;
      case 'orders':
        return <MyOrdersPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'compare':
        return <ComparePage />;
      case 'offers':
        return <OffersPage />;
      case 'account':
        return <AccountPage />;
      case 'support':
        return <SupportPage />;
      case 'auth':
        return <AuthPage />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <HomePage />;
    }
  };

  if (activeRoute === 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <AdminDashboard />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Header />
      <main className="flex-1 pb-16 md:pb-0">{renderActiveRoute()}</main>
      <Footer />

      {/* Global Modals & Controls */}
      <QuickViewModal />
      <ToastContainer />
      <MobileBottomNav />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
