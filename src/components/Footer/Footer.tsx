import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  ChevronUp,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, showToast } = useShop();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Newsletter', 'Please enter a valid email address', 'error');
      return;
    }
    showToast('Subscribed!', 'Welcome to AURA Private Client newsletters. Check your inbox.', 'success');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 transition-colors">
      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        className="w-full py-3 bg-slate-900/80 hover:bg-slate-900 text-slate-300 hover:text-white flex items-center justify-center gap-1.5 font-semibold text-xs transition-colors border-b border-slate-800 cursor-pointer"
      >
        <span>Back to top</span>
        <ChevronUp className="w-4 h-4" />
      </button>

      {/* Trust Pillar Strip */}
      <div className="border-b border-slate-900 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-950/60 text-indigo-400 border border-indigo-900/50">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">100% Genuine Certified</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Direct-sourced from luxury brand ateliers & verified makers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-950/60 text-indigo-400 border border-indigo-900/50">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">White-Glove Shipping</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Complimentary insured express delivery on orders over ₹1,000.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-950/60 text-indigo-400 border border-indigo-900/50">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">10-Day Easy Returns</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Doorstep pickup with instantaneous source refund issuance.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-950/60 text-indigo-400 border border-indigo-900/50">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">256-Bit SSL Security</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                End-to-end encrypted tokenization with instant banking UPI.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 pr-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-base">
                A
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-display">
                AURA
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4 max-w-sm">
              The premier grand e-commerce destination in South Asia, unifying authentic global technology, runway couture, master horology, and architectural home living.
            </p>

            {/* Newsletter */}
            <form onSubmit={handleSubscribe} className="space-y-2">
              <span className="text-xs font-semibold text-slate-200 block">
                Join AURA Private Client Newsletter
              </span>
              <div className="flex max-w-sm rounded-xl overflow-hidden border border-slate-800 bg-slate-900 focus-within:border-indigo-500">
                <input
                  type="email"
                  placeholder="Enter your VIP email address..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-transparent px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none flex-1"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Join</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

          {/* Col 2 */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Popular Boutiques
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('products', { cat: 'Mobiles & Tablets' })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Flagship Smartphones
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('products', { cat: 'Laptops & Computers' })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Apple Silicon & Gaming PCs
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('products', { cat: 'Luxury Watches' })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Swiss Horology
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('products', { cat: 'Designer Furniture' })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Herman Miller & Living Atelier
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('products', { cat: 'Fine Jewelry' })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Fine Jewelry & Solitaires
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('offers')}
                  className="text-amber-400 hover:text-amber-300 font-semibold transition-colors cursor-pointer"
                >
                  Exclusive Festive Offers
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Client Concierge
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('orders')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Track Active Shipments
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('support')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Help Center & FAQs
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('support')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  24/7 Live Concierge Chat
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('account')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Manage Delivery Addresses
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('support')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Doorstep Returns & Inspection
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Platform & Governance
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('admin')}
                  className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3" />
                  Admin Executive Center
                </button>
              </li>
              <li>
                <span className="text-slate-500">Security & ISO 27001</span>
              </li>
              <li>
                <span className="text-slate-500">Terms of Luxury Service</span>
              </li>
              <li>
                <span className="text-slate-500">Privacy & Cookie Protocol</span>
              </li>
              <li>
                <span className="text-slate-500">Responsible Sourcing Charter</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with payment logos simulation */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 AURA International Retail Group. UI Template & Workflow Demonstration Platform.
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
              UPI
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
              VISA
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
              MASTERCARD
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
              AMEX
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
              NETBANKING
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
              COD
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
