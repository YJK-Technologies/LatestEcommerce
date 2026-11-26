import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import {
  Percent,
  Sparkles,
  Zap,
  Clock,
  Copy,
  Check,
  CreditCard,
  Tag,
  ArrowRight,
  Gift,
} from 'lucide-react';

export const OffersPage: React.FC = () => {
  const { couponsList, applyCoupon, formatPrice, navigate, showToast } = useShop();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 32,
    seconds: 40,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    applyCoupon(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Festive Offers Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 rounded-3xl p-8 sm:p-12 border border-indigo-800/40 text-white shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 text-amber-300 backdrop-blur-md text-xs font-bold uppercase tracking-widest border border-white/10">
            <Sparkles className="w-3.5 h-3.5" /> AURA Festival Sale Privileges
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-white">
            Grand Festive Offers & VIP Coupon Codes
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
            Save up to 25% across flagship smartphones, M3 MacBooks, Swiss automatic timepieces, and Italian designer apparel.
          </p>

          {/* Countdown Clock */}
          <div className="pt-2 flex items-center gap-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Gala Closes In:
            </span>
            <div className="flex items-center gap-2 font-mono font-black text-sm">
              <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/20">
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span>:</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/20">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span>:</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/20 text-amber-400">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Coupons Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" /> Verified Promo Codes
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
              Exclusive Member Coupons
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {couponsList.map((cp) => {
            const isApplied = copiedCode === cp.code;

            return (
              <div
                key={cp.code}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-xs hover:border-indigo-500/40 hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-sm font-black px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-dashed border-indigo-300 dark:border-indigo-800 tracking-wider">
                      {cp.code}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Expires {cp.expiryDate}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {cp.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {cp.description}
                  </p>
                  <div className="text-[11px] text-slate-400 mt-2">
                    Min Cart Spend: <strong className="text-slate-700 dark:text-slate-300">{formatPrice(cp.minSpend)}</strong>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 truncate max-w-[150px]">
                    {cp.terms}
                  </span>

                  <button
                    onClick={() => handleCopyCode(cp.code)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors cursor-pointer"
                  >
                    {isApplied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Applied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Apply Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bank & Financial Partner Rebates */}
      <section>
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5" /> Banking Partnerships
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
            Bank Credit & Debit Card Rebates
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              bank: 'HDFC Bank',
              title: 'Flat ₹5,000 Instant Cashback',
              card: 'Infinia, Regalia, Diners Club Black',
              code: 'HDFCSPECIAL',
              min: 40000,
            },
            {
              bank: 'ICICI Bank',
              title: '10% Instant Rebate up to ₹4,000',
              card: 'Sapphiro & Emeralde Credit Cards',
              code: 'ICICILUXE',
              min: 30000,
            },
            {
              bank: 'Axis Bank',
              title: 'Flat ₹3,500 Instant Discount',
              card: 'Magnus & Olympus Credit Cards',
              code: 'AXISVIP',
              min: 25000,
            },
          ].map((b, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-indigo-600 dark:text-indigo-400">
                  {b.bank}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {b.code}
                </span>
              </div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                {b.title}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Eligible on {b.card}. Minimum transaction value {formatPrice(b.min)}.
              </p>
              <button
                onClick={() => applyCoupon('FESTIVAL50')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer pt-2"
              >
                <span>Shop Eligible Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
