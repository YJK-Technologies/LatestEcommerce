import React from 'react';
import { useShop } from '../../context/ShopContext';
import { ProductImage } from '../../components/Common/ProductImage';
import { Heart, ShoppingBag, Trash2, ArrowRight, Star } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist, addToCart, formatPrice, navigate, showToast } = useShop();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto mb-4">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">
          Your Wishlist is Empty
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-6">
          Save luxury creations that catch your eye. Track price drops and limited inventory releases here.
        </p>
        <button
          onClick={() => navigate('products')}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
        >
          Explore Signature Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            My Wishlist ({wishlist.length} items)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Items saved for future acquisition. Automatic alerts are active for price decreases.
          </p>
        </div>
        <button
          onClick={() => {
            wishlist.forEach((p) => addToCart(p));
            showToast('All Items Added', 'Moved entire wishlist to shopping bag', 'success');
          }}
          className="px-4 py-2.5 rounded-xl border border-indigo-600 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-xs font-semibold cursor-pointer"
        >
          Move All to Cart
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div
            key={product.id}
            className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div className="relative h-56 w-full shrink-0 overflow-hidden bg-slate-50 dark:bg-slate-800">
              <ProductImage
                src={product.image}
                alt={product.title}
                category={product.category}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="absolute top-2.5 right-2.5 p-2 rounded-xl bg-white/90 dark:bg-slate-900/90 text-rose-500 hover:bg-rose-50 shadow-md cursor-pointer transition-colors"
                title="Remove from Wishlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {product.brand}
                </span>
                <h3
                  onClick={() => navigate('product-detail', { id: product.id })}
                  className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mt-0.5 hover:text-indigo-600 cursor-pointer"
                >
                  {product.title}
                </h3>
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-extrabold text-slate-900 dark:text-white tabular-nums">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-slate-400 line-through tabular-nums">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    addToCart(product);
                    removeFromWishlist(product.id);
                  }}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Move to Cart</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
