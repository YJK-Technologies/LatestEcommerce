import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { ProductImage } from '../../components/Common/ProductImage';
import {
  ShoppingBag,
  Trash2,
  Heart,
  Bookmark,
  ArrowRight,
  ShieldCheck,
  Tag,
  Check,
  X,
  Truck,
  RotateCcw,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    saveForLater,
    savedForLater,
    moveToCartFromSaved,
    toggleWishlist,
    cartTotalCount,
    cartSubtotal,
    cartDiscount,
    cartCouponDiscount,
    cartShipping,
    cartTax,
    cartGrandTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    couponsList,
    formatPrice,
    navigate,
    showToast,
  } = useShop();

  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    applyCoupon(couponInput.trim());
    setCouponInput('');
  };

  if (cart.length === 0 && savedForLater.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">
          Your Shopping Bag is Empty
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-2 mb-8">
          Explore our signature catalog of flagship tech, runway fashion, fine horology, and architectural home living.
        </p>
        <button
          onClick={() => navigate('products')}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
        >
          Discover New Arrivals
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Title & Free Shipping Indicator */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
          Shopping Bag ({cartTotalCount} items)
        </h1>
        <div className="mt-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 flex items-center gap-2.5 text-xs text-indigo-900 dark:text-indigo-200">
          <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            {cartShipping === 0 ? (
              <strong className="text-emerald-600 dark:text-emerald-400">
                ✓ Complimentary White-Glove Shipping Unlocked!
              </strong>
            ) : (
              'Add ₹1,000 more to your bag to unlock complimentary insured shipping.'
            )}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Items in Bag (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden shadow-xs">
            {cart.map((item, idx) => (
              <div key={idx} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-4 items-start flex-1 min-w-0">
                  <div
                    onClick={() => navigate('product-detail', { id: item.product.id })}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 cursor-pointer"
                  >
                    <ProductImage
                      src={item.product.image}
                      alt={item.product.title}
                      category={item.product.category}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {item.product.brand}
                    </span>
                    <h3
                      onClick={() => navigate('product-detail', { id: item.product.id })}
                      className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 hover:text-indigo-600 cursor-pointer transition-colors"
                    >
                      {item.product.title}
                    </h3>

                    {/* Variant tags */}
                    <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      {item.selectedColor && (
                        <span>Finish: <strong className="text-slate-800 dark:text-slate-200">{item.selectedColor}</strong></span>
                      )}
                      {item.selectedStorage && (
                        <span>Storage: <strong className="text-slate-800 dark:text-slate-200">{item.selectedStorage}</strong></span>
                      )}
                      {item.selectedSize && (
                        <span>Size: <strong className="text-slate-800 dark:text-slate-200">{item.selectedSize}</strong></span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                      {item.product.originalPrice > item.product.price && (
                        <span className="text-xs text-slate-400 line-through tabular-nums">
                          {formatPrice(item.product.originalPrice * item.quantity)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right controls: Stepper & Remove */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-800">
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer font-bold text-xs"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <button
                      onClick={() => saveForLater(item.product.id)}
                      className="hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1"
                      title="Save for Later"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span className="hidden md:inline">Save</span>
                    </button>
                    <button
                      onClick={() => {
                        toggleWishlist(item.product);
                        removeFromCart(item.product.id);
                      }}
                      className="hover:text-rose-500 transition-colors cursor-pointer flex items-center gap-1"
                      title="Move to Wishlist"
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span className="hidden md:inline">Wishlist</span>
                    </button>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-rose-500 hover:text-rose-700 transition-colors cursor-pointer p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Saved for Later Section */}
          {savedForLater.length > 0 && (
            <div className="mt-8">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display mb-3">
                Saved for Later ({savedForLater.length})
              </h3>
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                {savedForLater.map((sItem, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                        <ProductImage src={sItem.product.image} alt={sItem.product.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                          {sItem.product.title}
                        </h4>
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white tabular-nums">
                          {formatPrice(sItem.product.price)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => moveToCartFromSaved(sItem)}
                      className="px-3 py-1.5 rounded-lg border border-indigo-600 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 text-xs font-semibold cursor-pointer"
                    >
                      Move to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Price Summary & Coupon (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Apply Coupon Box */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-indigo-600" />
              Promotional Coupon
            </h3>

            {appliedCoupon ? (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-xs text-emerald-800 dark:text-emerald-300">
                    {appliedCoupon.code}
                  </span>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                    {appliedCoupon.title}
                  </p>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-rose-600 dark:text-rose-400 font-bold hover:underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code (e.g. FESTIVAL50)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono uppercase tracking-wider text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 cursor-pointer"
                >
                  Apply
                </button>
              </form>
            )}

            {/* Quick Available Coupons snippet */}
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">
                Suggested Coupons:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {couponsList.slice(0, 3).map((cp) => (
                  <button
                    key={cp.code}
                    onClick={() => applyCoupon(cp.code)}
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-dashed border-indigo-300 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 cursor-pointer"
                  >
                    {cp.code}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Price Breakdown Sidebar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Order Summary
            </h3>

            <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
              <div className="flex justify-between text-slate-600 dark:text-slate-400 pt-1">
                <span>Subtotal ({cartTotalCount} items)</span>
                <span className="tabular-nums font-semibold text-slate-900 dark:text-white">
                  {formatPrice(cartSubtotal)}
                </span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 pt-2">
                  <span>Product Savings</span>
                  <span className="tabular-nums font-bold">-{formatPrice(cartDiscount)}</span>
                </div>
              )}

              {cartCouponDiscount > 0 && (
                <div className="flex justify-between text-indigo-600 dark:text-indigo-400 pt-2">
                  <span>Coupon ({appliedCoupon?.code})</span>
                  <span className="tabular-nums font-bold">-{formatPrice(cartCouponDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600 dark:text-slate-400 pt-2">
                <span>Estimated GST & Tax (18%)</span>
                <span className="tabular-nums font-semibold text-slate-900 dark:text-white">
                  {formatPrice(cartTax)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400 pt-2">
                <span>Insured Doorstep Delivery</span>
                <span className="tabular-nums font-semibold">
                  {cartShipping === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    formatPrice(cartShipping)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-3">
                <span>Grand Total</span>
                <span className="tabular-nums text-lg text-indigo-600 dark:text-indigo-400">
                  {formatPrice(cartGrandTotal)}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('checkout')}
              disabled={cart.length === 0}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Safe 256-Bit SSL Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
