import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Address } from '../../types';
import {
  User,
  MapPin,
  CreditCard,
  Crown,
  ShieldCheck,
  Plus,
  Trash2,
  Package,
  Heart,
  HelpCircle,
  Check,
  LogOut,
  LogIn,
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const {
    userProfile,
    isAuthenticated,
    isAdmin,
    signOut,
    updateProfile,
    addresses,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    orders,
    wishlist,
    navigate,
    showToast,
  } = useShop();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);

  const [isNewAddressOpen, setIsNewAddressOpen] = useState(false);
  const [addrName, setAddrName] = useState(userProfile.name);
  const [addrPhone, setAddrPhone] = useState(userProfile.phone);
  const [addrLine, setAddrLine] = useState('');
  const [addrLocality, setAddrLocality] = useState('');
  const [addrCity, setAddrCity] = useState('Mumbai');
  const [addrState, setAddrState] = useState('Maharashtra');
  const [addrPincode, setAddrPincode] = useState('400026');
  const [addrType, setAddrType] = useState<'Home' | 'Work'>('Home');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email, phone });
    setIsEditingProfile(false);
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrLine) return;
    addAddress({
      name: addrName,
      phone: addrPhone,
      addressLine: addrLine,
      locality: addrLocality || 'Downtown',
      city: addrCity,
      state: addrState,
      pincode: addrPincode,
      type: addrType,
      isDefault: false,
    });
    setIsNewAddressOpen(false);
    setAddrLine('');
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-lg mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
          Sign In to Access Your Profile
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage your saved addresses, Diamond VIP rewards, order history, and account preferences.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => navigate('auth', { mode: 'signin', redirect: 'account' })}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
          <button
            onClick={() => navigate('auth', { mode: 'signup', redirect: 'account' })}
            className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer"
          >
            Create New Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={userProfile.avatar}
            alt={userProfile.name}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/10 shadow-lg"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold font-display">{userProfile.name}</h1>
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                <Crown className="w-3 h-3 fill-current" /> {isAdmin ? 'Admin Executive' : userProfile.tier}
              </span>
            </div>
            <p className="text-xs text-slate-300">{userProfile.email} · {userProfile.phone}</p>
            <p className="text-[11px] text-slate-400">Distinguished Member since {userProfile.memberSince}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold cursor-pointer transition-colors"
          >
            {isEditingProfile ? 'Cancel Edit' : 'Edit Profile Information'}
          </button>
          {isAdmin && (
            <button
              onClick={() => navigate('admin')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Console</span>
            </button>
          )}
          <button
            onClick={signOut}
            className="px-4 py-2.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Form */}
      {isEditingProfile && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs animate-in fade-in duration-150">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
            Edit Personal Details
          </h3>
          <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Primary Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5"
              />
            </div>
            <div className="sm:col-span-3 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIP Perks Strip */}
      <div className="p-6 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 text-xs">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Crown className="w-4 h-4 text-amber-500" />
          Active Diamond VIP Privileges
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="text-slate-700 dark:text-slate-300">Complimentary Insured Air Express on every order</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="text-slate-700 dark:text-slate-300">24/7 Priority Dedicated Concierge Desk</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="text-slate-700 dark:text-slate-300">Early 24-hour access to Limited Edition releases</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="text-slate-700 dark:text-slate-300">White-glove technician assembly & setup</span>
          </div>
        </div>
      </div>

      {/* Saved Addresses Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-600" />
              Saved Delivery Addresses ({addresses.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage residences and corporate delivery hubs.
            </p>
          </div>
          <button
            onClick={() => setIsNewAddressOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Address</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-5 rounded-2xl border transition-all text-xs space-y-2 ${
                addr.isDefault
                  ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20 ring-1 ring-indigo-600'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {addr.name} ({addr.type})
                </span>
                {addr.isDefault ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-600 text-white uppercase">
                    Default
                  </span>
                ) : (
                  <button
                    onClick={() => setDefaultAddress(addr.id)}
                    className="text-[11px] text-indigo-600 hover:underline cursor-pointer"
                  >
                    Set as Default
                  </button>
                )}
              </div>

              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {addr.addressLine}, {addr.locality}
              </p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {addr.city}, {addr.state} - {addr.pincode}
              </p>
              <p className="text-slate-500">Phone: {addr.phone}</p>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => deleteAddress(addr.id)}
                  disabled={addr.isDefault}
                  className="text-rose-500 hover:text-rose-700 text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-30"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Address Modal */}
      {isNewAddressOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display mb-1">
              Add New Address
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter your complete address for accurate delivery routing.
            </p>

            <form onSubmit={handleCreateAddress} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Contact Name</label>
                  <input
                    type="text"
                    required
                    value={addrName}
                    onChange={(e) => setAddrName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    required
                    value={addrPhone}
                    onChange={(e) => setAddrPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="Building, flat, street"
                  value={addrLine}
                  onChange={(e) => setAddrLine(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Locality</label>
                  <input
                    type="text"
                    value={addrLocality}
                    onChange={(e) => setAddrLocality(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    value={addrPincode}
                    onChange={(e) => setAddrPincode(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewAddressOpen(false)}
                  className="flex-1 py-2 rounded-xl border font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-indigo-600 text-white font-bold cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
