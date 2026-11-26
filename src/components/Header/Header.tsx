import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import {
  Search,
  MapPin,
  Heart,
  ShoppingBag,
  Bell,
  User,
  Sun,
  Moon,
  ChevronDown,
  Layers,
  Sparkles,
  Percent,
  SlidersHorizontal,
  ShieldCheck,
  Package,
  HelpCircle,
  X,
  ArrowRight,
  TrendingUp,
  Clock,
  LogOut,
  LogIn,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeRoute,
    navigate,
    cartTotalCount,
    cartGrandTotal,
    wishlist,
    comparedProducts,
    unreadNotificationsCount,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    userProfile,
    isAuthenticated,
    isAdmin,
    signOut,
    categoriesList,
    searchQuery,
    setSearchQuery,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    theme,
    toggleTheme,
    currency,
    toggleCurrency,
    formatPrice,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    setSelectedCategorySlug,
  } = useShop();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedSearchCat, setSelectedSearchCat] = useState('All');
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setIsAccountOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    addRecentSearch(searchQuery.trim());
    setIsSearchFocused(false);
    navigate('products', { q: searchQuery.trim(), cat: selectedSearchCat });
  };

  const currentAddress =
    addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white text-xs py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="flex items-center gap-1.5 font-semibold text-amber-400">
              <Sparkles className="w-3.5 h-3.5" /> Grand Festive Gala
            </span>
            <span className="hidden md:inline text-slate-300">
              Use code <strong className="text-white underline decoration-amber-400">FESTIVAL50</strong> for up to ₹7,500 instant discount on flagships.
            </span>
            <span className="hidden lg:inline text-slate-400">·</span>
            <span className="hidden lg:inline text-slate-300">Complimentary White-Glove Delivery over ₹1,000</span>
          </div>

          <div className="flex items-center gap-4 shrink-0 text-slate-300">
            <button
              onClick={() => navigate('offers')}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Today&apos;s Deals
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={toggleCurrency}
              className="hover:text-white transition-colors cursor-pointer font-medium"
              title="Switch Currency"
            >
              Currency: <span className="text-white font-bold">{currency}</span>
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => navigate('support')}
              className="hover:text-white transition-colors cursor-pointer hidden sm:inline"
            >
              24/7 Concierge
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-4 sm:gap-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => {
                setSelectedCategorySlug(null);
                setSearchQuery('');
                navigate('home');
              }}
              className="flex items-center gap-2 group cursor-pointer text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-900 via-indigo-700 to-indigo-500 text-white flex items-center justify-center font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
                A
              </div>
              <div>
                <span className="text-2xl font-extrabold tracking-tight font-display bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-indigo-200 dark:to-slate-200 bg-clip-text text-transparent">
                  AURA
                </span>
                <span className="block text-[9px] uppercase tracking-widest font-semibold text-indigo-800 dark:text-indigo-400 -mt-1">
                  Grand Luxury
                </span>
              </div>
            </button>

            {/* Delivery Location Selector */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-indigo-700 dark:text-indigo-400 shrink-0" />
              <div className="text-xs leading-tight">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">
                  Deliver to {currentAddress?.name?.split(' ')[0] || 'Guest'}
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate max-w-[130px]">
                  {currentAddress?.city} {currentAddress?.pincode}
                </span>
              </div>
            </button>
          </div>

          {/* Search Bar with live autocomplete */}
          <div ref={searchRef} className="flex-1 max-w-2xl relative">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600/20 transition-all overflow-hidden shadow-xs"
            >
              <div className="hidden sm:block border-r border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                <select
                  value={selectedSearchCat}
                  onChange={(e) => setSelectedSearchCat(e.target.value)}
                  className="bg-transparent outline-none cursor-pointer pr-1"
                >
                  <option value="All" className="dark:bg-slate-800">All Categories</option>
                  {categoriesList.slice(0, 12).map((c) => (
                    <option key={c.id} value={c.name} className="dark:bg-slate-800">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <input
                type="text"
                placeholder="Search iPhone 16 Pro, Herman Miller, Tissot, Silk Couture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full bg-transparent px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 transition-colors flex items-center justify-center cursor-pointer shrink-0"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Predictive Autocomplete Dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {recentSearches.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Recent Searches
                      </span>
                      <button
                        onClick={clearRecentSearches}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-[11px] normal-case cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setSearchQuery(term);
                            setIsSearchFocused(false);
                            navigate('products', { q: term });
                          }}
                          className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg cursor-pointer transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-indigo-500" /> Trending Searches
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                    {[
                      'Sony WH-1000XM5 ANC',
                      'MacBook Pro M3 Max',
                      'Breville Barista Espresso',
                      'Mulberry Silk Midi Dress',
                      'Garmin Fenix 8 Solar',
                      'PS5 Pro 2TB Console',
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSearchQuery(item);
                          setIsSearchFocused(false);
                          navigate('products', { q: item });
                        }}
                        className="text-left py-1 px-2 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate cursor-pointer"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Zone: Compare, Wishlist, Notifications, Cart, Account, Theme */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Compare Badge */}
            {comparedProducts.length > 0 && (
              <button
                onClick={() => navigate('compare')}
                className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-100 transition-colors cursor-pointer"
                title="Compare Products"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Compare ({comparedProducts.length})</span>
              </button>
            )}

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Wishlist */}
            <button
              onClick={() => navigate('wishlist')}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Notification Bell Dropdown */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      Notifications
                      {unreadNotificationsCount > 0 && (
                        <span className="text-xs bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full font-bold">
                          {unreadNotificationsCount} new
                        </span>
                      )}
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto mt-2">
                    {notifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          markNotificationAsRead(item.id);
                          if (item.link) {
                            setIsNotifOpen(false);
                            navigate(item.link);
                          }
                        }}
                        className={`py-3 px-2 rounded-lg cursor-pointer transition-colors ${
                          !item.read
                            ? 'bg-indigo-50/50 dark:bg-indigo-950/20'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {item.title}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">{item.date}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                          {item.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={() => navigate('cart')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-xs cursor-pointer group"
              title="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartTotalCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center">
                    {cartTotalCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-left text-xs leading-none">
                <span className="block text-[10px] opacity-75">Cart</span>
                <span className="font-bold">{formatPrice(cartGrandTotal)}</span>
              </div>
            </button>

            {/* Account & Auth Zone */}
            {!isAuthenticated ? (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => navigate('auth', { mode: 'signin' })}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <LogIn className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => navigate('auth', { mode: 'signup' })}
                  className="hidden sm:flex items-center px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shadow-xs"
                >
                  Register
                </button>
              </div>
            ) : (
              <div ref={accountRef} className="relative">
                <button
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-600/30"
                  />
                  <span className="hidden md:inline text-xs font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    {userProfile.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
                </button>

                {isAccountOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50">
                    <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 rounded-xl mb-2">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {userProfile.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {userProfile.email}
                      </div>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                        {isAdmin ? 'Admin Executive' : userProfile.tier}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <button
                        onClick={() => {
                          setIsAccountOpen(false);
                          navigate('account');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                      >
                        <User className="w-4 h-4 text-indigo-500" />
                        My Profile & Settings
                      </button>
                      <button
                        onClick={() => {
                          setIsAccountOpen(false);
                          navigate('orders');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                      >
                        <Package className="w-4 h-4 text-indigo-500" />
                        My Orders & Live Tracking
                      </button>
                      <button
                        onClick={() => {
                          setIsAccountOpen(false);
                          navigate('wishlist');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                      >
                        <Heart className="w-4 h-4 text-indigo-500" />
                        My Wishlist ({wishlist.length})
                      </button>
                      <button
                        onClick={() => {
                          setIsAccountOpen(false);
                          navigate('offers');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                      >
                        <Percent className="w-4 h-4 text-indigo-500" />
                        Coupons & Privileges
                      </button>
                      <button
                        onClick={() => {
                          setIsAccountOpen(false);
                          navigate('support');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                      >
                        <HelpCircle className="w-4 h-4 text-indigo-500" />
                        Help & Concierge Support
                      </button>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                        <button
                          onClick={() => {
                            setIsAccountOpen(false);
                            navigate('admin');
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors cursor-pointer shadow-xs"
                        >
                          <span className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" />
                            Admin Console
                          </span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setIsAccountOpen(false);
                            signOut();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-semibold text-left transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out / Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mega Menu Navigation Bar */}
      <div className="border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between text-xs font-semibold overflow-x-auto no-scrollbar py-2 gap-4">
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* All 28 Categories Button */}
            <button
              onClick={() => setIsMegaMenuOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-200/70 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
            >
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>All 28 Categories</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {/* Quick Category Ribbon Links */}
            {[
              { label: 'Mobiles & Tablets', slug: 'mobiles-tablets' },
              { label: 'Laptops', slug: 'laptops-computers' },
              { label: 'Audio & Hi-Fi', slug: 'audio-headphones' },
              { label: 'Watches', slug: 'watches' },
              { label: "Men's Fashion", slug: 'mens-clothing' },
              { label: "Women's Fashion", slug: 'womens-clothing' },
              { label: 'Furniture', slug: 'furniture' },
              { label: 'Appliances', slug: 'appliances' },
              { label: 'Gourmet', slug: 'grocery-food' },
            ].map((cat) => (
              <button
                key={cat.slug}
                onClick={() => {
                  setSelectedCategorySlug(cat.slug);
                  navigate('products', { cat: cat.label });
                }}
                className="whitespace-nowrap px-2.5 py-1 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('offers')}
              className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
            >
              <Percent className="w-3.5 h-3.5" />
              <span>Festival Offers</span>
            </button>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <button
              onClick={() => navigate('admin')}
              className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer font-bold"
            >
              Admin Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Mega Menu Modal / Full Catalog Drawer */}
      {isMegaMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-start justify-center pt-16 px-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-6xl max-h-[85vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                  AURA Department Directory
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Browse over 28 luxury curated departments and premium international brand boutiques.
                </p>
              </div>
              <button
                onClick={() => setIsMegaMenuOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categoriesList.filter((c) => c.status !== 'Hidden').map((cat) => (
                <div
                  key={cat.id}
                  className="group p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                >
                  <button
                    onClick={() => {
                      setSelectedCategorySlug(cat.slug);
                      setIsMegaMenuOpen(false);
                      navigate('products', { cat: cat.name });
                    }}
                    className="flex items-center gap-3 w-full text-left cursor-pointer mb-2"
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {cat.name}
                      </h4>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {cat.productCount} Items
                      </span>
                    </div>
                  </button>

                  <ul className="text-xs space-y-1 text-slate-500 dark:text-slate-400 pl-2 border-l border-slate-200 dark:border-slate-800">
                    {cat.subcategories.slice(0, 4).map((sub, i) => (
                      <li key={i}>
                        <button
                          onClick={() => {
                            setSelectedCategorySlug(cat.slug);
                            setIsMegaMenuOpen(false);
                            navigate('products', { cat: cat.name, sub });
                          }}
                          className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left block truncate w-full"
                        >
                          {sub}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Location Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-600" />
                Select Delivery Destination
              </h3>
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Delivery schedules and inventory availability are calculated based on your pin code.
            </p>

            <div className="space-y-3 mb-6">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => {
                    setSelectedAddressId(addr.id);
                    setIsLocationModalOpen(false);
                  }}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    selectedAddressId === addr.id
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-1 ring-indigo-600'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {addr.name} ({addr.type})
                    </span>
                    {addr.isDefault && (
                      <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded font-medium">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-1">
                    {addr.addressLine}, {addr.locality}
                  </p>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setIsLocationModalOpen(false);
                navigate('account');
              }}
              className="w-full py-2.5 rounded-xl border border-dashed border-indigo-400 dark:border-indigo-600 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-xs font-semibold transition-colors cursor-pointer"
            >
              + Add or Manage Saved Addresses
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
