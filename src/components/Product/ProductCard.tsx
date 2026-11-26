import React from 'react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';
import { ProductImage } from '../Common/ProductImage';
import { Heart, Eye, SlidersHorizontal, Star, ShoppingBag, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode = 'grid',
}) => {
  const {
    navigate,
    addToCart,
    cart,
    toggleWishlist,
    isInWishlist,
    addToCompare,
    isInCompare,
    setQuickViewProduct,
    formatPrice,
  } = useShop();

  const isFavorited = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);
  const cartItem = cart.find((item) => item.product.id === product.id);

  const handleCardClick = (e: React.MouseEvent) => {
    // If not clicking a button inside
    if ((e.target as HTMLElement).closest('button')) return;
    navigate('product-detail', { id: product.id });
  };

  if (viewMode === 'list') {
    return (
      <div
        onClick={handleCardClick}
        className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 hover:shadow-xl hover:border-indigo-500/30 transition-all duration-300 flex flex-col sm:flex-row gap-5 cursor-pointer relative"
      >
        <div className="w-full sm:w-56 h-56 shrink-0 rounded-xl overflow-hidden relative">
          <ProductImage
            src={product.image}
            alt={product.title}
            category={product.category}
            className="w-full h-full"
          />

          {product.isBestSeller && (
            <span className="absolute top-2 left-2 bg-slate-950/90 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider backdrop-blur-xs">
              Best Seller
            </span>
          )}
          {product.isNewArrival && (
            <span className="absolute top-2 left-2 bg-indigo-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider backdrop-blur-xs">
              New Arrival
            </span>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {product.brand}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    isFavorited
                      ? 'border-rose-200 bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:border-rose-800'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCompare(product);
                  }}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    isCompared
                      ? 'border-indigo-200 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Compare"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuickViewProduct(product);
                  }}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  title="Quick View"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {product.title}
            </h3>

            <div className="flex items-center gap-2 mt-1.5 text-xs">
              <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-md font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{product.rating}</span>
              </div>
              <span className="text-slate-500 dark:text-slate-400">
                ({product.reviewsCount.toLocaleString()} reviews)
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-slate-500 dark:text-slate-400">{product.subcategory}</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-xs text-slate-400 line-through tabular-nums">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                {product.freeDelivery ? '✓ Free Express Delivery' : 'Standard Shipping'}
              </span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-xs cursor-pointer"
            >
              {cartItem ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>In Cart ({cartItem.quantity})</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid Card
  return (
    <div
      onClick={handleCardClick}
      className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative"
    >
      {/* Product Image Area */}
      <div className="relative h-56 w-full shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800/50">
        <ProductImage
          src={product.image}
          alt={product.title}
          category={product.category}
          className="w-full h-full group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.isBestSeller && (
            <span className="bg-slate-950/90 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider backdrop-blur-xs shadow-xs">
              Best Seller
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
              New
            </span>
          )}
          {product.isLimitedOffer && (
            <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
              Limited Deal
            </span>
          )}
        </div>

        {/* Quick Action Floating Pill */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10 transition-opacity duration-200">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`p-2 rounded-xl backdrop-blur-md shadow-md transition-all cursor-pointer ${
              isFavorited
                ? 'bg-rose-500 text-white'
                : 'bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:text-rose-500'
            }`}
            title="Save to Wishlist"
            aria-label="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="p-2 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-700 dark:text-slate-300 hover:text-indigo-600 shadow-md transition-all cursor-pointer opacity-0 group-hover:opacity-100"
            title="Quick View"
            aria-label="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              addToCompare(product);
            }}
            className={`p-2 rounded-xl backdrop-blur-md shadow-md transition-all cursor-pointer opacity-0 group-hover:opacity-100 ${
              isCompared
                ? 'bg-indigo-600 text-white opacity-100'
                : 'bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:text-indigo-600'
            }`}
            title="Compare"
            aria-label="Compare"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Info Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-bold uppercase tracking-wider text-slate-400">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 min-h-[2.5rem] leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {product.title}
          </h3>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through tabular-nums">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {product.discount > 0 && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 ml-auto">
                {product.discount}% OFF
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all duration-200 cursor-pointer group-hover:bg-indigo-600 group-hover:text-white shadow-xs"
          >
            {cartItem ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>In Cart ({cartItem.quantity})</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
