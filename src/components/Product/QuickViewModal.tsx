import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { ProductImage } from '../Common/ProductImage';
import { X, Star, ShoppingBag, Heart, Check, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigate,
    formatPrice,
  } = useShop();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedStorage, setSelectedStorage] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (quickViewProduct) {
      setActiveImageIndex(0);
      setSelectedColor(quickViewProduct.colors?.[0]?.name);
      setSelectedSize(quickViewProduct.sizes?.[0]);
      setSelectedStorage(quickViewProduct.storage?.[0]);
      setQuantity(1);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const isFavorited = isInWishlist(quickViewProduct.id);
  const images = quickViewProduct.gallery?.length
    ? quickViewProduct.gallery
    : [quickViewProduct.image];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative my-8">
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery Column */}
          <div className="p-6 bg-slate-50 dark:bg-slate-800/40 flex flex-col justify-between">
            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden shadow-inner mb-4">
              <ProductImage
                src={images[activeImageIndex] || quickViewProduct.image}
                alt={quickViewProduct.title}
                category={quickViewProduct.category}
                className="w-full h-full"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-indigo-600 scale-105'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <ProductImage src={img} alt="Thumbnail" className="w-full h-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Column */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                <span>{quickViewProduct.brand}</span>
                <span className="text-slate-400 font-normal">{quickViewProduct.subcategory}</span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                {quickViewProduct.title}
              </h2>

              <div className="flex items-center gap-2 mt-2 text-xs">
                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-md font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{quickViewProduct.rating}</span>
                </div>
                <span className="text-slate-500 dark:text-slate-400">
                  ({quickViewProduct.reviewsCount.toLocaleString()} reviews)
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  In Stock ({quickViewProduct.stockCount} units)
                </span>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 mt-4 py-3 border-y border-slate-100 dark:border-slate-800">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                  {formatPrice(quickViewProduct.price)}
                </span>
                {quickViewProduct.originalPrice > quickViewProduct.price && (
                  <span className="text-sm text-slate-400 line-through tabular-nums">
                    {formatPrice(quickViewProduct.originalPrice)}
                  </span>
                )}
                {quickViewProduct.discount > 0 && (
                  <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded">
                    Save {quickViewProduct.discount}%
                  </span>
                )}
              </div>

              {/* Color Variants */}
              {quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
                <div className="mt-4">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Finish: <span className="text-slate-900 dark:text-white">{selectedColor}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    {quickViewProduct.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center ${
                          selectedColor === c.name
                            ? 'border-indigo-600 scale-110 shadow-xs'
                            : 'border-slate-300 dark:border-slate-700 hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      >
                        {selectedColor === c.name && (
                          <Check className="w-3.5 h-3.5 text-white mix-blend-difference" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Storage Variants */}
              {quickViewProduct.storage && quickViewProduct.storage.length > 0 && (
                <div className="mt-4">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Storage Capacity
                  </span>
                  <div className="flex gap-2">
                    {quickViewProduct.storage.map((st) => (
                      <button
                        key={st}
                        onClick={() => setSelectedStorage(st)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          selectedStorage === st
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                            : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Variants */}
              {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
                <div className="mt-4">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Select Size
                  </span>
                  <div className="flex gap-2">
                    {quickViewProduct.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`w-9 h-9 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center justify-center ${
                          selectedSize === sz
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="flex items-center gap-4 mt-4">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Quantity
                </span>
                <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    addToCart(
                      quickViewProduct,
                      quantity,
                      selectedColor,
                      selectedSize,
                      selectedStorage
                    );
                    setQuickViewProduct(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add {quantity} to Cart · {formatPrice(quickViewProduct.price * quantity)}
                </button>

                <button
                  onClick={() => toggleWishlist(quickViewProduct)}
                  className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                    isFavorited
                      ? 'border-rose-200 bg-rose-50 text-rose-600 dark:bg-rose-950/40'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-rose-500'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>

              <button
                onClick={() => {
                  const id = quickViewProduct.id;
                  setQuickViewProduct(null);
                  navigate('product-detail', { id });
                }}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 py-1 transition-colors cursor-pointer"
              >
                <span>View Full Specifications & Customer Reviews</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
